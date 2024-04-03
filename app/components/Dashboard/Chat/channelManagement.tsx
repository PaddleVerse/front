"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/newinput";
import MemberList from "./MemberList";
import { useForm } from "react-hook-form";
import { channel, participants, user } from "@/app/Dashboard/Chat/type";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { useGlobalState } from "../../Sign/GlobalState";
import { useQueryClient } from "@tanstack/react-query";

const ChannelManagement = ({
  channel,
  user,
  update,
}: {
  channel: channel;
  user: user;
  update: (arg0: boolean) => void;
}) => {
  const [participants, setParticipants] = useState<participants[]>([]);
  const [priviliged, setPriviliged] = useState<participants>();
  const router = useRouter();
  const [picture, setPicture] = useState<File>();
  const { register } = useForm();
  const topicInput = useRef<HTMLInputElement | null>(null);
  const channelNameInput = useRef<HTMLInputElement | null>(null);
  const keyInput = useRef<HTMLInputElement | null>(null);
  const [selectedOption, setSelectedOption] = useState("");
  const { state, dispatch } = useGlobalState();
  const clt = useQueryClient()
  const { user: u, socket } = state;

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/channels/participants/${channel.id}?uid=${user.id}`
        );
        setParticipants(res.data);
        setPriviliged(
          res.data.filter(
            (participant: participants) =>
              (participant.role === "ADMIN" || participant.role === "MOD") &&
              participant.user_id === user.id
          )[0]
        );
      } catch (error) {
        toast.error("failed to fetch participants");
      }
    }
    fetchParticipants();
  }, []);

  useEffect(() => {
    socket.on("update", (data: any) => {
      const fetchParticipants = async () => {
        try {
          const res = await axios.get(
            `http://localhost:8080/participants/${channel.id}`
          );
          setParticipants(res.data);
        } catch (error) {
          toast.error("failed to fetch participants");
        }
      }
      fetchParticipants();
    })
    return () => {
      socket.off("update");
    }
  }, [socket]);

  const handleOptionChange = (event: any) => {
    setSelectedOption(event.target.value);
  };

  const handleLeave = () => {
    axios
      .delete(
        `http://localhost:8080/participants/leave?channel=${channel.id}&user=${user.id}`
      )
      .then((res) => {
        // emit to the server that the user left
        clt.invalidateQueries({queryKey: ["chatList"]})
        router.push("/Dashboard/Chat");
      })
      .catch();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
          `http://localhost:8080/channels/${channel.id}`,
          obj
        );
        if (picture) {
          try {
            const formData = new FormData();
            formData.append("image", picture);
            const pic = await axios.post(
              `http://localhost:8080/channels/image?channel=${channel.id}&user=${user.id}`,
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
            disabled={
              priviliged ? false : true && selectedOption === "protected"
            }
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
      <div className="sm:w-[45%] w-full h-full bg-transparent overflow-y-scroll ">
        <div className="mt-10  flex flex-col gap-4 items-center">
          {participants.map((participant, index) => {
            return (
              <MemberList
                key={index}
                participant={participant}
                exec={priviliged!}
                channel={channel}
              />
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default ChannelManagement;

// still need form validation and submit logic depending on the selected option, and the participants management is to be added later
