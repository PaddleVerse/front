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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import JoinChannel from "./JoinChannel";
import InviteCard from "./InviteCard";
import { FaPlus, FaTimes } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { ipAdress } from "@/app/utils";

const fetchParticipants = async (channel: channel, user: user) => {
  const participants = await axios.get(
    `http://${ipAdress}:8080/channels/participants/${channel.id}?uid=${user.id}`
  );
  const ret = await Promise.all(
    participants.data.map(async (participant: participants) => {
      const user = await axios.get(
        `http://${ipAdress}:8080/user/${participant.user_id}`
      );
      return { ...participant, user: user.data };
    })
  );
  return ret;
};

const FetchPriviliged = async (channel: channel, user: user) => {
  const participants = await axios.get(
    `http://${ipAdress}:8080/channels/participants/${channel.id}?uid=${user.id}`
  );
  return (
    participants.data.filter(
      (participant: participants) =>
        (participant.role === "ADMIN" || participant.role === "MOD") &&
        participant.user_id === user.id
    )[0] || null
  );
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
  const clt = useQueryClient();
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
  const rotateVariants = {
    initial: {
      rotate: 0,
    },
    rotated: {
      rotate: 90,
    },
  };
  const { data: participants } = useQuery<participantWithUser[]>({
    queryKey: ["participants"],
    queryFn: async () => fetchParticipants(channel, user),
  });
  const { data: priviliged } = useQuery<participants>({
    queryKey: ["priviliged"],
    queryFn: async () => FetchPriviliged(channel, user),
  });

  useEffect(() => {
    socket?.on("update", (data: any) => {
      clt.invalidateQueries({ queryKey: ["participants"] });
      clt.invalidateQueries({ queryKey: ["priviliged"] });
    });
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
    axios
      .delete(
        `http://${ipAdress}:8080/participants/leave?channel=${channel.id}&user=${user.id}`
      )
      .then((res) => {
        socket.emit("leaveRoom", { user: user, roomName: channel.name });
        router.push("/Dashboard/Chat");
      })
      .catch();
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
        const res = await axios.put(
          `http://${ipAdress}:8080/channels/${channel.id}`,
          obj
        );
        if (picture) {
          try {
            const formData = new FormData();
            formData.append("image", picture);
            const pic = await axios.post(
              `http://${ipAdress}:8080/channels/image?channel=${channel.id}&user=${user.id}`,
              formData,
              {
                headers: { "Content-Type": "multipart/form-data" },
              }
            );
          } catch (error) {
            toast.error("error in uploading image, using the default image.");
          }
          state?.socket?.emit("channelUpdate", {
            roomName: channel.name,
            user: user,
          });
        }
      } catch (error) {
        toast.error("error in updating channel");
      }
    };
    updateChannel();
  };

  return (
    <motion.div
      className="w-full flex sm:h-[80%] h-auto sm:flex-row flex-col jutify-center items-center  sm:overflow-y-scroll "
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
              src={channel.picture}
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
      <div className="sm:w-[45%] w-full h-full bg-transparent overflow-y-scroll">
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
            participants.map((participant, index) => {
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
