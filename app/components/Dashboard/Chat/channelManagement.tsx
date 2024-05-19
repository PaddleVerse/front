"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/newinput";
import MemberList from "./MemberList";
import { useForm } from "react-hook-form";
import {
  channel,
  participants,
  participantWithUser,
  user,
} from "@/app/Dashboard/Chat/type";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { useGlobalState } from "../../Sign/GlobalState";
import InviteCard from "./InviteCard";
import { FaPlus, FaTimes } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { fetchData } from "@/app/utils";

const fetchParticipants = async (channel: channel, user: user, setParticipants: React.Dispatch<React.SetStateAction<participantWithUser[]>>) => {
  try {
    const participants = await fetchData(
      `/channels/participants/${channel.id}?uid=${user.id}`,
      "GET",
      null
    );
    if (!participants || !participants.data) return [];
    
    const ret = await Promise.all(
      participants.data.map(async (participant: participants) => {
        const user = await fetchData(
          `/user/${participant?.user_id}`,
          "GET",
          null
        );
        if (!user) return null;
        return { ...participant, user: user.data };
      })
    );
    const filteredParticipants = ret.filter(Boolean); // Filter out any null values
    setParticipants(filteredParticipants);
  } catch (error) {
    console.log("Error fetching participants:", error);
  }
};

const FetchPriviliged = async (channel: channel, user: user, setPriviliged: React.Dispatch<React.SetStateAction<participants | null>>) => {
  try {
    const participants = await fetchData(
      `/channels/participants/${channel.id}?uid=${user.id}`,
      "GET",
      null
    );
    if (!participants || !participants.data) return null;
    
    const priviligedParticipant = participants.data.find(
        (participant: participants) =>
          (participant.role === "ADMIN" || participant.role === "MOD") &&
          participant.user_id === user.id
      ) || null;
    setPriviliged(priviligedParticipant);
  } catch (error) {
    console.log("Error fetching privileged participants:", error);
  }
};


const ChannelManagement = ({
  channel,
  user,
  update,
}: {
  channel: channel;
  user: user;
  update: (arg0: boolean) => void;
}) => {
  const { state, dispatch } = useGlobalState();
  const [modlar, setModlar] = useState(false);
  const { user: u, socket } = state;
  const router = useRouter();
  const [picture, setPicture] = useState<File>();
  const { register } = useForm();
  const topicInput = useRef<HTMLInputElement | null>(null);
  const channelNameInput = useRef<HTMLInputElement | null>(null);
  const keyInput = useRef<HTMLInputElement | null>(null);
  const [selectedOption, setSelectedOption] = useState(channel?.state);
  const [fetchEnabled, setFetchEnabled] = useState(true);
  const [participants, setParticipants] = useState<participantWithUser[]>([]);
  const [priviliged, setPriviliged] = useState<participants | null>(null);

  const rotateVariants = {
    initial: {
      rotate: 0,
    },
    rotated: {
      rotate: 90,
    },
  };
  
  useEffect(() => {
    if (fetchEnabled) {
      fetchParticipants(channel, user, setParticipants);
      FetchPriviliged(channel, user, setPriviliged);
    }
  }, [fetchEnabled, channel, user]);

  useEffect(() => {
    socket?.on("update", (data: any) => {
      console.log("update channel list", data);
      setFetchEnabled(true);
    });

    return () => {
      socket?.off("update");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const handleOptionChange = (event: any) => {
    setSelectedOption(event.target.value);
  };

  useEffect(() => {
    addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        setModlar(false);
      }
    });
    return () => removeEventListener("keydown", () => {});
  }, []);

  const handleLeave = () => {
    fetchData(
      `/participants/leave?channel=${channel.id}&user=${user.id}`,
      "DELETE",
      null
    )
    .then(() => {
      setFetchEnabled(false);
      socket.emit("leaveRoom", { user: user, roomName: channel.name });
      router.push("/Dashboard/Chat");
    })
    .catch((error) => {
      console.log(error);
    })
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!priviliged || priviliged === undefined) {
      toast.error("you are not priviliged to change the channel info!!!");
      return;
    }
    if (selectedOption === "public" && keyInput.current?.value) {
      toast.error("you need to select the protected option to set a password.");
      return;
    }
    const obj = {
      channel: {
        name: channelNameInput.current?.value! || channel.name,
        key: keyInput.current?.value! || channel.key,
        topic: topicInput.current?.value! || channel.topic,
        state: selectedOption === "" ? channel.state : selectedOption,
      },
      user: { id: priviliged?.user_id! },
    };
    const updateChannel = async () => {
      try {
        if (picture) {
          if (!picture.type.startsWith("image/")) {
            alert("Please select an image picture.");
            return;
          }
        }

        await fetchData(
          `/channels/${channel.id}`,
          "PUT",
          obj
        );
        if (picture) {
          try {
            const formData = new FormData();
            formData.append("image", picture);
            await fetchData(
              `/channels/image?channel=${channel.id}&user=${priviliged?.user_id}`,
              "POST",
              formData
            );

          } catch (error) {
            toast.error("error in uploading image, using the default image.");
          }
        }
        state?.socket?.emit("channelUpdate", {
          roomName: channel.name,
          user: user,
        });
      } catch (error) {
        toast.error("error in updating channel");
      }
    };
    updateChannel();
  };
  return (
    <motion.div
      className="w-full flex sm:h-[80%] h-auto sm:flex-row flex-col jutify-center items-center  sm:overflow-y-scroll no-scrollbar"
      initial={{ opacity: 0, y: -120 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="sm:w-[45%] w-[100%] h-full bg-transparent flex flex-col items-center justify-start pt-[120px] gap-10 sm:border-r-2">
        <form
          action=""
          onSubmit={handleSubmit}
          className="flex flex-col w-[50%] items-center justify-center  gap-4"
        >
          <div className="rounded-full overflow-hidden relative w-[200px] h-[200px]">
            <input
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setPicture(e.target.files[0]);
                }
              }}
              className="absolute opacity-0 z-30 w-full h-full cursor-pointer"
              disabled={priviliged ? false : true}
            />
            <Image
              src={channel.picture || "/a.png"}
              width={200}
              height={200}
              alt="channel picture"
              className="absolute z-10 blur-sm"
            />

            <Image
              src={"/Chat/plusOverPicture.svg"}
              width={75}
              height={75}
              alt="channel picture"
              className="absolute top-[35%] left-[30%] z-20"
            />
          </div>
          <Input
            type="text"
            placeholder="change name"
            {...register("channelNameInput", { required: false })}
            ref={channelNameInput}
            className="rounded-lg "
            disabled={priviliged ? false : true}
          />
          <Input
            type="text"
            placeholder="change password"
            {...register("keyInput", {
              required: selectedOption === "protected" ? true : false,
            })}
            ref={keyInput}
            className="rounded-lg "
            disabled={priviliged ? false : true}
          />
          <fieldset
            className="flex gap-2 items-center flex-wrap"
            disabled={priviliged ? false : true}
          >
            <label htmlFor="private" className="2xl:text-md text-sm">
              private
            </label>
            <input
              type="radio"
              name="access"
              id="private"
              value="private"
              onChange={handleOptionChange}
              checked={selectedOption === "private"}
            />
            <label htmlFor="public" className="2xl:text-md text-sm">
              public
            </label>
            <input
              type="radio"
              name="access"
              id="public"
              value="public"
              onChange={handleOptionChange}
              checked={selectedOption === "public"}
            />
            <label htmlFor="protected" className="2xl:text-md text-sm">
              protected
            </label>
            <input
              type="radio"
              name="access"
              id="protected"
              value="protected"
              onChange={handleOptionChange}
              checked={selectedOption === "protected"}
            />
          </fieldset>
          <Input
            type="text"
            placeholder="change topic"
            {...register("topicInput", { required: false })}
            ref={topicInput}
            className="rounded-lg "
            disabled={priviliged ? false : true}
          />
          <button
            type="submit"
            className="py-2 px-5 bg-red-500 rounded-md mt-4"
            disabled={priviliged ? false : true}
          >
            Submit
          </button>
        </form>
        <button
          onClick={() => handleLeave()}
          className="py-2 px-5 bg-red-500 rounded-md mt-4"
        >
          leave channel
        </button>
      </div>
      <div className="sm:w-[45%] w-full h-full bg-transparent overflow-y-scroll no-scrollbar">
        <div className="flex flex-row mt-5 items-center justify-around">
          <div>
            <p className="text-2xl font-bold">
              {!modlar ? "Members" : "invite list"}
            </p>
          </div>
          <div
            onClick={() => setModlar(!modlar)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setModlar(false);
            }}
          >
            <motion.div
              animate={modlar ? "rotated" : "initial"}
              variants={rotateVariants}
            >
              {!modlar ? (
                <FaPlus className="text-2xl cursor-pointer" />
              ) : (
                <FaXmark className="text-3xl cursor-pointer" />
              )}
            </motion.div>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-4 items-center">
          {!modlar ? (
            participants &&
            //@ts-ignore
            participants.map((participant:any, index:number) => {
              return (
                <MemberList
                  key={index}
                  participant={participant}
                  exec={priviliged!}
                  channel={channel}
                />
              );
            })
          ) : (
            <InviteCard channel={channel} user={user} />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChannelManagement;
