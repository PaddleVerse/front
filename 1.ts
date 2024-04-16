diff --git a/app/Dashboard/Chat/[subroute]/[id]/page.tsx b/app/Dashboard/Chat/[subroute]/[id]/page.tsx
index 659d9c5..d519658 100644
--- a/app/Dashboard/Chat/[subroute]/[id]/page.tsx
+++ b/app/Dashboard/Chat/[subroute]/[id]/page.tsx
@@ -1,14 +1,8 @@
 "use client";
 import ReactLoading from "react-loading";
-import React, {
-  FormEvent,
-  useCallback,
-  useEffect,
-  useRef,
-  useState,
-} from "react";
+import React, { FormEvent, useEffect, useRef, useState } from "react";
 import { useForm } from "react-hook-form";
-import { channel, message, participants, user } from "../../type";
+
 import { IoSendOutline } from "react-icons/io5";
 import Image from "next/image";
 import { OnlinePreview } from "@/app/components/Dashboard/Chat/onlinePreview";
@@ -20,60 +14,73 @@ import { CiCirclePlus } from "react-icons/ci";
 import axios, { AxiosError } from "axios";
 import toast from "react-hot-toast";
 import { useSwipeable } from "react-swipeable";
-import { useParams, useRouter, useSearchParams } from "next/navigation";
-import { useQueryClient, useQuery } from "@tanstack/react-query";
+import { useParams, useRouter } from "next/navigation";
+import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
 
-const fetchTargetUser = async (parameters: any) => {
-  if (parameters.subroute === "dm") {
-    console.log("getting user: " + parameters.id)
-    const user = await axios.get(
-      `http://localhost:8080/user/${parameters?.id!}`
-    );
-    return user.data;
+const FetchUser = async (router: any) => {
+  if (router.subroute === "dm") {
+    const res = await axios.get(`http://localhost:8080/user/${router.id}`);
+    return res.data;
   }
   return null;
 };
-const fetchTargetChannel = async (parameters: any) => {
-  if (parameters.subroute === "channel") {
-    console.log("getting channel: " + parameters.id)
-    const channel = await axios.get(
-      `http://localhost:8080/channels/${parameters!.id!}`
-    );
-    return channel.data;
+
+const FetchChannel = async (router: any) => {
+  if (router.subroute === "channel") {
+    const res = await axios.get(`http://localhost:8080/channels/${router.id}`);
+    return res.data;
   }
   return null;
 };
 
 const Page = (props: any) => {
-  const parameters = useParams();
-  const searchParam = useSearchParams();
+  const clt = useQueryClient();
   const router = useRouter();
+  const param = useParams();
   const { register } = useForm();
   const [channelManagement, setChannelManagement] = useState(false);
   const { state, dispatch } = useGlobalState();
+  const { user, socket } = state;
   const [update, setUpdate] = useState(false);
   const [showMessage, setShowMessage] = useState(false);
   const inputMessage = useRef<HTMLInputElement | null>(null);
 
-  const { data: targetChannel } = useQuery<channel | null>({
-    queryKey: ["targetChannel"],
-    queryFn: () => fetchTargetChannel(parameters),
-  });
-  const { data: targetUser } = useQuery<user | null>({
+  const {
+    data: targetUser,
+    error: userError,
+    isLoading: userLoading,
+  } = useQuery({
     queryKey: ["targetUser"],
-    queryFn: () => fetchTargetUser(parameters),
+    queryFn: () => FetchUser(param),
+  });
+  const {
+    data: targetChannel,
+    error: channelError,
+    isLoading: channelLoading,
+  } = useQuery({
+    queryKey: ["targetChannel"],
+    queryFn: () => FetchChannel(param),
   });
 
   useEffect(() => {
-    state?.socket?.on("ok", (data: any) => {
+    socket?.on("update", (data: any) => {
+      clt.invalidateQueries({ queryKey: ["targetUser", "targetChannel"] });
+    })
+    return () => {
+      socket?.off("update");
+    };
+  },[socket])
+
+  useEffect(() => {
+    socket?.on("ok", (data: any) => {
       if (data === null) return;
-      setUpdate(true);
+      clt.invalidateQueries({ queryKey: ["targetUser", "targetChannel"] });
     });
-    state?.socket?.emit("refresh");
+    socket?.emit("refresh");
     return () => {
-      state?.socket?.off("ok");
+      socket?.off("ok");
     };
-  }, [state?.socket]);
+  }, [socket]);
 
   const handlers = useSwipeable({
     onSwipedLeft: () => setShowMessage(true),
@@ -99,7 +106,7 @@ const Page = (props: any) => {
           user1: state.user.id,
         };
         const res = await axios.post(`http://localhost:8080/message`, message);
-        state?.socket?.emit("channelmessage", {
+        socket?.emit("channelmessage", {
           roomName: targetChannel.name,
           user: state?.user,
         });
@@ -118,7 +125,7 @@ const Page = (props: any) => {
           user2: state.user.id,
           user1: targetUser.id,
         });
-        state?.socket?.emit("dmmessage", {
+        socket?.emit("dmmessage", {
           reciever: targetUser?.id!,
           sender: state?.user?.id!,
         });
@@ -130,10 +137,6 @@ const Page = (props: any) => {
     return (e: FormEvent<HTMLFormElement>) => {};
   };
 
-  if (state?.user === null) {
-    return;
-  }
-
   return (
     <>
       {targetChannel || targetUser ? (
@@ -178,19 +181,19 @@ const Page = (props: any) => {
                 handlers={handlers}
                 us={true}
                 channel={false}
-                globalStateUserId={state!.user!.id!}
+                globalStateUserId={user?.id!}
               />
             ) : !channelManagement ? (
               <ChatComponent
                 handlers={handlers}
                 us={false}
                 channel={true}
-                globalStateUserId={state!.user!.id!}
+                globalStateUserId={user?.id!}
               />
             ) : (
               <ChannelManagement
                 channel={targetChannel!}
-                user={state!.user!}
+                user={user!}
                 update={setUpdate}
               />
             )}
diff --git a/app/Dashboard/Chat/npn.tsx b/app/Dashboard/Chat/npn.tsx
index 4942b7a..15f11c8 100644
--- a/app/Dashboard/Chat/npn.tsx
+++ b/app/Dashboard/Chat/npn.tsx
@@ -11,13 +11,12 @@ import Image from "next/image";
 import CreateChannel from "@/app/components/Dashboard/Chat/createChannel";
 import toast from "react-hot-toast";
 import {
-  QueryClient,
-  QueryClientProvider,
   useQuery,
   useQueryClient,
 } from "@tanstack/react-query";
 const inter = Inter({ subsets: ["latin"] });
 
+
 const fetchChatList = async (userId: string) => {
   const res = await axios.get(`http://localhost:8080/chat/chatlist/${userId}`);
   const dataWithMessages = await Promise.all(
@@ -35,7 +34,6 @@ const fetchChatList = async (userId: string) => {
       }
     })
   );
-  // console.log("the data with messages is: ", dataWithMessages);
   return dataWithMessages;
 };
 
@@ -77,26 +75,24 @@ const Page = ({ children }: { children: React.ReactNode }) => {
 
   useEffect(() => {
     socket?.on("update", (data: any) => {
-      console.log("hello from update use Effect")
-      clt.invalidateQueries({
-        queryKey: ['chatList']
-      });
-      clt.invalidateQueries({
-        queryKey: ['messages']
-      });
-    })
+      console.log("hello from chatList update");
+      clt.invalidateQueries({queryKey: ["chatList"]});
+    });
+    return () => {
+      socket?.off("update");
+    };
+  }, [socket]);
+
+  useEffect(() => {
     socket?.on("ok", (data: any) => {
       if (data === null) return;
-      clt.invalidateQueries({
-        queryKey: ['chatList']
-      });
+      clt.invalidateQueries({ queryKey: ["chatList"] });
     });
     socket?.emit("refresh");
     return () => {
       socket?.off("ok");
-      socket?.off("update")
-    }
-  }, [socket, clt]);
+    };
+  }, [socket]);
 
   const handleClick = () => {
     setModlar(false);
@@ -121,114 +117,112 @@ const Page = ({ children }: { children: React.ReactNode }) => {
   const tablet = useWindowSize() < 769;
 
   return (
-    // <QueryClientProvider client={queryClient}>
-      <div className="w-[91%] mx-auto lg:h-full md:h-[92%] relative h-[80%] flex justify-center mt-5 overflow-hidden">
-        <AnimatePresence>
-          {modlar ? (
-            <JoinChannel handleClick={handleClick} user={state.user} />
-          ) : createModlar ? (
-            <CreateChannel handleClick={() => setCreateModlar(false)} />
-          ) : null}
-        </AnimatePresence>
-        <div className="lg:max-h-[95%] lg:w-[91%] w-full h-full ">
-          <div
-            className={`h-full w-full flex antialiased text-gray-200 bg-transparent rounded-xl ${inter.className}`}
-            style={{
-              backdropFilter: "blur(20px)",
-              backgroundColor: "rgba(13, 9, 10, 0.7)",
-            }}
-          >
-            <div className="flex-1 flex flex-col ">
-              <main className="flex-grow flex flex-row min-h-0">
-                <motion.section
-                  className={` flex flex-col flex-none overflow-auto ${
-                    showMessage && tablet ? "invisible" : "visible"
-                  } group lg:max-w-[300px] md:w-2/5 no-scrollbar`}
-                  initial={{ display: "flex", width: "100%", opacity: 1 }}
-                  animate={{
-                    display: showMessage && tablet ? "hidden" : "flex",
-                    width: showMessage && tablet ? "0" : "100%",
-                    opacity: showMessage && tablet ? 0 : 1,
-                    transition: { duration: 0.25 },
-                  }}
-                >
-                  <div className=" p-4 flex-none mt-4">
-                    <p
-                      className={`text-2xl font-bold md:block group-hover:block mb-4`}
-                    >
-                      Messages
-                    </p>
-                    <form onSubmit={(e) => e.preventDefault()}>
-                      <div className="relative sm:block hidden">
-                        <label>
-                          <input
-                            className="rounded-lg py-2 pr-6 pl-10 w-full bg-white focus:outline-none text-black focus:shadow-md transition duration-300 ease-in"
-                            type="text"
-                            placeholder="Search Messenger"
-                          />
-                          <span className="absolute top-[4px] left-0 mt-2 ml-3 inline-block">
-                            <svg viewBox="0 0 24 24" className="w-4 h-4">
-                              <path
-                                fill="#bbb"
-                                d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"
-                              />
-                            </svg>
-                          </span>
-                        </label>
-                      </div>
-                    </form>
-                  </div>
-                  <div className="flex flex-row justify-around w-full">
-                    <p className="ml-8">
-                      Join a{" "}
-                      <span
-                        onClick={() => setModlar(true)}
-                        className="text-sky-500 cursor-pointer"
-                      >
-                        Public
-                      </span>{" "}
-                      Group Chat
-                    </p>
-                    <div>
-                      <span className="" onClick={() => setCreateModlar(true)}>
-                        <Image
-                          width={24}
-                          height={24}
-                          src="/Chat/vector.svg"
-                          alt="create svg"
+    <div className="w-[91%] mx-auto lg:h-full md:h-[92%] relative h-[80%] flex justify-center mt-5 overflow-hidden">
+      <AnimatePresence>
+        {modlar ? (
+          <JoinChannel handleClick={handleClick} user={state.user} />
+        ) : createModlar ? (
+          <CreateChannel handleClick={() => setCreateModlar(false)} />
+        ) : null}
+      </AnimatePresence>
+      <div className="lg:max-h-[95%] lg:w-[91%] w-full h-full ">
+        <div
+          className={`h-full w-full flex antialiased text-gray-200 bg-primaryColor rounded-xl ${inter.className}`}
+          style={{
+            backdropFilter: "blur(20px)",
+            backgroundColor: "rgba(13, 9, 10, 0.4)",
+          }}
+        >
+          <div className="flex-1 flex flex-col ">
+            <main className="flex-grow flex flex-row min-h-0">
+              <motion.section
+                className={` flex flex-col flex-none overflow-auto ${
+                  showMessage && tablet ? "invisible" : "visible"
+                } group lg:max-w-[300px] md:w-2/5 no-scrollbar`}
+                initial={{ display: "flex", width: "100%", opacity: 1 }}
+                animate={{
+                  display: showMessage && tablet ? "hidden" : "flex",
+                  width: showMessage && tablet ? "0" : "100%",
+                  opacity: showMessage && tablet ? 0 : 1,
+                  transition: { duration: 0.25 },
+                }}
+              >
+                <div className=" p-4 flex-none mt-4">
+                  <p
+                    className={`text-2xl font-bold md:block group-hover:block mb-4`}
+                  >
+                    Messages
+                  </p>
+                  <form onSubmit={(e) => e.preventDefault()}>
+                    <div className="relative sm:block hidden">
+                      <label>
+                        <input
+                          className="rounded-lg py-2 pr-6 pl-10 w-full bg-white focus:outline-none text-black focus:shadow-md transition duration-300 ease-in"
+                          type="text"
+                          placeholder="Search Messenger"
                         />
-                      </span>
+                        <span className="absolute top-[4px] left-0 mt-2 ml-3 inline-block">
+                          <svg viewBox="0 0 24 24" className="w-4 h-4">
+                            <path
+                              fill="#bbb"
+                              d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"
+                            />
+                          </svg>
+                        </span>
+                      </label>
                     </div>
+                  </form>
+                </div>
+                <div className="flex flex-row justify-around w-full">
+                  <p className="ml-8">
+                    Join a{" "}
+                    <span
+                      onClick={() => setModlar(true)}
+                      className="text-sky-500 cursor-pointer"
+                    >
+                      Public
+                    </span>{" "}
+                    Group Chat
+                  </p>
+                  <div>
+                    <span className="" onClick={() => setCreateModlar(true)}>
+                      <Image
+                        width={24}
+                        height={24}
+                        src="/Chat/vector.svg"
+                        alt="create svg"
+                      />
+                    </span>
                   </div>
-                  <div
-                    className="contacts p-2 flex-1 overflow-y-scroll"
-                    onClick={(e) => {
-                      e.preventDefault();
-                    }}
-                  >
-                    {Array.isArray(chatList) &&
-                      chatList.map((value: any, key: any) => {
-                        return (
-                          <ChatCard
-                            key={key}
-                            swipe={setShowMessage}
-                            index={key}
-                            value={value}
-                            self={state.user}
-                            handleClick={handleSwitching}
-                            msg={value.msg}
-                          ></ChatCard>
-                        );
-                      })}
-                  </div>
-                </motion.section>
-                {children}
-              </main>
-            </div>
+                </div>
+                <div
+                  className="contacts p-2 flex-1 overflow-y-scroll"
+                  onClick={(e) => {
+                    e.preventDefault();
+                  }}
+                >
+                  {Array.isArray(chatList) &&
+                    chatList.map((value: any, key: any) => {
+                      return (
+                        <ChatCard
+                          key={key}
+                          swipe={setShowMessage}
+                          index={key}
+                          value={value}
+                          self={state.user}
+                          handleClick={handleSwitching}
+                          msg={value.msg}
+                        ></ChatCard>
+                      );
+                    })}
+                </div>
+              </motion.section>
+              {children}
+            </main>
           </div>
         </div>
       </div>
-    // </QueryClientProvider>
+    </div>
   );
 };
 
diff --git a/app/components/Dashboard/Chat/ChatCard.tsx b/app/components/Dashboard/Chat/ChatCard.tsx
index 6d9fe07..346fe06 100644
--- a/app/components/Dashboard/Chat/ChatCard.tsx
+++ b/app/components/Dashboard/Chat/ChatCard.tsx
@@ -18,7 +18,7 @@ export const ChatCard = (props: any) => {
         } else {
           router.push(`/Dashboard/Chat/dm/${props.value.id}`);
         }
-        clt.invalidateQueries({queryKey: ["targetChannel", "targetUser"]})
+        clt.invalidateQueries({queryKey: ["targetUser", "targetChannel"]})
         props.handleClick();
       }}
       initial={{ opacity: 0, y: -20 }}
diff --git a/app/components/Dashboard/Chat/ChatComponent.tsx b/app/components/Dashboard/Chat/ChatComponent.tsx
index c634fa9..f10e35f 100644
--- a/app/components/Dashboard/Chat/ChatComponent.tsx
+++ b/app/components/Dashboard/Chat/ChatComponent.tsx
@@ -6,26 +6,19 @@ import { useGlobalState } from "../../Sign/GlobalState";
 import { useParams } from "next/navigation";
 import toast from "react-hot-toast";
 import axios from "axios";
-import { useQuery } from "@tanstack/react-query";
+import { useQuery, useQueryClient } from "@tanstack/react-query";
 
-const FetchMessages = async (p: any, userId: string) => {
-  if (p.subroute == "channel") {
+const FetchMessages = async (type: boolean, p: any, userId: string) => {
+  if (!type) {
     const mes = await axios.get(
-      `http://localhost:8080/channels/messages/${p?.id!}?uid=${userId}`
-    );
-    console.log("the unsorted data: ",mes.data);
-
-    const sortedMessages = mes.data.sort((a: message,b: message)=> {a?.id! - b?.id!})
-
-    console.log("the sorted data: ",sortedMessages);
-
-    return mes.data;
-  } else {
-    const mes = await axios.get(
-      `http://localhost:8080/conversations/messages?uid1=${p?.id!}&uid2=${userId}`
+      `http://localhost:8080/channels/messages/${p?.id!}?uid=${userId!}`
     );
     return mes.data;
   }
+  const mes = await axios.get(
+    `http://localhost:8080/conversations/messages?uid1=${p?.id!}&uid2=${userId!}`
+  );
+  return mes.data;
 };
 
 const ChatComponent = ({
@@ -40,13 +33,27 @@ const ChatComponent = ({
   globalStateUserId: number;
 }) => {
   const p = useParams();
+  const clt = useQueryClient();
   const { state, dispatch } = useGlobalState();
   const { socket, user } = state;
-  const containerRef = useRef(null);
-  const { data: messages } = useQuery<message[]>({
+  const {
+    data: messages,
+    error: messagesError,
+    isLoading: messagesLoading,
+  } = useQuery<message[]>({
+    queryFn: () => FetchMessages(us, p, user?.id!),
     queryKey: ["messages"],
-    queryFn: () => FetchMessages(p, user?.id),
   });
+  const containerRef = useRef(null);
+
+  useEffect(() => {
+    socket?.on("update", (data: any) => {
+      clt.invalidateQueries({ queryKey: ["messages"] });
+    });
+    return () => {
+      socket?.off("update");
+    };
+  }, [socket]);
 
   useEffect(() => {
     const container: any = containerRef.current;
@@ -55,7 +62,7 @@ const ChatComponent = ({
     }
   }, [messages]);
 
-  if (messages && messages.length === 0) {
+  if (messages?.length === 0) {
     return (
       <div
         className="w-full h-full overflow-y-scroll no-scrollbar"
diff --git a/app/components/Dashboard/Chat/JoinChannel.tsx b/app/components/Dashboard/Chat/JoinChannel.tsx
index 365e9ac..ede6401 100644
--- a/app/components/Dashboard/Chat/JoinChannel.tsx
+++ b/app/components/Dashboard/Chat/JoinChannel.tsx
@@ -65,14 +65,14 @@ const JoinChannel = ({
       className={`fixed inset-0 sm:flex hidden ${inter.className} items-center justify-center bg-black bg-opacity-50 z-50 text-white`}
     >
       <motion.div
-        className="overflow-y-auto border border-red-500/[0.3] h-[70%] 2xl:w-[35%] xl:w-[55%] sm:w-[70%] px-10 py-16 flex flex-col bg-transparent rounded-xl"
+        className="overflow-y-auto border border-red-500/[0.3] h-[70%] 2xl:w-[35%] xl:w-[55%] sm:w-[70%] px-10 py-16 flex flex-col bg-primaryColor rounded-xl"
         initial="closed"
         animate="open"
         exit="closed"
         variants={modalVariants}
         style={{
           backdropFilter: "blur(20px)",
-          backgroundColor: "rgba(13, 9, 10, 0.4)",
+          // backgroundColor: "rgba(13, 9, 10, 0.4)",
         }}
       >
         <h1 className="text-3xl">Expand your horizon</h1>
diff --git a/app/components/Dashboard/Chat/JoinChannelBubble.tsx b/app/components/Dashboard/Chat/JoinChannelBubble.tsx
index 485f954..e309c8d 100644
--- a/app/components/Dashboard/Chat/JoinChannelBubble.tsx
+++ b/app/components/Dashboard/Chat/JoinChannelBubble.tsx
@@ -63,7 +63,7 @@ const JoinChannelBubble = ({
   };
   return (
     <div
-      className="flex ga-2 items-center col-start text-inherit relative"
+      className="flex gap-2 items-center col-start text-inherit relative py-3"
       onClick={(e) => {
         e.preventDefault();
         if (lock) {
@@ -74,9 +74,9 @@ const JoinChannelBubble = ({
       }}
     >
       <img
-        src="/badge1.png"
+        src={channel.picture}
         alt="image"
-        className="lg:w-[95px] lg:h-[95px] md:w-[80px] md:h-[80px] rounded-full"
+        className="lg:w-[47px] lg:h-[47px] md:w-[31px] md:h-[31px] rounded-full"
       />
       <div className="flex flex-col gap-1">
         <h2 className="2xl:text-md xl:text-[15px] md:text-[14px]">
@@ -92,7 +92,7 @@ const JoinChannelBubble = ({
             />
           </form>
         ) : (
-          <p className="text-gray-400 xl:text-sm truncate md:tex  t-xs lg:max-w-full md:max-w-[120px]">
+          <p className="text-gray-400 xl:text-sm truncate md:tex  text-xs lg:max-w-full md:max-w-[120px] ">
             {channel.topic?.substring(0, 30) +
               (channel.topic?.length > 30 ? " ..." : "")}
           </p>
diff --git a/app/components/Dashboard/Chat/channelManagement.tsx b/app/components/Dashboard/Chat/channelManagement.tsx
index 2d845fc..a5d15d9 100644
--- a/app/components/Dashboard/Chat/channelManagement.tsx
+++ b/app/components/Dashboard/Chat/channelManagement.tsx
@@ -10,8 +10,7 @@ import { useRouter } from "next/navigation";
 import axios from "axios";
 import toast from "react-hot-toast";
 import { useGlobalState } from "../../Sign/GlobalState";
-
-// this still needs work in terms of realtime and stuff, but the basic functionality is there
+import { useQueryClient } from "@tanstack/react-query";
 
 const ChannelManagement = ({
   channel,
@@ -32,6 +31,7 @@ const ChannelManagement = ({
   const keyInput = useRef<HTMLInputElement | null>(null);
   const [selectedOption, setSelectedOption] = useState("");
   const { state, dispatch } = useGlobalState();
+  const clt = useQueryClient()
   const { user: u, socket } = state;
 
   useEffect(() => {
@@ -85,6 +85,7 @@ const ChannelManagement = ({
       )
       .then((res) => {
         // emit to the server that the user left
+        clt.invalidateQueries({queryKey: ["chatList"]})
         router.push("/Dashboard/Chat");
       })
       .catch();
diff --git a/app/components/Dashboard/Leaderboard/LeaderBoard.tsx b/app/components/Dashboard/Leaderboard/LeaderBoard.tsx
index 5466c9f..cd32359 100644
--- a/app/components/Dashboard/Leaderboard/LeaderBoard.tsx
+++ b/app/components/Dashboard/Leaderboard/LeaderBoard.tsx
@@ -1,18 +1,18 @@
 import React from "react";
 import PlacingElement from "./PlacingElement";
 import LeaderTable from "./LeaderTable";
-import { Rajdhani } from "next/font/google";
-const rajdhani = Rajdhani({
-  subsets: ["latin"],
-  weight: ["400", "500", "600", "700"],
-});
+import { rajdhani } from "@/app/utils/fontConfig";
+import { cn } from "@/components/cn";
 const LeaderBoard = () => {
   return (
     <div className="  sm:w-[61%] p-[2px]  w-[95%] h-[88%]  mt-[50px] from-[#dc5051] from-10% via-[#C2584F] via-15% to-transparent to-90% flex flex-col  bg-gradient-to-b rounded-xl">
-      <div className=" rounded-xl h-full w-full bg-[#0E141D]">
+      <div className=" rounded-xl h-full w-full bg-primaryColor]">
         <div className="w-[95%] mx-auto flex mt-10 flex-col gap-10 ">
           <h1
-            className={`${rajdhani.className} text-white sm:text-[40px] text-[31px] font-semibold`}
+            className={cn(
+              "text-white sm:text-[40px] text-[31px] font-semibold",
+              rajdhani.className
+            )}
           >
             Pong Leaderboard
           </h1>
diff --git a/app/components/Dashboard/Leaderboard/LeaderRow.tsx b/app/components/Dashboard/Leaderboard/LeaderRow.tsx
index cf06ce0..64e5088 100644
--- a/app/components/Dashboard/Leaderboard/LeaderRow.tsx
+++ b/app/components/Dashboard/Leaderboard/LeaderRow.tsx
@@ -1,11 +1,10 @@
 "use client";
-import React from "react";
 
-import {motion} from 'framer-motion'
-import FormElement from "./FormElement";
-import { useGlobalState } from "../../Sign/GlobalState";
-import { useRouter } from "next/navigation";
+import { motion } from "framer-motion";
 import Image from "next/image";
+import { useRouter } from "next/navigation";
+import { useGlobalState } from "../../Sign/GlobalState";
+import { cn } from "@/components/cn";
 interface Props {
   user: any;
   index: number;
@@ -16,18 +15,18 @@ const LeaderRow = ({ user, index }: Props) => {
   const { state } = useGlobalState();
   const User: any = state.user;
 
-
   const handleClick = () => {
     router.push(`/Dashboard/Profile?id=${user.id}`);
   };
   return (
     <motion.tr
-      className={`${
-        user.id % 2 === 0 ? "bg-[#101823]" : "bg-[#161F2F]"
-      } text-white sm:text-[12px] text-[10px] cursor-pointer`}
+      className={cn(
+        "text-white sm:text-[12px] text-[10px] cursor-pointer",
+        user.id % 2 === 0 ? "bg-primaryColor" : "bg-[#161F2F]"
+      )}
       onClick={handleClick}
-      initial={{ opacity: 0, y:-20 }}
-      animate={{ opacity: 1, y:0 }}
+      initial={{ opacity: 0, y: -20 }}
+      animate={{ opacity: 1, y: 0 }}
       transition={{ delay: 0.25 * index }}
     >
       <td scope="row" className=" sm:py-[7px] font-medium text-[14px]">
@@ -51,17 +50,17 @@ const LeaderRow = ({ user, index }: Props) => {
           </div>
         ) : user.id === 3 ? (
           <div className="flex items-center justify-center">
-          <Image
-            width={28}
-            height={28}
-            src='/3_leaderboard.svg'
-            alt="image"
-            
+            <Image
+              width={28}
+              height={28}
+              src="/3_leaderboard.svg"
+              alt="image"
             />
-        </div>
+          </div>
         ) : (
-          <span className="flex items-center justify-center text-[17px] font-semibold">{user.id}</span>
-          
+          <span className="flex items-center justify-center text-[17px] font-semibold">
+            {user.id}
+          </span>
         )}
       </td>
       <td className="sm:py-[7px] text-[13px] flex items-center gap-2 font-[500] text-center">
@@ -80,13 +79,6 @@ const LeaderRow = ({ user, index }: Props) => {
       <td className=" sm:py-[7px] pl-2 text-[#15E5B4] text-[14px]">3</td>
       <td className=" sm:py-[7px] pl-2 text-[14px]">5</td>
       <td className="  sm:py-[7px] pl-4 text-[14px]">2.2</td>
-      {/* <td className=" pr-[10px]">
-        <div className="flex justify-between">
-          {Array.from({ length: 10 }, (_, index) => (
-            <FormElement key={index} />
-          ))}
-        </div>
-      </td> */}
     </motion.tr>
   );
 };
diff --git a/app/components/Dashboard/Navbar/Navbar.tsx b/app/components/Dashboard/Navbar/Navbar.tsx
index b4cb087..8322c19 100644
--- a/app/components/Dashboard/Navbar/Navbar.tsx
+++ b/app/components/Dashboard/Navbar/Navbar.tsx
@@ -1,21 +1,18 @@
 "use client";
-import React, { useEffect, useState } from "react";
-import { usePathname } from "next/navigation";
-import { useRouter } from "next/navigation";
 import axios from "axios";
+import { usePathname, useRouter } from "next/navigation";
+import { useEffect, useState } from "react";
 import { IoNotifications } from "react-icons/io5";
 import { useGlobalState } from "../../Sign/GlobalState";
-import NotificationCard from './NotificationCard';
-import { set } from "react-hook-form";
-
+import NotificationCard from "./NotificationCard";
 
 const Navbar = () => {
   const pathname = usePathname();
   const router = useRouter();
   const [open, setOpen] = useState(false);
   const [notifed, setNotifed] = useState(false);
-  const {state, dispatch} = useGlobalState();
-  const {user, socket} = state;
+  const { state, dispatch } = useGlobalState();
+  const { user, socket } = state;
 
   const handleClick = () => {
     // user?.notifications.splice(0, user?.notifications.length);
@@ -25,7 +22,7 @@ const Navbar = () => {
     //   console.log(err);
     // });
 
-    setOpen(!open) 
+    setOpen(!open);
     setNotifed(false);
   };
 
@@ -33,36 +30,39 @@ const Navbar = () => {
     const cookies = document.cookie.split(";");
 
     for (let i = 0; i < cookies.length; i++) {
-        const cookie = cookies[i];
-        const eqPos = cookie.indexOf("=");
-        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
-        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
+      const cookie = cookies[i];
+      const eqPos = cookie.indexOf("=");
+      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
+      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
     }
-  }
+  };
 
   useEffect(() => {
     if (!user || !socket) return;
-    socket?.on('notification', () => {
+    socket?.on("notification", () => {
       setNotifed(true);
     });
   }, [socket]);
 
   useEffect(() => {
     if (!socket || !user) return;
-    socket?.on('notification', (data: any) =>{
+    socket?.on("notification", (data: any) => {
       if (data?.ok === 0) return;
-      axios.get(`http://localhost:8080/user/${user?.id}`).then((res) => {
-        (dispatch && dispatch({type: "UPDATE_USER", payload: res.data}));
-      }).catch(() => {});
+      axios
+        .get(`http://localhost:8080/user/${user?.id}`)
+        .then((res) => {
+          dispatch && dispatch({ type: "UPDATE_USER", payload: res.data });
+        })
+        .catch(() => {});
     });
-  } , [socket]);
+  }, [socket]);
 
   const getCookie = (name: string) => {
     const value = `; ${document.cookie}`;
     const parts = value.split(`; ${name}=`);
-    
+
     if (parts.length === 2) {
-      const cookieValue = parts.pop()?.split(';').shift();
+      const cookieValue = parts.pop()?.split(";").shift();
       return cookieValue;
     } else {
       return undefined;
@@ -72,63 +72,79 @@ const Navbar = () => {
   const accessToken = getCookie("access_token");
 
   const handleLogout = async () => {
-    axios.post(
-      'http://localhost:8080/auth/logout',
-      {},
-      {
-        headers: {
-          Authorization: `Bearer ${accessToken}`,
-        },
-      }
-    ).then((res) => {
-      cleanCookie();
-      router.push('/');
-    }
-    ).catch((err) => {
-      console.log(err);
-    });
-  }
+    axios
+      .post(
+        "http://localhost:8080/auth/logout",
+        {},
+        {
+          headers: {
+            Authorization: `Bearer ${accessToken}`,
+          },
+        }
+      )
+      .then((res) => {
+        cleanCookie();
+        router.push("/");
+      })
+      .catch((err) => {
+        console.log(err);
+      });
+  };
 
   return (
     <div className="w-full flex justify-center z-50">
-      <div
-        className="w-[95%] h-14 bg-[#101823] rounded-b-sm md:flex hidden justify-between items-center"
-        // style={{
-        //   backdropFilter: "blur(20px)",
-        //   backgroundColor: "rgba(13, 9, 10, 0.7)",
-        // }}
-      >
+      <div className="w-[95%] h-14 bg-primaryColor rounded-b-sm md:flex hidden justify-between items-center">
         <span className="text-gray-400 ml-10 text-[14px]">{pathname}</span>
         <div className="flex justify-center items-center relative">
-          <div >
+          <div>
             <button
               onClick={handleClick}
-              className=" relative h-8 w-8 flex justify-center items-center text-gray-300 select-none rounded-2xl text-center align-middle font-sans text-xs font-medium uppercase transition-all hover:bg-gray-100/10 active:bg-gray-100/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
-                <IoNotifications className="h-6 w-6" />
-                { notifed && (
-                  <div className="absolute bg-gray-900 p-1 rounded-full top-0 right-0">
-                    <div className="bg-red-500 rounded-full w-[6px] h-[6px]"></div>
-                  </div>
-                )}
+              className=" relative h-8 w-8 flex justify-center items-center text-gray-300 select-none rounded-2xl text-center align-middle font-sans text-xs font-medium uppercase transition-all hover:bg-gray-100/10 active:bg-gray-100/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
+            >
+              <IoNotifications className="h-6 w-6" />
+              {notifed && (
+                <div className="absolute bg-gray-900 p-1 rounded-full top-0 right-0">
+                  <div className="bg-red-500 rounded-full w-[6px] h-[6px]"></div>
+                </div>
+              )}
             </button>
-              {open && (
-                <ul className="absolute w-[200%] #9c9c9c66 bg-gray-200 left-[-100%] rounded-xl mt-2" onBlur={() => setOpen(false)}>
-                  {user && user?.notifications.length !== 0 ? user?.notifications.map((not:any, index:any) => (
+            {open && (
+              <ul
+                className="absolute w-[200%] #9c9c9c66 bg-gray-200 left-[-100%] rounded-xl mt-2"
+                onBlur={() => setOpen(false)}
+              >
+                {user && user?.notifications.length !== 0 ? (
+                  user?.notifications.map((not: any, index: any) => (
                     <li key={index}>
-                      <NotificationCard not={not} setOpen={setOpen}/>
+                      <NotificationCard not={not} setOpen={setOpen} />
                     </li>
                   ))
-                  : ( <li className="py-4 text-center text-gray-500"> There are no notifications </li> )
-                  }
-                </ul>
-              )}
+                ) : (
+                  <li className="py-4 text-center text-gray-500">
+                    {" "}
+                    There are no notifications{" "}
+                  </li>
+                )}
+              </ul>
+            )}
           </div>
           <button
-          onClick={handleLogout}
-          className="text-gray-400 ml-10 text-[14px] flex gap-1 justify-center items-center mr-10">
+            onClick={handleLogout}
+            className="text-gray-400 ml-10 text-[14px] flex gap-1 justify-center items-center mr-10"
+          >
             <span>Logout</span>
-            <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
-              <path d="M2 18.5C1.45 18.5 0.979333 18.3043 0.588 17.913C0.196667 17.5217 0.000666667 17.0507 0 16.5V2.5C0 1.95 0.196 1.47933 0.588 1.088C0.98 0.696667 1.45067 0.500667 2 0.5H9V2.5H2V16.5H9V18.5H2ZM13 14.5L11.625 13.05L14.175 10.5H6V8.5H14.175L11.625 5.95L13 4.5L18 9.5L13 14.5Z" fill="white" fillOpacity="0.5"/>
+            <svg
+              width="18"
+              height="19"
+              viewBox="0 0 18 19"
+              fill="none"
+              xmlns="http://www.w3.org/2000/svg"
+            >
+              <path
+                d="M2 18.5C1.45 18.5 0.979333 18.3043 0.588 17.913C0.196667 17.5217 0.000666667 17.0507 0 16.5V2.5C0 1.95 0.196 1.47933 0.588 1.088C0.98 0.696667 1.45067 0.500667 2 0.5H9V2.5H2V16.5H9V18.5H2ZM13 14.5L11.625 13.05L14.175 10.5H6V8.5H14.175L11.625 5.95L13 4.5L18 9.5L13 14.5Z"
+                fill="white"
+                fillOpacity="0.5"
+              />
             </svg>
           </button>
         </div>
@@ -137,4 +153,4 @@ const Navbar = () => {
   );
 };
 
-export default Navbar;
\ No newline at end of file
+export default Navbar;
diff --git a/app/components/Dashboard/Navbar/NotificationCard.tsx b/app/components/Dashboard/Navbar/NotificationCard.tsx
index d08bc95..3936162 100644
--- a/app/components/Dashboard/Navbar/NotificationCard.tsx
+++ b/app/components/Dashboard/Navbar/NotificationCard.tsx
@@ -1,6 +1,4 @@
-import React from 'react'
 import { useRouter } from 'next/navigation';
-import { set } from 'react-hook-form';
 
 const NotificationCard = (props : any) => {
   const router = useRouter();
diff --git a/app/components/Dashboard/Overview/Achievements/Achievement.tsx b/app/components/Dashboard/Overview/Achievements/Achievement.tsx
index d43e914..a355649 100644
--- a/app/components/Dashboard/Overview/Achievements/Achievement.tsx
+++ b/app/components/Dashboard/Overview/Achievements/Achievement.tsx
@@ -1,8 +1,8 @@
 import Image from "next/image";
-import { Rajdhani } from "next/font/google";
+import { rajdhani } from "@/app/utils/fontConfig";
 import React from "react";
+import { cn } from "@/components/cn";
 
-const rajdhani = Rajdhani({ subsets: ["latin"], weight: ["400", "500"] });
 const Achievement = () => {
   return (
     <div className=" w-full text-white flex items-center gap-2 p-2">
@@ -11,12 +11,13 @@ const Achievement = () => {
         width={40}
         height={40}
         alt="badge"
-
         className="w-auto h-auto"
       ></Image>
       <div className="flex flex-col w-full">
-        <h1 className={`text-[14px] font-[500] ${rajdhani.className}`}>FIRST WIN</h1>
-        <p className="text-[8px] text-buttonGray">a good way to start</p>
+        <h1 className={cn("text-[14px] font-[500]", rajdhani.className)}>
+          FIRST WIN
+        </h1>
+        <p className="text-[10px] text-buttonGray">a good way to start</p>
       </div>
     </div>
   );
diff --git a/app/components/Dashboard/Overview/Achievements/Achievements.tsx b/app/components/Dashboard/Overview/Achievements/Achievements.tsx
index 918f54d..21151e0 100644
--- a/app/components/Dashboard/Overview/Achievements/Achievements.tsx
+++ b/app/components/Dashboard/Overview/Achievements/Achievements.tsx
@@ -1,28 +1,34 @@
-import React from 'react'
-import { Rajdhani } from 'next/font/google'
-import Image from 'next/image'
-import Achievement from './Achievement'
+import React from "react";
+import { rajdhani } from "@/app/utils/fontConfig";
+import Image from "next/image";
+import Achievement from "./Achievement";
+import { cn } from "@/components/cn";
 
-const rajdhani = Rajdhani({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })
 const Achievements = () => {
   return (
-    <div className=' w-full  rounded-md p-3 h-auto bg-[#101823]'
-    // style={{
-    //     backdropFilter: "blur(20px)",
-    //     backgroundColor: "rgba(13, 9, 10, 0.7)",
-    //   }}
-    >
-        <div className='w-full text-white flex gap-2  items-center'>
-            <Image src='/achievements.svg' width={20} height={20} alt={'image'} className='w-auto h-auto' />
-            <h1 className={`${rajdhani.className} font-[500] xl:text-[20px] lg:text-[17px]`}>ACHIEVEMENTS</h1>
-        </div>
-        {Array.from({ length: 10 }, (_, index) => (
-
-        <Achievement key={index}/>
-          ))}
-      
+    <div className=" w-full  rounded-md p-3 h-auto bg-primaryColor">
+      <div className="w-full text-white flex gap-2  items-center">
+        <Image
+          src="/achievements.svg"
+          width={20}
+          height={20}
+          alt={"image"}
+          className="w-auto h-auto"
+        />
+        <h1
+          className={cn(
+            "font-[500] xl:text-[20px] lg:text-[17px]",
+            rajdhani.className
+          )}
+        >
+          ACHIEVEMENTS
+        </h1>
+      </div>
+      {Array.from({ length: 10 }, (_, index) => (
+        <Achievement key={index} />
+      ))}
     </div>
-  )
-}
+  );
+};
 
-export default Achievements
+export default Achievements;
diff --git a/app/components/Dashboard/Overview/ContentCenter.tsx b/app/components/Dashboard/Overview/ContentCenter.tsx
index 9f61e6b..0739655 100644
--- a/app/components/Dashboard/Overview/ContentCenter.tsx
+++ b/app/components/Dashboard/Overview/ContentCenter.tsx
@@ -1,9 +1,6 @@
 'use client';
 import React from "react";
-import UserProfile from "./UserProfile/UserProfile";
-import MatchHistory from "./MatchHistory/MatchHistory";
 import Standing from "./Standing/Standing";
-import Graph from "./Graph/Graph";
 import UserProfileSecond from "./UserProfileSecond/UserProfileSecond";
 import Achievements from "./Achievements/Achievements";
 import Items from "./Items/Items";
diff --git a/app/components/Dashboard/Overview/Game/BigCard.tsx b/app/components/Dashboard/Overview/Game/BigCard.tsx
index ebf1ba9..29616a9 100644
--- a/app/components/Dashboard/Overview/Game/BigCard.tsx
+++ b/app/components/Dashboard/Overview/Game/BigCard.tsx
@@ -1,18 +1,9 @@
 /* eslint-disable @next/next/no-img-element */
 import React from "react";
-
-import { Inter } from "next/font/google";
-import { Rajdhani } from "next/font/google";
-const rajdhani = Rajdhani({
-  subsets: ["latin"],
-  weight: ["300", "400", "500", "600", "700"],
-});
-const inter = Inter({
-  subsets: ["latin"],
-  weight: ["300", "400", "500", "700"],
-});
+import { inter, rajdhani } from "@/app/utils/fontConfig";
 
 import { motion } from "framer-motion";
+import { cn } from "@/components/cn";
 
 const BigCard = ({ gameMode }: { gameMode: string }) => {
   return (
@@ -27,23 +18,39 @@ const BigCard = ({ gameMode }: { gameMode: string }) => {
             ? "/game3.png"
             : "/game4.png"
         }`}
-        // src={`/game1.png`}
         className="w-full h-full object-cover "
         alt="gameImage"
         initial={{ scale: 1 }}
         whileHover={{ scale: 1.15, rotate: 4 }}
         transition={{ duration: 0.5 }}
       />
-      <div className="h-[25%] w-full bg-transparent absolute bottom-0 text-white flex flex-col 2xl:p-8 md:p-8 lg:p-4 p-4 2xl:gap-4 gap-2"
-          style={{
-            backdropFilter: "blur(5px)",
-            backgroundColor: "rgba(13, 9, 10, 0.5)",
-          }}
+      <div
+        className="h-[25%] w-full bg-transparent absolute bottom-0 text-white flex flex-col 2xl:p-8 md:p-8 lg:p-4 p-4 2xl:gap-4 gap-2"
+        style={{
+          backdropFilter: "blur(5px)",
+          backgroundColor: "rgba(13, 9, 10, 0.5)",
+        }}
       >
-        <h1 className={`${rajdhani.className} font-[600] 2xl:text-2xl text-lg`}>Gamemode</h1>
-        <p className={`${inter.className} 2xl:text-md text-sm w-[95%] sm:w-auto`}>Information about the game mode, explain what the user can expect when they select this game mode</p>
+        <h1
+          className={cn("font-[600] 2xl:text-2xl text-lg", rajdhani.className)}
+        >
+          Gamemode
+        </h1>
+        <p
+          className={cn(
+            "2xl:text-md text-sm w-[95%] sm:w-auto",
+            inter.className
+          )}
+        >
+          Information about the game mode, explain what the user can expect when
+          they select this game mode
+        </p>
         <div className="flex items-center gap-4">
-          <img src="/queue.svg" alt="queue" className="2xl:w-[20px] 2xl:h-[20px] w-[14px] h-[14px]"/>
+          <img
+            src="/queue.svg"
+            alt="queue"
+            className="2xl:w-[20px] 2xl:h-[20px] w-[14px] h-[14px]"
+          />
           <p className="2xl:text-md text-sm">Queue time: 2 mins</p>
         </div>
       </div>
diff --git a/app/components/Dashboard/Overview/Game/Caroussel.tsx b/app/components/Dashboard/Overview/Game/Caroussel.tsx
index 78b28f6..1913902 100644
--- a/app/components/Dashboard/Overview/Game/Caroussel.tsx
+++ b/app/components/Dashboard/Overview/Game/Caroussel.tsx
@@ -3,7 +3,6 @@ import React from "react";
 import Carousel from "react-multi-carousel";
 import "react-multi-carousel/lib/styles.css";
 import BigCard from "./BigCard";
-import { FaCaretLeft, FaCaretRight } from "react-icons/fa6";
 const responsive = {
   desktop: {
     breakpoint: { max: 3000, min: 1024 },
diff --git a/app/components/Dashboard/Overview/Game/Header.tsx b/app/components/Dashboard/Overview/Game/Header.tsx
index 11d838d..0fe7835 100644
--- a/app/components/Dashboard/Overview/Game/Header.tsx
+++ b/app/components/Dashboard/Overview/Game/Header.tsx
@@ -1,28 +1,46 @@
-import React from 'react'
-import Image from 'next/image';
-import { Inter, Rajdhani } from 'next/font/google'
+import React from "react";
+import Image from "next/image";
+import { inter, rajdhani } from "@/app/utils/fontConfig";
+import { cn } from "@/components/cn";
 
-const rajdhani = Rajdhani({
-    subsets: ["latin"],
-    weight: ["300", "400", "500", "700"],
-  });
-const inter = Inter({
-    subsets: ["latin"],
-    weight: ["300", "400", "500", "700"],
-  });
 const Header = () => {
   return (
-    <div className={`  flex ${rajdhani.className} justify-between items-center text-white`}>
-        <div className='flex flex-col relative'>
-            <h1 className='font-[600] text-[24px]' >Hello Andrew</h1>
-            <p className={`text-buttonGray ${inter.className} text-[13px] xl:w-auto md:w-[165px] sm:flex hidden truncate`}>Ready to get started for an exciting new game? Choose a game-mode and click Play.</p>
-        </div>
-        <button className={`flex items-center justify-center ${rajdhani.className} sm:py-3 sm:px-[65px] py-2 bg- px-5 rounded-md gap-2 border border-red-500`}>
-            <span className='font-[500]'>Play</span>
-            <Image src={'/nextPlay.svg'} width={20} height={20} alt='next to play image'/>
-        </button>
+    <div
+      className={cn(
+        `flex justify-between items-center text-white`,
+        rajdhani.className
+      )}
+    >
+      <div className="flex flex-col relative">
+        <h1 className="font-[600] text-[24px]">Hello Andrew</h1>
+        <p
+          className={cn(
+            "text-buttonGray",
+            inter.className,
+            "text-[13px] xl:w-auto md:w-[165px] sm:flex hidden truncate"
+          )}
+        >
+          Ready to get started for an exciting new game? Choose a game-mode and
+          click Play.
+        </p>
+      </div>
+      <button
+        className={cn(
+          "flex items-center justify-center",
+          rajdhani.className,
+          "sm:py-3 sm:px-[65px] py-2 bg- px-5 rounded-md gap-2 border border-red-500"
+        )}
+      >
+        <span className="font-[500]">Play</span>
+        <Image
+          src={"/nextPlay.svg"}
+          width={20}
+          height={20}
+          alt="next to play image"
+        />
+      </button>
     </div>
-  )
-}
+  );
+};
 
-export default Header
+export default Header;
diff --git a/app/components/Dashboard/Overview/Items/Items.tsx b/app/components/Dashboard/Overview/Items/Items.tsx
index 07ebedc..a36df37 100644
--- a/app/components/Dashboard/Overview/Items/Items.tsx
+++ b/app/components/Dashboard/Overview/Items/Items.tsx
@@ -1,38 +1,30 @@
 import React from "react";
+import { rajdhani } from "@/app/utils/fontConfig";
 import Image from "next/image";
-import { Rajdhani } from "next/font/google";
+import { cn } from "@/components/cn";
 
-const rajdhani = Rajdhani({
-  subsets: ["latin"],
-  weight: ["400", "500", "600", "700"],
-});
 const Items = () => {
   return (
-    <div
-      className="lg:w-[50%] w-full h-full bg-[#101823] rounded-md overflow-y-auto"
-      // style={{
-      //   backdropFilter: "blur(20px)",
-      //   backgroundColor: "rgba(13, 9, 10, 0.7)",
-      // }}
-    >
-      <div className="bg-[#101823] sticky top-0 z-10">
+    <div className="lg:w-[50%] w-full h-full bg-primaryColor rounded-md overflow-y-auto">
+      <div className="bg-primaryColor sticky top-0 z-10">
         <div className="flex items-center text-white  p-4 pb-2 ">
           <Image src="/itemsMenu.svg" width={40} height={40} alt={"image"} />
-          <h1 className={`${rajdhani.className} text-[20px]`}>Items</h1>
+          <h1 className={cn("font-[500] text-[20px]", rajdhani.className)}>
+            Items
+          </h1>
         </div>
       </div>
       <div className="grid p-4 2xl:grid-cols-10  md:grid-cols-7 lg:grid-cols-5 grid-cols-4 mt-2">
         {Array.from({ length: 40 }, (_, index) => (
-            <Image
-              src="/badge2_c.png"
-              width={0}
-              height={0}
-              alt={"image"}
-              key={index}
-              sizes="100vh 100vw"
-              // style={{ width: "70px", height: "70px" }}
-              className="w-[70px] h-[70px]"
-            />
+          <Image
+            src="/badge2_c.png"
+            width={0}
+            height={0}
+            alt={"image"}
+            key={index}
+            sizes="100vh 100vw"
+            className="w-[70px] h-[70px]"
+          />
         ))}
       </div>
     </div>
diff --git a/app/components/Dashboard/Overview/MatchHistory/MatchHistory_2.tsx b/app/components/Dashboard/Overview/MatchHistory/MatchHistory_2.tsx
index d8a20bf..3331d28 100644
--- a/app/components/Dashboard/Overview/MatchHistory/MatchHistory_2.tsx
+++ b/app/components/Dashboard/Overview/MatchHistory/MatchHistory_2.tsx
@@ -1,18 +1,18 @@
 import React from "react";
-import { Rajdhani } from "next/font/google";
+import { rajdhani } from "@/app/utils/fontConfig";
 import OneGame_2 from "./OneGame_2";
+import { cn } from "@/components/cn";
 
-const rajdhani = Rajdhani({
-  subsets: ["latin"],
-  weight: ["400", "500", "600", "700"],
-});
 const MatchHistory_2 = () => {
   return (
-    <div
-      className="w-full rounded-md bg-[#101823] overflow-y-auto h-[700px] text-white flex flex-col overflow-x-hidden"
-    >
-      <div className="w-full p-6 sticky top-0 bg-[#101823] z-30">
-        <h1 className={`sm:text-4xl text-2xl font-semibold ${rajdhani.className}`}>
+    <div className="w-full rounded-md bg-primaryColor overflow-y-auto h-[700px] text-white flex flex-col overflow-x-hidden">
+      <div className="w-full p-6 sticky top-0 bg-primaryColor z-30">
+        <h1
+          className={cn(
+            `sm:text-4xl text-2xl font-semibold`,
+            rajdhani.className
+          )}
+        >
           All Matches
         </h1>
       </div>
diff --git a/app/components/Dashboard/Overview/MatchHistory/OneGame_2.tsx b/app/components/Dashboard/Overview/MatchHistory/OneGame_2.tsx
index 21a6808..10bdc00 100644
--- a/app/components/Dashboard/Overview/MatchHistory/OneGame_2.tsx
+++ b/app/components/Dashboard/Overview/MatchHistory/OneGame_2.tsx
@@ -1,82 +1,86 @@
 import React from "react";
 import { motion } from "framer-motion";
-import { Roboto } from "next/font/google";
 import Image from "next/image";
+import { cn } from "@/components/cn";
 
-const roboto = Roboto({
-  subsets: ["latin"],
-  weight: ["400", "500", "700", "900"],
-});
 const OneGame_2 = ({ status }: { status: string }) => {
   return (
     <motion.div
-      className="rounded-md w-full sm:h-[70px] bg-gradient-to-r bg-[#172234] flex items-center justify-between px-4"
+      className="rounded-md w-full md:h-[70px] bg-gradient-to-r bg-secondaryColor flex items-center justify-between px-4"
       whileHover={{ x: -5 }}
     >
-      <div className="flex items-center justify-between 2xl:w-[42%] sm:w-[80%] w-[88%]">
-        <div className="relative w-[50px] h-[50px] sm:flex hidden ">
+      <div className="flex items-center justify-between 2xl:w-[42%] md:w-[80%] w-[88%]">
+        <div className="relative w-[50px] h-[50px] md:flex hidden ">
           <Image
             src="/b.png"
             fill
             alt="img"
             sizes="w-auto h-auto"
-            className={`rounded-full ring-[2px] ${status === 'lose' ? ' ring-[#FF4656]':'ring-[#24D8AF]'}`}
+            className={cn(
+              "rounded-full ring-[2px]",
+              status === "win" ? "ring-[#FF4656]" : "ring-mathHistoryGreenColor"
+            )}
           />
         </div>
-        <div className="flex flex-col items-center justify-center sm:leading-5 leading-2">
-          <span className="xl:text-[18px] sm:text-[15px] text-[11px] font-semibold tracking-widest">
+        <div className="flex flex-col items-center justify-center md:leading-5 leading-2">
+          <span className="xl:text-[18px] md:text-[15px] text-[11px] font-semibold tracking-widest">
             13:5
           </span>
           <span
-            className={`text-[#647087] text-[10px] sm:text-clip truncate w-[50px] xl:text-[14px] sm:text-[11px] font-semibold`}
+            className={`text-[#647087] text-[10px] md:text-clip truncate w-[50px] xl:text-[14px] md:text-[11px] font-semibold`}
           >
             Ascent
           </span>
         </div>
-        <div className="flex flex-col items-center justify-center sm:leading-5 leading-2">
+        <div className="flex flex-col items-center justify-center md:leading-5 leading-2">
           <span
-            className={`${
-              status === "win" ? "text-[#24D8AF]" : "text-[#FF4656]"
-            } font-semibold xl:text-[20px] sm:text-[17px] text-[12px] tracking-tighter`}
+            className={cn(
+              "font-semibold xl:text-[20px] md:text-[17px] text-[12px] tracking-tighter",
+              status === "win"
+                ? "text-mathHistoryGreenColor"
+                : "text-mainRedColor"
+            )}
           >
             2.00KD
           </span>
-          <span className="text-[#647087] xl:text-[13px] sm:text-[11px] text-[8px]">
+          <span className="text-[#647087] xl:text-[13px] md:text-[11px] text-[8px]">
             15 / 25 / 3
           </span>
         </div>
-        <div className="flex flex-col items-start sm:leading-5 leading-2">
+        <div className="flex flex-col items-start md:leading-5 leading-2">
           <span
-            className={`${
-              status === "win" ? "text-[#24D8AF]" : "text-[#FF4656]"
-            } font-semibold xl:text-[20px] sm:text-[17px] text-[12px] tracking-tighter`}
+            className={cn(
+              "font-semibold xl:text-[20px] md:text-[17px] text-[12px] tracking-tighter",
+              status === "win"
+                ? "text-mathHistoryGreenColor"
+                : "text-mainRedColor"
+            )}
           >
             55%
           </span>
-          <span className="text-[#647087] xl:text-[13px] sm:text-[11px] text-[8px]">
+          <span className="text-[#647087] xl:text-[13px] md:text-[11px] text-[8px]">
             Headshot%
           </span>
         </div>
         <div className="flex flex-col">
-          <span className="text-white font-semibold xl:text-[20px] text-[12px] sm:text-[17px] tracking-tight">
+          <span className="text-white font-semibold xl:text-[20px] text-[12px] md:text-[17px] tracking-tight">
             149 Combat Score
           </span>
-            <span className="text-[#EBAD40] font-[500] text-[8px] xl:text-[14px] sm:text-[11px] tracking-tight">
-              MVP
-            </span>
-          
+          <span className="text-[#EBAD40] font-[500] text-[8px] xl:text-[14px] md:text-[11px] tracking-tight">
+            MVP
+          </span>
         </div>
       </div>
-      <div className="flex items-center sm:w-auto w-[25px] justify-center py-1 sm:px-[11px] sm:text-[15px] text-[11px] tracking-tight font-semibold rounded-md sm:bg-[#202B43]">
+      <div className="flex items-center md:w-auto w-[25px] justify-center py-1 md:px-[11px] md:text-[15px] text-[11px] tracking-tight font-semibold rounded-md md:bg-[#202B43]">
         Mar 5, 2024
       </div>
       <div className="items-center justify-between w-[42%] hidden 2xl:flex">
         <div className="flex flex-col">
-          <span className="text-white font-semibold xl:text-[20px] sm:text-[17px] tracking-tight">
+          <span className="text-white font-semibold xl:text-[20px] md:text-[17px] tracking-tight">
             149 Combat Score
           </span>
           <div className="flex gap-2 items-center">
-            <span className="text-[#EBAD40] font-[500] xl:text-[14px] sm:text-[11px] tracking-tight">
+            <span className="text-[#EBAD40] font-[500] xl:text-[14px] md:text-[11px] tracking-tight">
               MVP
             </span>
             <span>-</span>
@@ -87,9 +91,12 @@ const OneGame_2 = ({ status }: { status: string }) => {
         </div>
         <div className="flex flex-col items-start leading-5">
           <span
-            className={`${
-              status === "lose" ? "text-[#24D8AF]" : "text-[#FF4656]"
-            } font-semibold xl:text-[20px] sm:text-[17px] tracking-tighter`}
+            className={cn(
+              "font-semibold xl:text-[20px] md:text-[17px] text-[12px] tracking-tighter",
+              status === "win"
+                ? "text-mathHistoryGreenColor"
+                : "text-mainRedColor"
+            )}
           >
             55%
           </span>
@@ -99,9 +106,12 @@ const OneGame_2 = ({ status }: { status: string }) => {
         </div>
         <div className="flex flex-col items-center justify-center leading-5">
           <span
-            className={`${
-              status === "lose" ? "text-[#24D8AF]" : "text-[#FF4656]"
-            } font-semibold xl:text-[20px] sm:text-[17px] tracking-tighter`}
+            className={cn(
+              "font-semibold xl:text-[20px] md:text-[17px] text-[12px] tracking-tighter",
+              status === "win"
+                ? "text-mathHistoryGreenColor"
+                : "text-mainRedColor"
+            )}
           >
             2.00KD
           </span>
@@ -110,11 +120,11 @@ const OneGame_2 = ({ status }: { status: string }) => {
           </span>
         </div>
         <div className="flex flex-col items-center justify-center leading-5">
-          <span className="xl:text-[18px] sm:text-[15px] font-semibold tracking-widest">
+          <span className="xl:text-[18px] md:text-[15px] font-semibold tracking-widest">
             13:5
           </span>
           <span
-            className={`text-[#647087] xl:text-[14px] sm:text-[11px] font-semibold`}
+            className={`text-[#647087] xl:text-[14px] md:text-[11px] font-semibold`}
           >
             Ascent
           </span>
@@ -125,10 +135,15 @@ const OneGame_2 = ({ status }: { status: string }) => {
             fill
             alt="img"
             sizes="w-auto h-auto"
-            className={`ring-[2px] ${status === 'win' ? ' ring-[#FF4656]':'ring-[#24D8AF]'} rounded-full`}
+            className={cn(
+              "rounded-full ring-[2px]",
+              status === "win"
+                ? "ring-mainRedColor"
+                : "ring-mathHistoryGreenColor"
+            )}
           />
         </div>
-      </div>{" "}
+      </div>
     </motion.div>
   );
 };
diff --git a/app/components/Dashboard/Overview/Standing/Standing.tsx b/app/components/Dashboard/Overview/Standing/Standing.tsx
index 671dbee..2d50f33 100644
--- a/app/components/Dashboard/Overview/Standing/Standing.tsx
+++ b/app/components/Dashboard/Overview/Standing/Standing.tsx
@@ -1,26 +1,26 @@
-import React from 'react'
-import Image from 'next/image'
-import { Rajdhani } from 'next/font/google'
-import StandingTable from './StandingTable'
+import React from "react";
+import Image from "next/image";
+import StandingTable from "./StandingTable";
+import { rajdhani } from "@/app/utils/fontConfig";
+import { cn } from "@/components/cn";
 
-const rajdhani = Rajdhani({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })
 const Standing = () => {
-
-
   return (
-    <div className='w-full bg-[#101823]  flex flex-col gap-2 p-2 rounded-md'
-    // style={{
-    //   backdropFilter: "blur(20px)",
-    //   backgroundColor: "rgba(13, 9, 10, 0.7)",
-    // }}
-    >
-      <div className='flex text-white sm:gap-0 gap-1'>
-        <Image src='/standing.svg' width={40} height={40} alt={'standing'} />
-        <h1 className={`${rajdhani.className} lg:text-xl text-[20px] font-[500] text-lg self-end`}>STANDING</h1>
+    <div className="w-full bg-primaryColor  flex flex-col gap-2 p-2 rounded-md">
+      <div className="flex text-white sm:gap-0 gap-1">
+        <Image src="/standing.svg" width={40} height={40} alt={"standing"} />
+        <h1
+          className={cn(
+            "lg:text-xl text-[20px] font-[500] text-lg self-end",
+            rajdhani.className
+          )}
+        >
+          STANDING
+        </h1>
       </div>
       <StandingTable />
     </div>
-  )
-}
+  );
+};
 
-export default Standing
+export default Standing;
diff --git a/app/components/Dashboard/Overview/Standing/StandingTable.tsx b/app/components/Dashboard/Overview/Standing/StandingTable.tsx
index d06a175..b58cf0f 100644
--- a/app/components/Dashboard/Overview/Standing/StandingTable.tsx
+++ b/app/components/Dashboard/Overview/Standing/StandingTable.tsx
@@ -1,17 +1,15 @@
 import React from "react";
-import { Roboto } from "next/font/google";
+import { roboto } from "@/app/utils/fontConfig";
 import StandingRow from "./StandingRow";
+import { cn } from "@/components/cn";
+
 
-const roboto = Roboto({
-  subsets: ["latin"],
-  weight: ["100", "300", "400", "500", "700"],
-});
 const StandingTable = () => {
   return (
     <div>
       <div className="relative">
         <table
-          className={`${roboto.className}  w-full text-sm text-left rtl:text-right text-white`}
+          className={cn('w-full text-sm text-left rtl:text-right text-white', roboto.className)}
         >
           <thead className="text-xs text-gray-400  bg-transparent ">
             <tr>
@@ -42,83 +40,6 @@ const StandingTable = () => {
             {Array.from({ length: 10 }, (_, index) => (
               <StandingRow key={index} />
             ))}
-
-            {/* <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
-              <th
-                scope="row"
-                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
-              >
-                Microsoft Surface Pro
-              </th>
-              <td className="px-6 py-4">White</td>
-              <td className="px-6 py-4">Laptop PC</td>
-              <td className="px-6 py-4">$1999</td>
-              <td className="px-6 py-4">
-                <a
-                  href="#"
-                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
-                >
-                  Edit
-                </a>
-              </td>
-            </tr>
-            <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
-              <th
-                scope="row"
-                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
-              >
-                Magic Mouse 2
-              </th>
-              <td className="px-6 py-4">Black</td>
-              <td className="px-6 py-4">Accessories</td>
-              <td className="px-6 py-4">$99</td>
-              <td className="px-6 py-4">
-                <a
-                  href="#"
-                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
-                >
-                  Edit
-                </a>
-              </td>
-            </tr>
-            <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
-              <th
-                scope="row"
-                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
-              >
-                Google Pixel Phone
-              </th>
-              <td className="px-6 py-4">Gray</td>
-              <td className="px-6 py-4">Phone</td>
-              <td className="px-6 py-4">$799</td>
-              <td className="px-6 py-4">
-                <a
-                  href="#"
-                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
-                >
-                  Edit
-                </a>
-              </td>
-            </tr>
-            <tr>
-              <th
-                scope="row"
-                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
-              >
-                Apple Watch 5
-              </th>
-              <td className="px-6 py-4">Red</td>
-              <td className="px-6 py-4">Wearables</td>
-              <td className="px-6 py-4">$999</td>
-              <td className="px-6 py-4">
-                <a
-                  href="#"
-                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
-                >
-                  Edit
-                </a>
-              </td>
-            </tr> */}
           </tbody>
         </table>
       </div>
diff --git a/app/components/Dashboard/Overview/UserProfileSecond/Friends.tsx b/app/components/Dashboard/Overview/UserProfileSecond/Friends.tsx
index 3f5557b..957eab6 100644
--- a/app/components/Dashboard/Overview/UserProfileSecond/Friends.tsx
+++ b/app/components/Dashboard/Overview/UserProfileSecond/Friends.tsx
@@ -1,28 +1,23 @@
 import Image from 'next/image'
 import React from 'react'
 
-import { Inter } from 'next/font/google'
-import { Rubik } from 'next/font/google'
-
-const inter = Inter({
-    subsets: ['latin'],
-    weight: ['400', '500', '600', '700'],
-    })
-const rubik = Rubik({
-  subsets: ['latin'],
-  weight: ['400', '500', '600', '700'],
-})
+import { inter, rubik } from '@/app/utils/fontConfig'
+import { cn } from '@/components/cn'
 const Friends = () => {
   return (
     <div className='flex justify-between items-center'>
         <div className='flex gap-4 items-center'>
             <Image src='/b.png' alt='profile' width={50} height={50} className='rounded-full' />
-            <div className={`flex flex-col ${inter.className}`}>
+            <div 
+            className={cn('flex flex-col', inter.className)}
+            >
                 <span className='2xl:text-[17px]'>Abdelmottalib</span>
                 <p className='text-[11px]'>@konami</p>
             </div>
         </div>
-        <div className={`w-[25px] h-[25px] flex items-center justify-center text-white text-[11px] ${rubik.className} font-[400] rounded-full bg-[#BD3944]`}>#1</div>
+        <div 
+        className={cn(`w-[25px] h-[25px] flex items-center justify-center text-white text-[11px] font-[400] rounded-full bg-[#BD3944]`, rubik.className)}
+        >#1</div>
     </div>
   )
 }
diff --git a/app/components/Dashboard/Overview/UserProfileSecond/UserProfileSecond.tsx b/app/components/Dashboard/Overview/UserProfileSecond/UserProfileSecond.tsx
index 8547775..991f3ba 100644
--- a/app/components/Dashboard/Overview/UserProfileSecond/UserProfileSecond.tsx
+++ b/app/components/Dashboard/Overview/UserProfileSecond/UserProfileSecond.tsx
@@ -1,63 +1,48 @@
 import React from "react";
-import {motion} from "framer-motion";
-import { Rajdhani } from "next/font/google";
-import { Inter } from "next/font/google";
+import { motion } from "framer-motion";
 import Image from "next/image";
 import { PinContainer } from "@/components/ui/3d-pin";
 import Friends from "./Friends";
-import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
+import { CircularProgressbar } from "react-circular-progressbar";
 import "react-circular-progressbar/dist/styles.css";
-const inter = Inter({ subsets: ["latin"] });
-const rajdhani = Rajdhani({ subsets: ["latin"], weight: ["400", "500"] });
-
+import { rajdhani } from "@/app/utils/fontConfig";
+import { cn } from "@/components/cn";
 const UserProfileSecond = ({ user }: any) => {
   return (
-    <div
-      className=" p-4 bg-[#101823] rounded-md "
-      // style={{
-      //   backdropFilter: "blur(1px)",
-      //   backgroundColor: "rgba(13, 9, 10, 0.3)",
-      // }}
-    >
+    <div className=" p-4 bg-primaryColor rounded-md ">
       <div className=" w-full h-full relative flex flex-col 2xl:gap-[80px] gap-12 rounded-md">
         <div className="w-full  h-[290px] relative">
           <PinContainer title="Overview" href="https://twitter.com/mannupaaji">
             <div className="overflow-hidden h-[290px] w-full relative">
-              {
-                user ? (
-                  <Image
-                    src={user?.banner_picture ? user?.banner_picture : "/car1.jpg"}
-                    fill
-                    priority
-                    style={{ objectFit: "cover" }}
-                    alt="bg"
-                    sizes="auto"
-                    className="z-[-1] rounded-2xl"
-                  />
-                ) : (
-                  <div className="flex items-center justify-center w-full h-full bg-gray-400 rounded  animate-pulse">
-                      <svg className="w-10 h-10 text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
-                          <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
-                      </svg>
-                  </div>
-                )
-              }
+              {user ? (
+                <Image
+                  src={
+                    user?.banner_picture ? user?.banner_picture : "/car1.jpg"
+                  }
+                  fill
+                  priority
+                  style={{ objectFit: "cover" }}
+                  alt="bg"
+                  sizes="auto"
+                  className="z-[-1] rounded-2xl"
+                />
+              ) : (
+                <div className="flex items-center justify-center w-full h-full bg-gray-400 rounded  animate-pulse">
+                  <svg
+                    className="w-10 h-10 text-gray-300"
+                    aria-hidden="true"
+                    xmlns="http://www.w3.org/2000/svg"
+                    fill="currentColor"
+                    viewBox="0 0 20 18"
+                  >
+                    <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
+                  </svg>
+                </div>
+              )}
             </div>
           </PinContainer>
-          <div
-            className="2xl:w-[170px]  xl:w-[120px] xl:h-[200px] absolute 2xl:h-[250px]  bg-[#101823] rounded-md 2xl:-bottom-[120px] 2xl:left-[100px] p-2 text-white sm:bottom-[10px] sm:left-[50px] sm:w-[110px] sm:h-[170px] bottom-[10px] left-[20px] w-[80px] h-[150px]"
-            // style={{
-            //   backdropFilter: "blur(10px)",
-            //   backgroundColor: "rgba(13, 9, 10, 0.3)",
-            // }}
-          >
-            <div
-              className="w-full h-full flex flex-col items-center bg-[#101823] rounded-md gap-4"
-              // style={{
-              //   backdropFilter: "blur(10px)",
-              //   backgroundColor: "rgba(13, 9, 10, 0.3)",
-              // }}
-            >
+          <div className="2xl:w-[170px]  xl:w-[120px] xl:h-[200px] absolute 2xl:h-[250px]  bg-primaryColor rounded-md 2xl:-bottom-[120px] 2xl:left-[100px] p-2 text-white sm:bottom-[10px] sm:left-[50px] sm:w-[110px] sm:h-[170px] bottom-[10px] left-[20px] w-[80px] h-[150px]">
+            <div className="w-full h-full flex flex-col items-center bg-primaryColor rounded-md gap-4">
               <div className="w-full h-[60%]   relative">
                 {user ? (
                   <Image
@@ -70,14 +55,19 @@ const UserProfileSecond = ({ user }: any) => {
                   />
                 ) : (
                   <div className="flex items-center justify-center w-full h-full bg-gray-400 rounded  animate-pulse">
-                      <svg className="w-10 h-10 text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
-                          <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
-                      </svg>
+                    <svg
+                      className="w-10 h-10 text-gray-300"
+                      aria-hidden="true"
+                      xmlns="http://www.w3.org/2000/svg"
+                      fill="currentColor"
+                      viewBox="0 0 20 18"
+                    >
+                      <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
+                    </svg>
                   </div>
                 )}
               </div>
-              {
-                user ? (
+              {user ? (
                 <div className="flex flex-col items-center">
                   <h2 className="mt-2 xl:text-[15px] text-[10px] text-center">
                     {user.name}
@@ -87,28 +77,21 @@ const UserProfileSecond = ({ user }: any) => {
                   </span>
                   <span className="xl:text-[10px] text-[7px]">400,000</span>
                 </div>
-                ) :(
-                <div  className="w-[80%] animate-pulse">
-                    <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-full mb-4"></div>
-                    <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 w-full mb-2.5"></div>
-                    <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 mb-2.5"></div>
+              ) : (
+                <div className="w-[80%] animate-pulse">
+                  <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-full mb-4"></div>
+                  <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 w-full mb-2.5"></div>
+                  <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 mb-2.5"></div>
                 </div>
-                )
-              }
+              )}
             </div>
           </div>
         </div>
 
         <div className="w-full   border-red-500 pb-5  flex sm:flex-row flex-col sm:flex-wrap 2xl:mt-0 mt-2 justify-between sm:gap-2 gap-5">
           <div className="2xl:w-[35%] sm:w-[55%]  border-yellow-500 flex sm:h-[250px]">
-            <div
-              className="w-full  border-green-500  2xl:self-end 2xl:h-[55%] lg:h-[100%] items-center bg-[#101823]  flex justify-between rounded-md 2xl:flex-row"
-              // style={{
-              //   backdropFilter: "blur(10px)",
-              //   backgroundColor: "rgba(13, 9, 10, 0.3)",
-              // }}
-            >
-              <div className="flex   sm:w-full items-center  sm:h-[40%] h-full 2xl:h-full w-full bg-[#172234] rounded-md">
+            <div className="w-full  border-green-500  2xl:self-end 2xl:h-[55%] lg:h-[100%] items-center bg-primaryColor  flex justify-between rounded-md 2xl:flex-row">
+              <div className="flex   sm:w-full items-center  sm:h-[40%] h-full 2xl:h-full w-full bg-secondaryColor rounded-md">
                 <div className="relative">
                   <Image
                     src={"/badge1.png"}
@@ -130,11 +113,10 @@ const UserProfileSecond = ({ user }: any) => {
                   </div>
                   <div className="sm:w-[95%] w-[91%] 2xl:w-[98%] b bg-[#D6D6D6] rounded-full">
                     <motion.div
-                      className="bg-[#FF4654] p-2 sm:h-2.5 h-2 rounded-full relative w-[45%]"
+                      className="bg-mainRedColor p-2 sm:h-2.5 h-2 rounded-full relative w-[45%]"
                       initial={{ width: "0%" }}
                       animate={{ width: "45%" }}
                       transition={{ duration: 1 }}
-                      // style={{ width: "45%" }}
                     >
                       <div className="relative">
                         <div className="absolute 2xl:w-4 2xl:h-4 w-3 h-3  bg-[#FF4656] 2xl:-right-[13px] -right-[11px] top-[16px]  transform rotate-45"></div>
@@ -146,16 +128,14 @@ const UserProfileSecond = ({ user }: any) => {
                   </div>
                 </div>
               </div>
-              {/* <div className="  2xl:w-[30%] w-full h-[40%] 2xl:h-auto bg-dashBack rounded-md border"></div> */}
             </div>
           </div>
 
           <div
-            className={`2xl:w-[30%] p-5 text-white ${rajdhani.className} bg-[#172234] sm:w-[42%]  rounded-lg h-[250px] flex flex-col gap-4`}
-            // style={{
-            //   backdropFilter: "blur(10px)",
-            //   backgroundColor: "rgba(13, 9, 10, 0.3)",
-            // }}
+            className={cn(
+              "2xl:w-[30%] p-5 text-white bg-secondaryColor sm:w-[42%]  rounded-lg h-[250px] flex flex-col gap-4",
+              rajdhani.className
+            )}
           >
             <h1 className="2xl:text-3xl xl:text-2xl text-xl font-[600]">
               TOP 3 FRIENDS
@@ -167,11 +147,10 @@ const UserProfileSecond = ({ user }: any) => {
             </div>
           </div>
           <div
-            className={` 2xl:w-[30%] w-full bg-[#172234] flex flex-col rounded-lg text-3xl font-[600] text-white ${rajdhani.className} p-4`}
-            // style={{
-            //   backdropFilter: "blur(10px)",
-            //   backgroundColor: "rgba(13, 9, 10, 0.3)",
-            // }}
+            className={cn(
+              "2xl:w-[30%] w-full bg-secondaryColor flex flex-col rounded-lg text-3xl font-[600] text-white p-4",
+              rajdhani.className
+            )}
           >
             <h1 className="text-center">Lifetime Overview</h1>
             <div className="w-full  flex mt-4 gap-6 justify-evenly items-center">
diff --git a/app/components/Dashboard/Profile/LinkedFriend.tsx b/app/components/Dashboard/Profile/LinkedFriend.tsx
index d34ab75..a34205e 100644
--- a/app/components/Dashboard/Profile/LinkedFriend.tsx
+++ b/app/components/Dashboard/Profile/LinkedFriend.tsx
@@ -1,42 +1,39 @@
-import Image from 'next/image'
-import React from 'react'
-import { useRouter } from 'next/navigation'
-import { Inter } from 'next/font/google'
-import { Rubik } from 'next/font/google'
-
-const inter = Inter({
-    subsets: ['latin'],
-    weight: ['400', '500', '600', '700'],
-    })
-const rubik = Rubik({
-  subsets: ['latin'],
-  weight: ['400', '500', '600', '700'],
-})
-const LinkedFriend = (props : any) => {
+import Image from "next/image";
+import React from "react";
+import { useRouter } from "next/navigation";
+import { inter, rubik } from "@/app/utils/fontConfig";
+import { cn } from "@/components/cn";
+const LinkedFriend = (props: any) => {
   const router = useRouter();
-  const handleClick = (id : any) => {
+  const handleClick = (id: any) => {
     router.push(`/Dashboard/Profile?id=${id}`);
-  }
+  };
   return (
-    <div className='flex justify-between items-center'>
-        <div className='flex gap-4 items-center'>
-            {/* <Image src={props.user?.picture || '/b.png'} alt='profile' width={50} height={50} className='rounded-full' /> */}
-            <Image
-              onClick={() => handleClick(props.user?.id)}
-              alt='profile'
-              height={50}
-              width={50}
-              src={props.user?.picture || '/b.png'}
-              className="object-cover cursor-pointer !m-0 !p-0 object-top rounded-full h-[50px] w-[50px] border-2 group-hover:scale-105 group-hover:z-30 border-white  relative transition duration-500"
-            />
-            <div className={`flex flex-col ${inter.className}`}>
-                <span className='2xl:text-[17px]'>{props.user?.name}</span>
-                <p className='text-[11px]'>@{props.user?.username}</p>
-            </div>
+    <div className="flex justify-between items-center">
+      <div className="flex gap-4 items-center">
+        <Image
+          onClick={() => handleClick(props.user?.id)}
+          alt="profile"
+          height={50}
+          width={50}
+          src={props.user?.picture || "/b.png"}
+          className="object-cover cursor-pointer !m-0 !p-0 object-top rounded-full h-[50px] w-[50px] border-2 group-hover:scale-105 group-hover:z-30 border-white  relative transition duration-500"
+        />
+        <div className={`flex flex-col ${inter.className}`}>
+          <span className="2xl:text-[17px]">{props.user?.name}</span>
+          <p className="text-[11px]">@{props.user?.username}</p>
         </div>
-        <div className={`w-[25px] h-[25px] flex items-center justify-center text-white text-[11px] ${rubik.className} font-[400] rounded-full bg-[#BD3944]`}>#{props?.index}</div>
+      </div>
+      <div
+        className={cn(
+          "w-[25px] h-[25px] flex items-center justify-center text-white text-[11px] font-[400] rounded-full bg-[#BD3944]",
+          rubik.className
+        )}
+      >
+        #{props?.index}
+      </div>
     </div>
-  )
-}
+  );
+};
 
-export default LinkedFriend
\ No newline at end of file
+export default LinkedFriend;
diff --git a/app/components/Dashboard/Profile/UserProfile.tsx b/app/components/Dashboard/Profile/UserProfile.tsx
index 1214456..57ac670 100644
--- a/app/components/Dashboard/Profile/UserProfile.tsx
+++ b/app/components/Dashboard/Profile/UserProfile.tsx
@@ -1,18 +1,15 @@
-'use client';
+"use client";
 import React, { use, useEffect, useState } from "react";
 import Image from "next/image";
 import { useGlobalState } from "../../Sign/GlobalState";
 import { Dropdown } from "./Dropdown";
 import { PinContainer } from "@/components/ui/3d-pin";
-import {motion} from "framer-motion";
+import { motion } from "framer-motion";
 import axios from "axios";
 import Userstatus from "./Userstatus";
-import { Rajdhani } from "next/font/google";
-import { Inter } from "next/font/google";
+import { rajdhani } from "@/app/utils/fontConfig";
 import LinkedFriend from "./LinkedFriend";
-
-const inter = Inter({ subsets: ["latin"] });
-const rajdhani = Rajdhani({ subsets: ["latin"], weight: ["400", "500"] });
+import { cn } from "@/components/cn";
 
 const people = [
   {
@@ -56,155 +53,163 @@ const people = [
     username: "The Explorer",
     picture:
       "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3534&q=80",
-  }
+  },
 ];
 
-const UserProfile = ({target} : any) => {
-  const {state} = useGlobalState();
+const UserProfile = ({ target }: any) => {
+  const { state } = useGlobalState();
   const [status, setStatus] = useState<string>("");
   const [recv, setRecv] = useState<string>("");
   const [is, setIs] = useState<boolean>(false);
   const [linkedFriends, setLinkedFriends] = useState<any[]>([]);
 
-  const user : any = state.user;
-  const socket : any= state.socket;
-
+  const user: any = state.user;
+  const socket: any = state.socket;
 
   useEffect(() => {
+    socket?.on("refresh", () => {
+      setIs((prev) => !prev);
+    });
 
-    socket?.on('refresh', () => { setIs((prev) => !prev) });
-
-    return () => { socket?.off('refresh') };
-
+    return () => {
+      socket?.off("refresh");
+    };
   }, [socket]);
 
-
   useEffect(() => {
-    axios.get(`http://localhost:8080/user/linked/${user?.id}/${target?.id}`)
-    .then((res) => {
-      setLinkedFriends(res.data);
-    })
-    .catch((err) => {
-      console.log(err);
-    });
+    axios
+      .get(`http://localhost:8080/user/linked/${user?.id}/${target?.id}`)
+      .then((res) => {
+        setLinkedFriends(res.data);
+      })
+      .catch((err) => {
+        console.log(err);
+      });
   }, [user, target]);
 
-  
   useEffect(() => {
-    axios.get(`http://localhost:8080/friendship/status/${user?.id}/${target?.id}`)
-    .then((res) => {
-      if (res.data?.status === "PENDING" && res.data?.request === "SEND")
-        setStatus(res.data?.status);
-      else if (res.data?.status === "ACCEPTED")
-        setStatus(res.data?.status);
-      else if (res.data?.status === "BLOCKED" && res.data?.request === "SEND")
-        setStatus(res.data?.status);
-      else setStatus("");
-    })
-    .catch((err) => {
-      console.log(err);
-    });
-    axios.get(`http://localhost:8080/friendship/status/${target?.id}/${user?.id}`)
-    .then((res) => {
-      if (res.data?.status === "PENDING" && res.data?.request !== "RECIVED")
-        setRecv(res.data?.status);
-      else if (res.data?.status === "ACCEPTED")
-        setRecv(res.data?.status);
-      else if (res.data?.status === "BLOCKED" && res.data?.request !== "RECIVED")
-        setRecv(res.data?.status);
-      else setRecv("");
-    })
-    .catch((err) => {
-      console.log(err);
-    });
-  } , [target?.id, user?.id, is]);
+    axios
+      .get(`http://localhost:8080/friendship/status/${user?.id}/${target?.id}`)
+      .then((res) => {
+        if (res.data?.status === "PENDING" && res.data?.request === "SEND")
+          setStatus(res.data?.status);
+        else if (res.data?.status === "ACCEPTED") setStatus(res.data?.status);
+        else if (res.data?.status === "BLOCKED" && res.data?.request === "SEND")
+          setStatus(res.data?.status);
+        else setStatus("");
+      })
+      .catch((err) => {
+        console.log(err);
+      });
+    axios
+      .get(`http://localhost:8080/friendship/status/${target?.id}/${user?.id}`)
+      .then((res) => {
+        if (res.data?.status === "PENDING" && res.data?.request !== "RECIVED")
+          setRecv(res.data?.status);
+        else if (res.data?.status === "ACCEPTED") setRecv(res.data?.status);
+        else if (
+          res.data?.status === "BLOCKED" &&
+          res.data?.request !== "RECIVED"
+        )
+          setRecv(res.data?.status);
+        else setRecv("");
+      })
+      .catch((err) => {
+        console.log(err);
+      });
+  }, [target?.id, user?.id, is]);
 
   const handleSender = () => {
-    switch(status) {
-      case "PENDING":
-      {
-        socket.emit('cancelFriendRequest', {
+    switch (status) {
+      case "PENDING": {
+        socket.emit("cancelFriendRequest", {
           senderId: user?.id,
-          reciverId : target?.id,
+          reciverId: target?.id,
         });
         break;
       }
-      case "ACCEPTED":
-      {
-        socket.emit('removeFriend', {
+      case "ACCEPTED": {
+        socket.emit("removeFriend", {
           senderId: user?.id,
-          reciverId : target?.id,
-          is : true
+          reciverId: target?.id,
+          is: true,
         });
         break;
       }
-      default:
-      {
-        socket.emit('friendRequest', {
+      default: {
+        socket.emit("friendRequest", {
           senderId: user?.id,
-          reciverId : target?.id,
+          reciverId: target?.id,
         });
       }
     }
-  }
+  };
 
-  const friendReq = (str : string) => {
+  const friendReq = (str: string) => {
     socket?.emit(str, {
       senderId: target?.id,
-      reciverId : user?.id,
+      reciverId: user?.id,
     });
-  }
-  const blockUser = (str : string) => {
+  };
+  const blockUser = (str: string) => {
     socket.emit(str, {
       senderId: user?.id,
-      reciverId : target?.id,
+      reciverId: target?.id,
     });
-  }
+  };
   const removeFriend = () => {
-    socket?.emit('removeFriend', {
+    socket?.emit("removeFriend", {
       senderId: target?.id,
-      reciverId : user?.id,
-      is : false
+      reciverId: user?.id,
+      is: false,
     });
-  }
-
+  };
 
   return (
-    <div
-      className=" p-4 bg-[#101823] rounded-md "
-    >
+    <div className=" p-4 bg-primaryColor rounded-md ">
       <div className=" w-full h-full relative flex flex-col 2xl:gap-[80px] gap-12 rounded-md">
         <div className="w-full  h-[290px] relative">
           <PinContainer title="Overview" href="https://twitter.com/mannupaaji">
             <div className="overflow-hidden h-[290px] w-full">
-              {
-                target ? (
-                  <Image
-                    src={target?.banner_picture ? target?.banner_picture : "/car1.jpg"}
-                    fill
-                    priority
-                    style={{ objectFit: "cover" }}
-                    alt="bg"
-                    sizes="auto"
-                    className="z-[-1] rounded-2xl"
-                  />
-                ) : (
-                  <div className="flex items-center justify-center w-full h-full bg-gray-400 rounded  animate-pulse">
-                      <svg className="w-10 h-10 text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
-                          <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
-                      </svg>
-                  </div>
-                )
-              }
+              {target ? (
+                <Image
+                  src={
+                    target?.banner_picture
+                      ? target?.banner_picture
+                      : "/car1.jpg"
+                  }
+                  fill
+                  priority
+                  style={{ objectFit: "cover" }}
+                  alt="bg"
+                  sizes="auto"
+                  className="z-[-1] rounded-2xl"
+                />
+              ) : (
+                <div className="flex items-center justify-center w-full h-full bg-gray-400 rounded  animate-pulse">
+                  <svg
+                    className="w-10 h-10 text-gray-300"
+                    aria-hidden="true"
+                    xmlns="http://www.w3.org/2000/svg"
+                    fill="currentColor"
+                    viewBox="0 0 20 18"
+                  >
+                    <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
+                  </svg>
+                </div>
+              )}
             </div>
           </PinContainer>
-          <div className="absolute top-0 right-0 p-4 z-10 mt-9 mr-2"> 
-            <Dropdown handleBlock={() => blockUser("blockFriend")} handleUnblock={() => blockUser("unblockFriend")} status={status} recv={recv} />
+          <div className="absolute top-0 right-0 p-4 z-10 mt-9 mr-2">
+            <Dropdown
+              handleBlock={() => blockUser("blockFriend")}
+              handleUnblock={() => blockUser("unblockFriend")}
+              status={status}
+              recv={recv}
+            />
           </div>
-          <div
-            className="2xl:w-[170px]  xl:w-[120px] xl:h-[200px] absolute 2xl:h-[250px]  bg-[#101823] rounded-md 2xl:-bottom-[120px] 2xl:left-[100px] p-2 text-white sm:bottom-[10px] sm:left-[50px] sm:w-[110px] sm:h-[170px] bottom-[10px] left-[20px] w-[80px] h-[150px]"
-          >
-            <div className="w-full h-full flex flex-col items-center bg-[#101823] rounded-md gap-4">
+          <div className="2xl:w-[170px]  xl:w-[120px] xl:h-[200px] absolute 2xl:h-[250px]  bg-primaryColor rounded-md 2xl:-bottom-[120px] 2xl:left-[100px] p-2 text-white sm:bottom-[10px] sm:left-[50px] sm:w-[110px] sm:h-[170px] bottom-[10px] left-[20px] w-[80px] h-[150px]">
+            <div className="w-full h-full flex flex-col items-center bg-primaryColor rounded-md gap-4">
               <div className="w-full h-[60%]   relative">
                 {target ? (
                   <Image
@@ -217,14 +222,19 @@ const UserProfile = ({target} : any) => {
                   />
                 ) : (
                   <div className="flex items-center justify-center w-full h-full bg-gray-400 rounded  animate-pulse">
-                      <svg className="w-10 h-10 text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
-                          <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
-                      </svg>
+                    <svg
+                      className="w-10 h-10 text-gray-300"
+                      aria-hidden="true"
+                      xmlns="http://www.w3.org/2000/svg"
+                      fill="currentColor"
+                      viewBox="0 0 20 18"
+                    >
+                      <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
+                    </svg>
                   </div>
                 )}
               </div>
-              {
-                target ? (
+              {target ? (
                 <div className="flex flex-col items-center">
                   <h2 className="mt-2 xl:text-[15px] text-[10px] text-center">
                     {target?.name}
@@ -234,22 +244,21 @@ const UserProfile = ({target} : any) => {
                   </span>
                   <span className="xl:text-[10px] text-[7px]">400,000</span>
                 </div>
-                ) :(
-                <div  className="w-[80%] animate-pulse">
-                    <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-full mb-4"></div>
-                    <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 w-full mb-2.5"></div>
-                    <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 mb-2.5"></div>
+              ) : (
+                <div className="w-[80%] animate-pulse">
+                  <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-full mb-4"></div>
+                  <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 w-full mb-2.5"></div>
+                  <div className="h-2 bg-gray-300 rounded-full dark:bg-gray-700 mb-2.5"></div>
                 </div>
-                )
-              }
+              )}
             </div>
           </div>
         </div>
 
         <div className="w-full   border-red-500 pb-5  flex sm:flex-row flex-col sm:flex-wrap 2xl:mt-0 mt-2 justify-between sm:gap-2 gap-5">
           <div className="2xl:w-[35%] sm:w-[55%]  border-yellow-500 flex sm:h-[250px]">
-            <div className="w-full  border-green-500  2xl:self-end 2xl:h-[55%] lg:h-[100%] items-center bg-[#101823]  flex justify-between rounded-md 2xl:flex-row">
-              <div className="flex   sm:w-full items-center  sm:h-[40%] h-full 2xl:h-full w-full bg-[#172234] rounded-md">
+            <div className="w-full  border-green-500  2xl:self-end 2xl:h-[55%] lg:h-[100%] items-center bg-primaryColor  flex justify-between rounded-md 2xl:flex-row">
+              <div className="flex   sm:w-full items-center  sm:h-[40%] h-full 2xl:h-full w-full bg-secondaryColor rounded-md">
                 <div className="relative">
                   <Image
                     src={"/badge1.png"}
@@ -270,7 +279,7 @@ const UserProfile = ({target} : any) => {
                   </div>
                   <div className="sm:w-[95%] w-[91%] 2xl:w-[98%] b bg-[#D6D6D6] rounded-full">
                     <motion.div
-                      className="bg-[#FF4654] p-2 sm:h-2.5 h-2 rounded-full relative w-[45%]"
+                      className="bg-mainRedColor p-2 sm:h-2.5 h-2 rounded-full relative w-[45%]"
                       initial={{ width: "0%" }}
                       animate={{ width: "45%" }}
                       transition={{ duration: 1 }}
@@ -288,19 +297,30 @@ const UserProfile = ({target} : any) => {
             </div>
           </div>
 
-           <Userstatus target={target} status={status} recv={recv} handleSender={handleSender} friendReq={friendReq} removeFriend={removeFriend} />
-          <div className={`2xl:w-[30%] p-5 text-white ${rajdhani.className} bg-[#172234] sm:w-[42%]  rounded-lg h-[250px] flex flex-col gap-4`}>
+          <Userstatus
+            target={target}
+            status={status}
+            recv={recv}
+            handleSender={handleSender}
+            friendReq={friendReq}
+            removeFriend={removeFriend}
+          />
+          <div
+            className={cn(
+              "2xl:w-[30%] p-5 text-white bg-secondaryColor sm:w-[42%]  rounded-lg h-[250px] flex flex-col gap-4",
+              rajdhani.className
+            )}
+          >
             <h1 className="2xl:text-3xl xl:text-2xl text-xl font-[600]">
               Linked Friends
             </h1>
             <div className="flex flex-col gap-1 overflow-y-auto">
-              {
-                linkedFriends && linkedFriends?.map((user, i) => {
+              {linkedFriends &&
+                linkedFriends?.map((user, i) => {
                   return (
                     <LinkedFriend user={user} key={user.id} index={i + 1} />
                   );
-                })
-              }
+                })}
             </div>
           </div>
         </div>
diff --git a/app/components/Dashboard/Profile/Userstatus.tsx b/app/components/Dashboard/Profile/Userstatus.tsx
index 8be7255..30360d8 100644
--- a/app/components/Dashboard/Profile/Userstatus.tsx
+++ b/app/components/Dashboard/Profile/Userstatus.tsx
@@ -1,109 +1,135 @@
-import React from 'react'
-import { Button } from "@/components/ui/moving-border"
-import Image from 'next/image'
-import { AnimatedTooltip } from '@/components/ui/animated-tooltip'
-import { getDate } from '@/app/utils'
-import { Rajdhani } from "next/font/google";
-import { Inter } from "next/font/google";
-
-const inter = Inter({ subsets: ["latin"] });
-const rajdhani = Rajdhani({ subsets: ["latin"], weight: ["400", "500"] });
-
-
-const Userstatus = ({target, status, recv, friendReq, removeFriend, handleSender} : any) => {
+import React from "react";
+import { Button } from "@/components/ui/moving-border";
+import Image from "next/image";
+import { getDate } from "@/app/utils";
+import { inter, rajdhani } from "@/app/utils/fontConfig";
+import { cn } from "@/components/cn";
 
+const Userstatus = ({
+  target,
+  status,
+  recv,
+  friendReq,
+  removeFriend,
+  handleSender,
+}: any) => {
   return (
-    <div className={`2xl:w-[30%] sm:w-[40%]  border-orange-500 ${rajdhani.className} bg-[#172234]  py-2 flex  h-[250px]  px-2 rounded-md`}>
+    <div
+      className={cn(
+        "2xl:w-[30%] sm:w-[40%]  border-orange-500 bg-secondaryColor  py-2 flex  h-[250px]  px-2 rounded-md",
+        rajdhani.className
+      )}
+    >
       <div className="flex flex-col w-full h-full relative justify-around gap-2  ">
-              <div className="flex justify-around items-center">
-                <div
-                  className={` ${inter.className} flex flex-col text-white gap-1 relative`}
-                >
-                  <div className="flex items-center">
-                    <span className="relative flex h-3 w-3 mr-2">
-                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${ target?.status === "ONLINE" ? "bg-green-500" : "bg-gray-500" } opacity-75`}></span>
-                      <span className={`relative inline-flex rounded-full h-3 w-3 ${ target?.status === "ONLINE" ? "bg-green-500" : "bg-gray-500" }`}></span>
-                    </span>
-                    <span className={`2xl:text-xs xl:text-[12px] sm:text-[11px] text-[13px] ${ target?.status === "ONLINE" ? "text-green-500" : "text-gray-500" }`}>
-                      { target?.status === "ONLINE" ? "online" : "offline" }
-                    </span>
-                  </div>
-                  <span className="text-buttonGray 2xl:text-[15px] xl:text-[8px] sm:text-[8px] text-[13px]">
-                    {getDate(target?.createdAt)}
-                  </span>
-                  <span className="text-buttonGray 2xl:text-[13px] xl:text-[12px] sm:text-[10px] text-[13px]">
-                    public channels
-                  </span>
-                  <div className="flex gap-2">
-                    <Image
-                      src={"/group.svg"}
-                      width={25}
-                      height={25}
-                      alt="group"
-                    />
-                    <Image
-                      src={"/group.svg"}
-                      width={25}
-                      height={25}
-                      alt="group"
-                    />
-                  </div>
-                </div>
-                <Image
-                  src={"/badge2.png"}
-                  width={170}
-                  height={170}
-                  alt="badge"
-                  className="2xl:w-[180px] sm:-right-[20px] right-[0px] bottom-[25px] sm:bottom-[45px] xl:w-[120px]  2xl:right-[10px] 2xl:bottom-[100px] xl:-right-[15px] xl:bottom-[95px] lg:w-[95px]"
-                />
-              </div> 
-              {
-                recv && recv === "PENDING" ?
-                  <div className="flex flex-row gap-4">
-                    <Button
-                      onClick={() => friendReq("acceptFriendRequest")}
-                      borderRadius="10px"
-                      borderClassName=" bg-[radial-gradient(var(--green-500)_40%,transparent_60%)]"
-                      className={`text-white border-slate-800 w-full sm:mt-0 mt-4 bg-green-500/[0.5]`}
-                    >
-                      ACCEPTE
-                    </Button>
-                    <Button
-                      onClick={() => friendReq("rejectFriendRequest")}
-                      borderRadius="10px"
-                      borderClassName=" bg-[radial-gradient(var(--red-500)_40%,transparent_60%)]"
-                      className={`text-white border-slate-800 w-full sm:mt-0 mt-4  bg-[#FF4654]/[0.6]`}
-                    >
-                      REJECTE
-                    </Button>
-                  </div>
-                  : recv && recv === "ACCEPTED" ?
-                  <Button
-                    onClick={removeFriend}
-                    borderRadius="10px"
-                    borderClassName="bg-[radial-gradient(var(--red-500)_40%,transparent_60%)]"
-                    className={`text-white border-slate-800 w-full sm:mt-0 mt-4  bg-[#FF4654]/[0.6]`}
-                  >
-                    REMOVE FRIEND
-                  </Button>
-                  : recv && recv === "BLOCKED" ? null
-                  : status && status === "BLOCKED" ? null
-                  : <Button
-                    onClick={handleSender}
-                    borderRadius="10px"
-                    borderClassName={status === "ACCEPTED" ? "bg-[radial-gradient(var(--red-500)_40%,transparent_60%)]" : ""}
-                    className={`text-white border-slate-800 w-full sm:mt-0 mt-4  ${status === "PENDING" ? "bg-slate-600" : status === "ACCEPTED"  ? "bg-red-600/[0.3]"  : ""}`}
-                  >
-                    {
-                      status && status === "PENDING" ? "PENDING"
-                      : status && status === "ACCEPTED" ? "REMOVE FRIEND"
-                      : "ADD FRIEND"
-                    }
-                  </Button>
-              }
+        <div className="flex justify-around items-center">
+          <div
+            className={` ${inter.className} flex flex-col text-white gap-1 relative`}
+          >
+            <div className="flex items-center">
+              <span className="relative flex h-3 w-3 mr-2">
+                <span
+                  className={cn(
+                    "animate-ping absolute inline-flex h-full w-full rounded-full",
+                    target?.status === "ONLINE"
+                      ? "bg-green-500"
+                      : "bg-gray-500",
+                    "opacity-75"
+                  )}
+                ></span>
+                <span
+                  className={cn(
+                    "relative inline-flex rounded-full h-3 w-3",
+                    target?.status === "ONLINE" ? "bg-green-500" : "bg-gray-500"
+                  )}
+                ></span>
+              </span>
+              <span
+                className={cn(
+                  "2xl:text-xs xl:text-[12px] sm:text-[11px] text-[13px]",
+                  target?.status === "ONLINE"
+                    ? "text-green-500"
+                    : "text-gray-500"
+                )}
+              >
+                {target?.status === "ONLINE" ? "online" : "offline"}
+              </span>
+            </div>
+            <span className="text-buttonGray 2xl:text-[15px] xl:text-[8px] sm:text-[8px] text-[13px]">
+              {getDate(target?.createdAt)}
+            </span>
+            <span className="text-buttonGray 2xl:text-[13px] xl:text-[12px] sm:text-[10px] text-[13px]">
+              public channels
+            </span>
+            <div className="flex gap-2">
+              <Image src={"/group.svg"} width={25} height={25} alt="group" />
+              <Image src={"/group.svg"} width={25} height={25} alt="group" />
+            </div>
+          </div>
+          <Image
+            src={"/badge2.png"}
+            width={170}
+            height={170}
+            alt="badge"
+            className="2xl:w-[180px] sm:-right-[20px] right-[0px] bottom-[25px] sm:bottom-[45px] xl:w-[120px]  2xl:right-[10px] 2xl:bottom-[100px] xl:-right-[15px] xl:bottom-[95px] lg:w-[95px]"
+          />
+        </div>
+        {recv && recv === "PENDING" ? (
+          <div className="flex flex-row gap-4">
+            <Button
+              onClick={() => friendReq("acceptFriendRequest")}
+              borderRadius="10px"
+              borderClassName=" bg-[radial-gradient(var(--green-500)_40%,transparent_60%)]"
+              className={`text-white border-slate-800 w-full sm:mt-0 mt-4 bg-green-500/[0.5]`}
+            >
+              ACCEPTE
+            </Button>
+            <Button
+              onClick={() => friendReq("rejectFriendRequest")}
+              borderRadius="10px"
+              borderClassName=" bg-[radial-gradient(var(--red-500)_40%,transparent_60%)]"
+              className={`text-white border-slate-800 w-full sm:mt-0 mt-4  bg-mainRedColor/[0.6]`}
+            >
+              REJECTE
+            </Button>
+          </div>
+        ) : recv && recv === "ACCEPTED" ? (
+          <Button
+            onClick={removeFriend}
+            borderRadius="10px"
+            borderClassName="bg-[radial-gradient(var(--red-500)_40%,transparent_60%)]"
+            className={`text-white border-slate-800 w-full sm:mt-0 mt-4  bg-mainRedColor/[0.6]`}
+          >
+            REMOVE FRIEND
+          </Button>
+        ) : recv && recv === "BLOCKED" ? null : status &&
+          status === "BLOCKED" ? null : (
+          <Button
+            onClick={handleSender}
+            borderRadius="10px"
+            borderClassName={
+              status === "ACCEPTED"
+                ? "bg-[radial-gradient(var(--red-500)_40%,transparent_60%)]"
+                : ""
+            }
+            className={cn(
+              "text-white border-slate-800 w-full sm:mt-0 mt-4",
+              status === "PENDING"
+                ? "bg-slate-600"
+                : status === "ACCEPTED"
+                ? "bg-red-600/[0.3]"
+                : ""
+            )}
+          >
+            {status && status === "PENDING"
+              ? "PENDING"
+              : status && status === "ACCEPTED"
+              ? "REMOVE FRIEND"
+              : "ADD FRIEND"}
+          </Button>
+        )}
       </div>
     </div>
-  )
-}
+  );
+};
 
-export default Userstatus
\ No newline at end of file
+export default Userstatus;
diff --git a/app/components/Dashboard/Search/UserCard.tsx b/app/components/Dashboard/Search/UserCard.tsx
index e1e8a1a..e8abd6f 100644
--- a/app/components/Dashboard/Search/UserCard.tsx
+++ b/app/components/Dashboard/Search/UserCard.tsx
@@ -1,25 +1,29 @@
-'use cient';
-import React from 'react'
-import { useRouter } from 'next/navigation';
-import { CardBody, CardContainer, CardItem } from '../../../../components/ui/3d-card';
-import Image from 'next/image';
+"use cient";
+import React from "react";
+import { useRouter } from "next/navigation";
+import {
+  CardBody,
+  CardContainer,
+  CardItem,
+} from "../../../../components/ui/3d-card";
+import Image from "next/image";
 
 interface Props {
-    user: any
+  user: any;
 }
 
-const UserCard = ({user}: Props) => {
+const UserCard = ({ user }: Props) => {
   const router = useRouter();
   const handleClick = () => {
-    router.push(`/Dashboard/Profile?id=${user.id}`); 
-  }
+    router.push(`/Dashboard/Profile?id=${user.id}`);
+  };
   return (
-    <div onClick={handleClick} className='cursor-pointer'>
+    <div onClick={handleClick} className="cursor-pointer">
       <CardContainer className="inter-var">
-        <CardBody className="relative group/card  hover:shadow-2xl hover:shadow-[#FF5866]/[0.1] bg-black border-[#FF4656]/[0.8] w-auto h-auto rounded-xl p-6 border">
+        <CardBody className="relative group/card  hover:shadow-2xl hover:shadow-sidebarRedColor/[0.1] bg-black border-[#FF4656]/[0.8] w-auto h-auto rounded-xl p-6 border">
           <CardItem translateZ="100" className="w-full mt-4">
             <Image
-              src={user.picture ? user.picture :"/friend.png"}
+              src={user.picture ? user.picture : "/friend.png"}
               height="1000"
               width="1000"
               className="h-60 w-60 object-cover rounded-xl group-hover/card:shadow-xl"
@@ -37,7 +41,7 @@ const UserCard = ({user}: Props) => {
             <CardItem
               translateZ={20}
               as="div"
-              className="px-4 py-2 rounded-xl bg-[#34202A] text-[#FF5866] text-xs font-bold"
+              className="px-4 py-2 rounded-xl bg-[#34202A] text-sidebarRedColor text-xs font-bold"
             >
               @{user?.username}
             </CardItem>
@@ -45,7 +49,7 @@ const UserCard = ({user}: Props) => {
         </CardBody>
       </CardContainer>
     </div>
-    )
-  }
-  
-  export default UserCard
\ No newline at end of file
+  );
+};
+
+export default UserCard;
diff --git a/app/components/Dashboard/Settings/Helder.tsx b/app/components/Dashboard/Settings/Helder.tsx
index 99e3274..0b0d9f1 100644
--- a/app/components/Dashboard/Settings/Helder.tsx
+++ b/app/components/Dashboard/Settings/Helder.tsx
@@ -1,10 +1,8 @@
 'use client';
-import React, { useState } from 'react'
-import Sidebar from './Sidebar'
-import EditProfile from './EditProfile'
-import Security from './Security'
 import { Tabs } from "@/components/ui/tabs";
-import Image from 'next/image';
+import { useState } from 'react';
+import EditProfile from './EditProfile';
+import Security from './Security';
 
 const Helder = () => {
   const [current, setCurrent] = useState('My profile');
@@ -13,7 +11,6 @@ const Helder = () => {
       title: "My profile",
       value: "My profile",
       content: (
-        // <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 bg-gradient-to-br from-blurredRed to-[#753b3b]">
         <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 bg-black">
           <EditProfile />
         </div>
diff --git a/app/components/Dashboard/Shop/Cards/BigCard.tsx b/app/components/Dashboard/Shop/Cards/BigCard.tsx
index 0847f36..a5a1283 100644
--- a/app/components/Dashboard/Shop/Cards/BigCard.tsx
+++ b/app/components/Dashboard/Shop/Cards/BigCard.tsx
@@ -1,26 +1,19 @@
 /* eslint-disable @next/next/no-img-element */
-'use client'
+"use client";
 import React, { useEffect } from "react";
-import { Inter } from "next/font/google";
+import { inter } from "@/app/utils/fontConfig";
 import Image from "next/image";
 import Coin from "../Stuff/Coin";
 import { motion } from "framer-motion";
-const inter = Inter({
-  subsets: ["latin"],
-  weight: ["400", "500", "600", "700"],
-});
+import { cn } from "@/components/cn";
+import { Infos } from "../types";
 
-interface Infos {
-  title: string;
-  image: string;
-  description: string;
-}
 interface BigCardProps {
   infos: Infos;
   selected: string;
   handleClick: (infos: Infos) => void;
 }
-const BigCard = ({ infos, handleClick, selected}: BigCardProps) => {
+const BigCard = ({ infos, handleClick, selected }: BigCardProps) => {
   const handleCardClick = () => {
     setHover(true);
     handleClick(infos);
@@ -28,7 +21,7 @@ const BigCard = ({ infos, handleClick, selected}: BigCardProps) => {
   const [hover, setHover] = React.useState(false);
   useEffect(() => {
     console.log(selected);
-  },[]);
+  }, []);
   const imageUrls = {
     first: `/${selected}/first.png`,
     second: `/${selected}/second.png`,
@@ -36,7 +29,10 @@ const BigCard = ({ infos, handleClick, selected}: BigCardProps) => {
   };
   return (
     <div
-      className={`w-[100%] h-[375px]  relative text-white ${inter.className} cursor-pointer rounded-lg `}
+      className={cn(
+        "w-[100%] h-[375px]  relative text-white cursor-pointer rounded-lg",
+        inter.className
+      )}
       onMouseOver={() => setHover(true)}
       onMouseOut={() => setHover(false)}
     >
@@ -56,9 +52,9 @@ const BigCard = ({ infos, handleClick, selected}: BigCardProps) => {
         onClick={handleCardClick}
       />
       <motion.div
-      initial={{opacity: 0}}
-        animate={{opacity: hover ? 1 : 0}}
-        transition={{duration: 0.4}}
+        initial={{ opacity: 0 }}
+        animate={{ opacity: hover ? 1 : 0 }}
+        transition={{ duration: 0.4 }}
       >
         <div className="absolute w-[70%] left-4 top-4">
           <h1 className="xl:text-[22px] text-[18px] font-[500]">
diff --git a/app/components/Dashboard/Shop/Elements.tsx b/app/components/Dashboard/Shop/Elements.tsx
index b709c60..07fcfa6 100644
--- a/app/components/Dashboard/Shop/Elements.tsx
+++ b/app/components/Dashboard/Shop/Elements.tsx
@@ -1,12 +1,11 @@
 "use client";
-import { useEffect, useState } from "react";
-import React from "react";
+import { AnimatePresence } from "framer-motion";
+import React, { useState } from "react";
 import BigCard from "./Cards/BigCard";
 import SmallCard from "./Cards/SmallCard";
-import Modlar from "./Stuff/Modlar";
-import { motion, AnimatePresence } from "framer-motion";
 import Header from "./Header";
-
+import Modlar from "./Stuff/Modlar";
+import { Infos } from "./types";
 import cardsData from "./CardData";
 const infos = [
   {
@@ -28,11 +27,7 @@ const infos = [
     image: "third",
   },
 ];
-interface Infos {
-  title: string;
-  image: string;
-  description: string;
-}
+
 const Elements = () => {
   const handleClick = (e: any | null) => {
     console.log(e);
diff --git a/app/components/Dashboard/Shop/Header.tsx b/app/components/Dashboard/Shop/Header.tsx
index 2ae08a2..608ab89 100644
--- a/app/components/Dashboard/Shop/Header.tsx
+++ b/app/components/Dashboard/Shop/Header.tsx
@@ -1,32 +1,25 @@
 "use client";
 import React, { useState } from "react";
 import { motion } from "framer-motion";
-import { Rajdhani } from "next/font/google";
-import { Checkbox } from "@/components/ui/checkbox"
+import { rajdhani } from "@/app/utils/fontConfig";
+import { cn } from "@/components/cn";
 const menuItems = ["Paddle", "Ball", "Table", "Map"];
-const rajdhani = Rajdhani({
-  subsets: ["latin"],
-  weight: ["400", "500", "600", "700"],
-});
 const Header = ({ onSelect }: { onSelect: (e: string) => void }) => {
   const [selected, setSelected] = useState<number>(0);
-
   const handleItemClick = (index: number) => {
     setSelected(index);
     onSelect(menuItems[index]);
   };
 
   return (
-    <div className="flex justify-between  bg-transparent rounded-lg"
-    style={{
-      backdropFilter: "blur(7px)",
-      backgroundColor: "rgba(13, 9, 10, 0.7)",
-    }}
-    
+    <div
+      className="flex justify-between  bg-transparent rounded-lg"
+      style={{
+        backdropFilter: "blur(7px)",
+        backgroundColor: "rgba(13, 9, 10, 0.7)",
+      }}
     >
-      <div
-        className="h-[61px] cursor-pointer pl-2 rounded-lg  grid place-items-start items-center  text-white"
-      >
+      <div className="h-[61px] cursor-pointer pl-2 rounded-lg  grid place-items-start items-center  text-white">
         <div className="flex justify-evenly">
           {menuItems.map((el, i) => (
             <MenuItem
@@ -38,10 +31,17 @@ const Header = ({ onSelect }: { onSelect: (e: string) => void }) => {
           ))}
         </div>
       </div>
-      <div className={`mr-[17px] gap-4 flex items-center text-white ${rajdhani.className}`}>
-        {/* <div className="rounded-md bg-gray-400 w-[20px] h-[20px]"></div> */}
-        <input type="checkbox" className="bg-gray-400 border-none w-7 h-7 rounded-lg text-rightArrowColor cursor-pointer accent-red-500 focus:outline-none focus:ring-transparent" value={""}/>
-        {/* <Checkbox /> */}
+      <div
+        className={cn(
+          `mr-[17px] gap-4 flex items-center text-white`,
+          rajdhani.className
+        )}
+      >
+        <input
+          type="checkbox"
+          className="bg-gray-400 border-none w-7 h-7 rounded-lg text-rightArrowColor cursor-pointer accent-red-500 focus:outline-none focus:ring-transparent"
+          value={""}
+        />
         <span>Owned</span>
       </div>
     </div>
diff --git a/app/components/Dashboard/Shop/Shop.tsx b/app/components/Dashboard/Shop/Shop.tsx
index c254957..a568d0d 100644
--- a/app/components/Dashboard/Shop/Shop.tsx
+++ b/app/components/Dashboard/Shop/Shop.tsx
@@ -1,5 +1,4 @@
 import React from 'react'
-import Header from './Header'
 import Elements from './Elements'
 
 const Shop = () => {
diff --git a/app/components/Dashboard/Shop/Stuff/Coin.tsx b/app/components/Dashboard/Shop/Stuff/Coin.tsx
index ef0335b..b47fd82 100644
--- a/app/components/Dashboard/Shop/Stuff/Coin.tsx
+++ b/app/components/Dashboard/Shop/Stuff/Coin.tsx
@@ -1,12 +1,9 @@
 import React from "react";
 import { AnimatePresence, motion } from "framer-motion";
 import Image from "next/image";
-import { Inter } from "next/font/google";
+import { inter } from "@/app/utils/fontConfig";
+import { cn } from "@/components/cn";
 
-const inter = Inter({
-  subsets: ["latin"],
-  weight: ["400", "500", "600", "700"],
-});
 const Coin = ({ size }: { size: string }) => {
   const [hover, setHover] = React.useState(false);
   const [owned, setOwned] = React.useState(false);
@@ -24,46 +21,62 @@ const Coin = ({ size }: { size: string }) => {
 
   return (
     <motion.div
-      className={`${
-        size === "small"&& !owned ? "w-[88px] h-[40px]" : "w-[120px] h-[50px] cursor-pointer"
-      } rounded-md  bg-shopButton relative ${inter.className}`}
+      className={cn(
+        "rounded-md bg-shopButton relative cursor-pointer",
+        inter.className,
+        size === "small" && !owned ? "w-[88px] h-[40px]" : "w-[120px] h-[50px]"
+      )}
       onMouseOver={() => setHover(true)}
       onMouseOut={() => setHover(false)}
       onClick={handleClick}
-      // animate={{ width: size === "small" && !owned ? 88 : 120 }}
     >
       <AnimatePresence>
         <motion.span
-          className={`text-[20px] absolute ${size === 'big' || owned ? 'left-8 top-[9px]': 'left-5 top-[5px]'}`}
+          className={cn(
+            "text-[20px] absolute",
+            size === "big" || owned ? "left-8 top-[9px]" : "left-5 top-[5px]"
+          )}
           key={owned ? "owned" : "not-owned"}
           initial={{ opacity: 1, x: 0 }}
           animate={{
             opacity: hover ? 0 : 1,
-            x: hover ? 2 : owned && !equipped ? -12 : equipped ? -20 :  0,
+            x: hover ? 2 : owned && !equipped ? -12 : equipped ? -20 : 0,
           }}
           exit={{ opacity: 0 }}
         >
           {owned ? (equipped ? "EQUIPPED" : "OWNED") : "512"}
         </motion.span>
         <motion.span
-          className={`text-[20px] absolute ${size === 'big' || owned ? 'left-8 top-[9px]': 'left-5 top-[5px]'}`}
+          className={cn(
+            "text-[20px] absolute",
+            size === "big" || owned ? "left-8 top-[9px]" : "left-5 top-[5px]"
+          )}
           key={equipped ? "equipped" : "not-equipped"}
           initial={{ opacity: 0, x: -10 }}
           animate={{
             opacity: hover ? 1 : 0,
-            x: hover ? owned && !equipped ? 0 : equipped ? -14 :  5 :  0,
+            x: hover ? (owned && !equipped ? 0 : equipped ? -14 : 5) : 0,
           }}
           exit={{ opacity: 0 }}
         >
           {owned ? (equipped ? "UNEQUIP" : "EQUIP") : "BUY"}
         </motion.span>
         <motion.div
-          className={`absolute ${size === 'big' ? 'right-8 top-[14px]': 'right-4 top-[11px]'}`}
+          className={cn(
+            "absolute",
+            size === "big" ? "right-8 top-[14px]" : "right-4 top-[11px]"
+          )}
           animate={{
             opacity: hover || owned ? 0 : 1,
           }}
         >
-          <Image src={"/ShopVec.svg"} width={16} height={16} alt="coin image" className="h-auto w-auto" />
+          <Image
+            src={"/ShopVec.svg"}
+            width={16}
+            height={16}
+            alt="coin image"
+            className="h-auto w-auto"
+          />
         </motion.div>
       </AnimatePresence>
     </motion.div>
diff --git a/app/components/Dashboard/Shop/Stuff/Modlar.tsx b/app/components/Dashboard/Shop/Stuff/Modlar.tsx
index f73afc3..2d41f33 100644
--- a/app/components/Dashboard/Shop/Stuff/Modlar.tsx
+++ b/app/components/Dashboard/Shop/Stuff/Modlar.tsx
@@ -3,20 +3,12 @@ import React from "react";
 import { motion } from "framer-motion";
 import Image from "next/image";
 import { AiOutlineClose } from "react-icons/ai";
-
-import { Rajdhani } from "next/font/google";
+import { Infos } from "../types";
+import { rajdhani } from "@/app/utils/fontConfig";
 import Coin from "./Coin";
+import { cn } from "@/components/cn";
 
-const rajdhani = Rajdhani({
-  subsets: ["latin"],
-  weight: ["400", "500", "600", "700"],
-});
 
-interface Infos {
-  title: string;
-  image: string;
-  description: string;
-}
 
 const Modlar = ({
   infos,
@@ -33,9 +25,7 @@ const Modlar = ({
     third: `/${selected}/third.png`,
   };
   return (
-    <motion.div
-      className="fixed inset-0 sm:flex hidden items-center justify-center bg-black bg-opacity-50 z-50"
-      >
+    <motion.div className="fixed inset-0 sm:flex hidden items-center justify-center bg-black bg-opacity-50 z-50">
       <motion.div
         className="bg-black rounded-lg flex justify-center p-[50px] text-white gap-8  relative"
         initial={{ opacity: 0, scale: 0.75 }}
@@ -55,7 +45,6 @@ const Modlar = ({
             duration: 0.15,
           },
         }}
-        // style={{ minWidth: 0, maxWidth: "80vw", maxHeight: "80vh" }}
       >
         <div className="relative">
           <Image
@@ -72,10 +61,11 @@ const Modlar = ({
             height={0}
             priority
             className="object-cover object-center 2xl:w-[750px] 2xl:h-[750px] lg:w-[450px] lg:h-[450px] w-[250px] h-[250px]"
-            // sizes="(max-width: 100px) 100vw, 33vw"
           />
         </div>
-        <div className={`flex flex-col ${rajdhani.className}  justify-between`}>
+        <div
+          className={cn("flex flex-col justify-between", rajdhani.className)}
+        >
           <div>
             <h1 className="xl:text-[31px] text-[18px] font-[600]">
               {infos.title}
diff --git a/app/components/Dashboard/Shop/types.ts b/app/components/Dashboard/Shop/types.ts
new file mode 100644
index 0000000..2bc67ff
--- /dev/null
+++ b/app/components/Dashboard/Shop/types.ts
@@ -0,0 +1,5 @@
+export interface Infos {
+    title: string;
+    image: string;
+    description: string;
+}
\ No newline at end of file
diff --git a/app/components/Dashboard/Sidebar/MainOptions.tsx b/app/components/Dashboard/Sidebar/MainOptions.tsx
index 9de2e86..43c7869 100644
--- a/app/components/Dashboard/Sidebar/MainOptions.tsx
+++ b/app/components/Dashboard/Sidebar/MainOptions.tsx
@@ -1,5 +1,5 @@
+import { cn } from "@/components/cn";
 import { motion } from "framer-motion";
-import { Oswald } from "next/font/google";
 import React, { ReactNode } from "react";
 import { FaChevronDown } from "react-icons/fa";
 const MainOptions = ({
@@ -15,22 +15,24 @@ const MainOptions = ({
 }) => {
   return (
     <motion.div
-      className={`group p-3 ${
-        label === "Dashboard" ? "mt-2" : "mt-5"
-      } text-sm relative z-10 rounded-lg text-[#707b8f]  transition-colors duration-300 cursor-pointer hover:bg-[#221D29] ${
-        showElements && "bg-[#221D29]"
-      } bg-[#172234] `}
+      className={cn(
+        "group p-3",
+        label === "Dashboard" ? "mt-2" : "mt-5",
+        "text-sm relative z-10 rounded-lg text-[#707b8f]  transition-colors duration-300 cursor-pointer hover:bg-[#221D29]",
+        showElements && "bg-[#221D29]",
+        "bg-secondaryColor"
+      )}
       initial={{ marginLeft: "15px" }}
       animate={{
         marginLeft: expanded ? "15px" : "-2px",
         paddingRight: expanded ? "10px" : "40px",
       }}
     >
-      {/* <div className="absolute inset-0 bg-opacity-50 backdrop-filter backdrop-blur-sm " /> */}
       <div
-        className={`bg-transparent inset-0 flex justify-between items-center group-hover:text-[#FF5866] transition-colors duration-300 ${
-          showElements && "text-[#FF5866] z-10"
-        }`}
+        className={cn(
+          "bg-transparent inset-0 flex justify-between items-center group-hover:text-sidebarRedColor transition-colors duration-300",
+          showElements && "text-sidebarRedColor z-10"
+        )}
       >
         <div className="flex items-center gap-4">
           <motion.div
@@ -38,7 +40,6 @@ const MainOptions = ({
             animate={{
               fontSize: expanded ? "26px" : "28px",
             }}
-            // className={`${showElements && "bg-[#221D29] text-[#FF5866]"}}`}
           >
             {children}
           </motion.div>
@@ -59,9 +60,8 @@ const MainOptions = ({
             opacity: expanded ? 1 : 0,
             transition: { duration: expanded ? 0.8 : 0.2 },
           }}
-          // transition={{ duration: expanded ? 1.5 : 0.1 }}
         >
-          {label === 'Dashboard' ? <FaChevronDown />: ''}
+          {label === "Dashboard" ? <FaChevronDown /> : ""}
         </motion.div>
       </div>
     </motion.div>
diff --git a/app/components/Dashboard/Sidebar/Option.tsx b/app/components/Dashboard/Sidebar/Option.tsx
index 5808b9d..d5ca39d 100644
--- a/app/components/Dashboard/Sidebar/Option.tsx
+++ b/app/components/Dashboard/Sidebar/Option.tsx
@@ -1,21 +1,20 @@
 "use client";
-import React, { useEffect, useState } from "react";
 import { AnimatePresence, motion } from "framer-motion";
-import MainOptions from "./MainOptions";
-import { RxDashboard } from "react-icons/rx";
-import { PiChatCircleTextLight, PiGameController } from "react-icons/pi";
-import { LiaShoppingCartSolid } from "react-icons/lia";
-import { IoIosSearch } from "react-icons/io";
 import Image from "next/image";
 import Link from "next/link";
 import { usePathname, useRouter } from "next/navigation";
+import { useEffect, useState } from "react";
+import { IoIosSearch } from "react-icons/io";
+import { LiaShoppingCartSolid } from "react-icons/lia";
+import { PiChatCircleTextLight, PiGameController } from "react-icons/pi";
+import { RxDashboard } from "react-icons/rx";
 import { useGlobalState } from "../../Sign/GlobalState";
-import { set } from "react-hook-form";
+import MainOptions from "./MainOptions";
+import { cn } from "@/components/cn";
 
 const gameNames = ["Overview", "Leaderboard", "Settings"];
 
 const Option = ({ label, expanded }: { label: string; expanded: boolean }) => {
-
   const [showElements, setShowElements] = useState(false);
   const [notifed, setNotifed] = useState(false);
   const pathname = usePathname();
@@ -29,9 +28,7 @@ const Option = ({ label, expanded }: { label: string; expanded: boolean }) => {
         setNotifed(true);
       });
     }
-  } , [socket]);
-
-
+  }, [socket]);
 
   const handleDashboardClick = () => {
     if (label === "Dashboard") {
@@ -62,8 +59,8 @@ const Option = ({ label, expanded }: { label: string; expanded: boolean }) => {
           {label === "Dashboard" ? (
             <RxDashboard className="hover:bg-[#34202A]" />
           ) : label === "Chat" ? (
-            <div className="relative"> 
-              <PiChatCircleTextLight className="hover:bg-[#34202A]"/>
+            <div className="relative">
+              <PiChatCircleTextLight className="hover:bg-[#34202A]" />
               {notifed && (
                 <div className="absolute bg-[#34202A] p-1 rounded-full top-0 right-0">
                   <div className="bg-red-500 rounded-full w-[6px] h-[6px]"></div>
@@ -77,42 +74,10 @@ const Option = ({ label, expanded }: { label: string; expanded: boolean }) => {
           ) : label === "Game" ? (
             <PiGameController className="hover:bg-[#34202A]" />
           ) : (
-          <RxDashboard />
+            <RxDashboard />
           )}
         </MainOptions>
       </motion.div>
-      {/* <AnimatePresence>
-        {showElements && (
-          <motion.div>
-            <motion.img
-              // className="filter-white"
-              src="Union.svg"
-              // className="border-red-500"
-              alt="tree"
-              initial={{
-                height: 0,
-                top: "58px",
-                left: "20px",
-                position: "absolute",
-              }}
-              animate={{
-                height: 100,
-                position: "absolute",
-                top: expanded ? "58px" : "54px",
-                left: expanded ? "40px" : "17px",
-              }}
-              exit={{
-                // opacity: 0,
-                y: -20,
-                // x: 0,
-                height: 0,
-                transition: { duration: 0.7 },
-              }}
-              transition={{ duration: 0.29 }}
-            />
-          </motion.div>
-        )}
-      </AnimatePresence> */}
       <motion.div>
         {!expanded && showElements && (
           <motion.div
@@ -142,17 +107,17 @@ const Option = ({ label, expanded }: { label: string; expanded: boolean }) => {
                   transition: { duration: 0.2, delay: index * 0.2 },
                 }}
                 transition={{ duration: 0.29, delay: index * 0.2 }}
-                // className="border"
-                // className="flex mb-2"
               >
                 <Link href={`/Dashboard/${game === "Overview" ? "" : game}`}>
                   <span
-                    className={`py-2 block ${!expanded ? 'ml-2':''} ${
+                    className={cn(
+                      "py-2 block w-32 rounded-lg cursor-pointer text-sm  pl-4 hover:bg-[#34202A] hover:text-sidebarRedColor text-buttonGray",
+                      !expanded ? "ml-2" : "",
                       lastSegment === game ||
-                      (lastSegment === "Dashboard" && game === "Overview")
-                        ? "bg-[#34202A] text-[#FF5866]"
+                        (lastSegment === "Dashboard" && game === "Overview")
+                        ? "bg-[#34202A] text-sidebarRedColor"
                         : ""
-                    }  w-32 rounded-lg cursor-pointer text-sm  pl-4 hover:bg-[#34202A] hover:text-[#FF5866] text-buttonGray `}
+                    )}
                   >
                     {game}
                   </span>
@@ -177,7 +142,6 @@ const Option = ({ label, expanded }: { label: string; expanded: boolean }) => {
                     className="z-0 h-auto w-auto"
                   ></Image>
                 </motion.div>
-                {/* {game} */}
               </motion.div>
             )}
           </AnimatePresence>
diff --git a/app/components/Dashboard/Sidebar/Sidebar.tsx b/app/components/Dashboard/Sidebar/Sidebar.tsx
index 0527d75..8870664 100644
--- a/app/components/Dashboard/Sidebar/Sidebar.tsx
+++ b/app/components/Dashboard/Sidebar/Sidebar.tsx
@@ -1,51 +1,27 @@
 "use client";
 import { motion, AnimatePresence } from "framer-motion";
 import { useEffect, useLayoutEffect, useRef, useState } from "react";
-import { FaChevronRight, FaPlus} from "react-icons/fa6";
+import { FaChevronRight, FaPlus } from "react-icons/fa6";
 import Option from "./Option";
 import ProfileUser from "./ProfileUser";
 import { useSwipeable } from "react-swipeable";
 import { useGlobalState } from "../../Sign/GlobalState";
 import { io } from "socket.io-client";
-import { Oswald } from "next/font/google";
-const oswald = Oswald({ subsets: ["latin"], weight: ["400", "500"] });
+import { oswald } from "@/app/utils/fontConfig";
+import { cn } from "@/components/cn";
 const image =
   "https://preview.redd.it/dwhdw8qeoyn91.png?width=640&crop=smart&auto=webp&s=65176fb065cf249155e065b4ab7041f708af29e4";
 
-const image2 =
-  "https://img.pikbest.com/origin/09/26/71/799pIkbEsTSty.png!w700wp";
-// const showElementssideVariants = {
-//   closed: {
-//     transition: {
-//       staggerChildren: 0.2,
-//       staggerDirection: -1,
-//     },
-//   },
-//   open: {
-//     transition: {
-//       staggerChildren: 0.2,
-//       staggerDirection: 1,
-//     },
-//   },
-// };
-
-
-
-interface User{
-  username    : string,
-  name      : string,
-  picture   :string,
-  banner_picture :string 
-  status    :string,
-  level    : Number
-  createdAt : Date,
+interface User {
+  username: string;
+  name: string;
+  picture: string;
+  banner_picture: string;
+  status: string;
+  level: Number;
+  createdAt: Date;
 }
 
-const ProfileInfoVariants = {
-  opened: { opacity: 1 },
-  closed: { opacity: 0 },
-  exit: { opacity: 0 },
-};
 function useWindowSize() {
   const [size, setSize] = useState(0);
   useLayoutEffect(() => {
@@ -59,15 +35,13 @@ function useWindowSize() {
   return size;
 }
 const Sidebar = () => {
-
   const { state, dispatch } = useGlobalState();
-  const user : any = state.user;
+  const user: any = state.user;
   const [expanded, setExpanded] = useState(true);
   const sidebarRef = useRef(null);
   const handlers = useSwipeable({
     onSwipedLeft: () => setExpanded(false),
     onSwipedRight: () => setExpanded(true),
-    // onSwiped:()=>setExpanded(!expanded),
   });
 
   const tablet = useWindowSize() < 769;
@@ -75,60 +49,64 @@ const Sidebar = () => {
     opened: { width: "270px" },
     closed: { width: tablet ? "1px" : "95px" },
   };
-  
+
   const getCookie = (name: string) => {
     const value = `; ${document.cookie}`;
     const parts = value.split(`; ${name}=`);
-    
+
     if (parts.length === 2) {
-      const cookieValue = parts.pop()?.split(';').shift();
+      const cookieValue = parts.pop()?.split(";").shift();
       return cookieValue;
     } else {
       return undefined;
     }
   };
 
-
   useEffect(() => {
     if (typeof window === "undefined") {
       return;
     }
-    
+
     // get the access token from the cookie
     const accessToken = getCookie("access_token");
-    let socket : any = null;
-    if (accessToken)
-    {
-      
-        fetch("http://localhost:8080/auth/protected", {
-        method: 'GET',
+    let socket: any = null;
+    if (accessToken) {
+      fetch("http://localhost:8080/auth/protected", {
+        method: "GET",
         headers: {
-            'Authorization': `Bearer ${accessToken}`
-        }
+          Authorization: `Bearer ${accessToken}`,
+        },
+      })
+        .then((response) => {
+          return response.json();
         })
-        .then(response => { return response.json();})
-        .then(data => {
-          if (data || data.message !== "Unauthorized")
-          {
-            socket = io('http://localhost:8080', {query: { userId: data?.id } });
-            dispatch({type: 'UPDATE_SOCKET', payload: socket});
-            dispatch({type: 'UPDATE_USER', payload: data});
+        .then((data) => {
+          if (data || data.message !== "Unauthorized") {
+            socket = io("http://localhost:8080", {
+              query: { userId: data?.id },
+            });
+            dispatch({ type: "UPDATE_SOCKET", payload: socket });
+            dispatch({ type: "UPDATE_USER", payload: data });
           }
         })
-        .catch(error => {
+        .catch((error) => {
           console.log("Error during protected endpoint request", error);
         });
     }
     return () => {
-        socket?.disconnect();
+      socket?.disconnect();
     };
-    // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);
-  
 
   return (
-    <div className={`flex relative lg:h-[fit-content] h-auto z-40 ${oswald.className}`} {...handlers}>
-      <div className="h-screen w-full absolute bg-[#101823]"></div>
+    <div
+      className={cn(
+        "flex relative lg:h-[fit-content] h-auto z-40",
+        oswald.className
+      )}
+      {...handlers}
+    >
+      <div className="h-screen w-full absolute bg-primaryColor"></div>
       <motion.div
         className="absolute border w-5 h-5 cursor-pointer z-40 lg:-right-[10px] -right-[15px] top-[80px] border-rightArrowColor lg:p-[2px] p-[20px]  text-rightArrowColor bg-rightArrowBg rounded-full flex items-center justify-center"
         onClick={() => setExpanded(!expanded)}
@@ -138,17 +116,17 @@ const Sidebar = () => {
         <FaChevronRight />
       </motion.div>
       <motion.div
-        className={`text-white bg-[#101823]  flex-col h-full ${
-          tablet && !expanded ? "" : "pl-6 pr-7 z-20"
-        }   select-none sm:flex lg:relative absolute overflow-auto lg:overflow-visible no-scrollbar`}
+        className={cn(
+          "text-white bg-primaryColor  flex-col h-full",
+          tablet && !expanded ? "" : "pl-6 pr-7 z-20",
+          "select-none sm:flex lg:relative absolute overflow-auto lg:overflow-visible no-scrollbar"
+        )}
         variants={containerVariants}
         animate={expanded ? "opened" : "closed"}
         initial={"opened"}
         ref={sidebarRef}
         transition={{
           duration: 0.5,
-          // staggerChildren: 0.015,
-          // staggerDirection: expanded ? 1 : -1,
         }}
       >
         <motion.div
@@ -158,7 +136,6 @@ const Sidebar = () => {
           }}
           className="relative z-20"
         >
-          {/* <div className={`${!expanded ? "hidden" : ""}`}> rounded-full w-20 h-20 object-cover mt-10 */}
           <motion.div className=" flex gap-4 mt-[65px] items-center">
             <motion.img
               src={user?.picture ? user?.picture : "/b.png"}
@@ -174,11 +151,6 @@ const Sidebar = () => {
                     opacity: expanded ? 1 : 0,
                     transition: { duration: 0.2 },
                   }}
-                  // exit={{
-                  //   opacity: 0,
-                  //   transition: { duration: 2.8 },
-                  // }}
-                  // transition={{ duration: 0.29 }}
                   key="modal"
                 >
                   <span className="text-[12px] text-buttonGray">NOOB</span>
@@ -192,27 +164,22 @@ const Sidebar = () => {
             className="text-buttonGray text-[12px] mt-12 block"
             initial={{ paddingLeft: "29px" }}
             animate={{ paddingLeft: expanded ? "29px" : "8px" }}
-            // transition={{ duration: expanded ? 1.5 : 0.1 }}
-          
           >
             MAIN
           </motion.span>
           <div>
             <motion.div>
-              <Option label={"Dashboard"} expanded={expanded}/>
-              <Option label={"Chat"} expanded={expanded}/>
-              <Option label={"Game"} expanded={expanded}/>
+              <Option label={"Dashboard"} expanded={expanded} />
+              <Option label={"Chat"} expanded={expanded} />
+              <Option label={"Game"} expanded={expanded} />
               <Option label={"Shop"} expanded={expanded} />
               <Option label={"Search"} expanded={expanded} />
             </motion.div>
-            {/* <div className="overflow-y-scroll no-scrollbar bg-red-500 w-full z-50"> */}
             <div className="text-buttonGray mt-10 flex justify-between pl-4">
               <motion.span
                 className="text-[12px]"
-                // className="text-buttonGray text-[12px] mt-12"
                 initial={{ marginLeft: "14px" }}
                 animate={{ marginLeft: expanded ? "14px" : "-24px" }}
-                // transition={{ duration: expanded ? 1.5 : 0.1 }}
               >
                 MESSAGES
               </motion.span>
@@ -241,26 +208,9 @@ const Sidebar = () => {
                 expanded={expanded}
               />
             </div>
-            {/* </div> */}
           </div>
         </motion.div>
       </motion.div>
-      {/* <motion.div
-        className="absolute h-[5rem] w-[5rem] -right-[20px] top-20 bg-rightArrowBg  rounded-3xl transform rotate-45 text-right pt-1 pr-1.5 text-[1.2rem] border  cursor-pointer text-rightArrowColor border-rightArrowColor"
-        // initial={{ right: "100px" }}
-        animate={{ right: hovered || tablet ? "-20px" : "100px", transition: { duration: 0.4, delay:!hovered ? 0.5:0 } }}
-        onMouseOver={() => setHovered(true)}
-        onMouseOut={() => setHovered(false)}
-        onClick={() => setExpanded(!expanded)}
-      >
-        <motion.div
-          initial={{ rotate: 90 }}
-          animate={{ rotate: expanded ? 140 : 310 }}
-          className="absolute right-[6px] top-[6px]"
-        >
-          <FaChevronRight />
-        </motion.div>
-      </motion.div> */}
     </div>
   );
 };
diff --git a/app/components/Sign/FormElement.tsx b/app/components/Sign/FormElement.tsx
index a502a50..c3a85fd 100644
--- a/app/components/Sign/FormElement.tsx
+++ b/app/components/Sign/FormElement.tsx
@@ -1,20 +1,14 @@
-import React, { useState } from 'react';
-import { Rajdhani, Poppins, Montserrat } from 'next/font/google';
 import {
-  Form,
   FormControl,
-  FormDescription,
   FormField,
   FormItem,
-  FormLabel,
   FormMessage,
-} from '@/components/ui/form';
-import { motion } from 'framer-motion';
-const rajdhani = Rajdhani({
-  subsets: ['latin'],
-  weight: ['400', '500', '600', '700'],
-});
-import { Input } from '@/components/ui/input';
+} from "@/components/ui/form";
+import { Input } from "@/components/ui/input";
+import { motion } from "framer-motion";
+import React from "react";
+import { rajdhani } from "@/app/utils/fontConfig";
+import { cn } from "@/components/cn";
 
 interface FormElementProps {
   form: any; // Replace 'any' with the specific type of 'form' if available
@@ -36,26 +30,29 @@ const FormElement: React.FC<FormElementProps> = ({ form, placeholder }) => {
             <motion.div className="w-full flex flex-col relative">
               <Input
                 placeholder={placeholder.toUpperCase()}
-                type={placeholder === 'password' ? 'password' : 'text'}
+                type={placeholder === "password" ? "password" : "text"}
                 {...field}
                 onFocus={() => handleInputFocus(placeholder)}
                 onBlur={() => setFocusedInput(null)}
                 autoComplete="off"
-                className={`${rajdhani.className} bg-transparent placeholder:text-buttonGray font-semibold text-lg xm:text-xl md:text-2xl border-b-2 tracking-wider`}
+                className={cn(
+                  "bg-transparent placeholder:text-buttonGray font-semibold text-lg xm:text-xl md:text-2xl border-b-2 tracking-wider",
+                  rajdhani.className
+                )}
               />
               <motion.span
                 className="w-full border absolute bottom-[0px] z-1"
                 initial={{
-                  width: '0%',
-                  left: '50%',
-                  borderColor: 'transparent',
+                  width: "0%",
+                  left: "50%",
+                  borderColor: "transparent",
                   opacity: 0,
                 }}
                 animate={{
-                  width: focusedInput === placeholder ? '100%' : '0%',
-                  left: focusedInput === placeholder ? '0%' : '50%',
+                  width: focusedInput === placeholder ? "100%" : "0%",
+                  left: focusedInput === placeholder ? "0%" : "50%",
                   borderColor:
-                    focusedInput === placeholder ? 'red' : 'transparent',
+                    focusedInput === placeholder ? "red" : "transparent",
                   opacity: focusedInput === placeholder ? 1 : 0,
                 }}
               />
diff --git a/app/components/Sign/FormRest.tsx b/app/components/Sign/FormRest.tsx
index e278ab0..09d0450 100644
--- a/app/components/Sign/FormRest.tsx
+++ b/app/components/Sign/FormRest.tsx
@@ -1,18 +1,18 @@
-import React from 'react';
-import { ArrowUpRight } from 'lucide-react';
-import { Rajdhani } from 'next/font/google';
-import Link from 'next/link'
-const rajdhani = Rajdhani({
-  subsets: ['latin'],
-  weight: ['400', '500', '600', '700'],
-});
+import React from "react";
+import { ArrowUpRight } from "lucide-react";
+import Link from "next/link";
+import { rajdhani } from "@/app/utils/fontConfig";
+import { cn } from "@/components/cn";
 
 export const FormLinesSignUp = () => {
   return (
     <div className="inline-flex items-center justify-center w-full sm:mt-6">
       <hr className="w-4/5 h-px my-8 border-0 bg-lineGray" />
       <span
-        className={`${rajdhani.className} absolute px-8 text-[12px] text-lineGray -translate-x-1/2 bg-dashBack left-1/2`}
+        className={cn(
+          "absolute px-8 text-[12px] text-lineGray -translate-x-1/2 bg-dashBack left-1/2",
+          rajdhani.className
+        )}
       >
         or sign in with
       </span>
@@ -30,14 +30,18 @@ export const FormLinesAlready = ({ n, des, url }: FormLinesAlreadyProps) => {
   return (
     <>
       <div
-        style={{ fontFamily: 'fontt' }}
+        style={{ fontFamily: "fontt" }}
         className="flex justify-between w-4/5 mt-12 text-lg tracking-wide"
       >
-        <span className={`${rajdhani.className} text-white text-sm`}>
+        <span className={cn("text-white text-sm", rajdhani.className)}>
           {des}
         </span>
-        <Link href={url}
-          className={`${rajdhani.className} text-white text-sm flex items-center cursor-pointer hover:text-red-500`}
+        <Link
+          href={url}
+          className={cn(
+            "text-white text-sm flex items-center cursor-pointer hover:text-red-500",
+            rajdhani.className
+          )}
         >
           {n} <ArrowUpRight />
         </Link>
diff --git a/app/components/Sign/SignButton.tsx b/app/components/Sign/SignButton.tsx
index 57ba3c7..d9499fa 100644
--- a/app/components/Sign/SignButton.tsx
+++ b/app/components/Sign/SignButton.tsx
@@ -1,5 +1,4 @@
 'use client';
-import { Button } from '@/components/ui/button';
 import { motion } from 'framer-motion';
 import { Poppins } from 'next/font/google';
 import React from 'react';
diff --git a/app/page.tsx b/app/page.tsx
index ebf03ff..90173c8 100644
--- a/app/page.tsx
+++ b/app/page.tsx
@@ -4,16 +4,12 @@ import { Label } from "../components/ui/newlabel";
 import { Input } from "../components/ui/newinput";
 import { cn } from "../components/cn";
 import axios from "axios";
-import { useRouter } from 'next/navigation';
+import { useRouter } from "next/navigation";
 import { set, useForm } from "react-hook-form";
 import { motion } from "framer-motion";
 import { Boxes } from "@/components/ui/background-boxes";
 
-
-import {
-  IconBrandGithub,
-  IconBrandGoogle,
-} from "@tabler/icons-react";
+import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
 import Link from "next/link";
 import Image from "next/image";
 
@@ -33,13 +29,11 @@ export default function SignupFormDemo() {
   const router = useRouter();
 
   const isValidValues = (value: any) => {
-    if (value.username.length < 3)
-      return 3;
-    else if (value.password.length < 6)
-      return 4;
+    if (value.username.length < 3) return 3;
+    else if (value.password.length < 6) return 4;
     return 0;
   };
-  
+
   useEffect(() => {
     if (is === 3) {
       setError("Username must be at least 3 characters long.");
@@ -50,118 +44,136 @@ export default function SignupFormDemo() {
     }
   }, [is]);
 
-    const onSubmit = (values: any) => {
+  const onSubmit = (values: any) => {
     setIs(isValidValues(values));
-    axios.post("http://localhost:8080/auth/login", {
-      username: values.username,
-      password: values.password
-    }, {
-      headers: {
-        'Content-Type': 'application/json'
-      }
-    })
-    .then(response => {
-      const data = response.data;
-
-      const accessToken = data.access_token;
-
-      document.cookie = `access_token=${data.access_token}; path=/;`;
-
-      // Check if access_token is present
-      if (accessToken) {
-        // Access token is present, make a request to the protected endpoint
-        axios.get("http://localhost:8080/auth/protected", {
+    axios
+      .post(
+        "http://localhost:8080/auth/login",
+        {
+          username: values.username,
+          password: values.password,
+        },
+        {
           headers: {
-            'Authorization': `Bearer ${accessToken}`
-          }
-        })
-        .then(response => {
-          if (response.status === 200)
-            router.push('/Dashboard');
-          else
-            console.log("Failed to authenticate with protected endpoint");
-        })
-        .catch(error => {
-          console.log("Error during protected endpoint request", error);
-        });
-      }
-    })
-    .catch(error => {
-      console.log("Error during login request", error);
-    });
-  }
-
+            "Content-Type": "application/json",
+          },
+        }
+      )
+      .then((response) => {
+        const data = response.data;
+
+        const accessToken = data.access_token;
+
+        document.cookie = `access_token=${data.access_token}; path=/;`;
+
+        // Check if access_token is present
+        if (accessToken) {
+          // Access token is present, make a request to the protected endpoint
+          axios
+            .get("http://localhost:8080/auth/protected", {
+              headers: {
+                Authorization: `Bearer ${accessToken}`,
+              },
+            })
+            .then((response) => {
+              if (response.status === 200) router.push("/Dashboard");
+              else
+                console.log("Failed to authenticate with protected endpoint");
+            })
+            .catch((error) => {
+              console.log("Error during protected endpoint request", error);
+            });
+        }
+      })
+      .catch((error) => {
+        console.log("Error during login request", error);
+      });
+  };
 
   const handleGoogle = () => {
-    router.push('http://localhost:8080/auth/google');
-  }
+    router.push("http://localhost:8080/auth/google");
+  };
 
   const handle42 = () => {
-      router.push('http://localhost:8080/auth/42');
-  }
+    router.push("http://localhost:8080/auth/42");
+  };
 
   return (
     <BgWrapper>
       <div className="w-full h-full flex items-center justify-center">
-          <div className="max-w-md lg:w-full w-[80%] mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-[#101823] ring-[0.2px] ring-red-500 z-10">
-              <motion.h1
-                className='text-red-500 lg:text-4xl md:text-3xl text-2xl font-semibold mb-2 sm:mb-0 text-center'
+        <div className="max-w-md lg:w-full w-[80%] mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-primaryColor ring-[0.2px] ring-red-500 z-10">
+          <motion.h1 className="text-red-500 lg:text-4xl md:text-3xl text-2xl font-semibold mb-2 sm:mb-0 text-center">
+            Login
+          </motion.h1>
+
+          <form className="my-8" onSubmit={form.handleSubmit(onSubmit)}>
+            <LabelInputContainer className="mb-4">
+              <Label htmlFor="username">Username</Label>
+              <Input
+                id="username"
+                placeholder="Enter your username"
+                type="text"
+                {...form.register("username")}
+              />
+              {is === 3 && <p className="text-red-500 text-sm my-4">{error}</p>}
+            </LabelInputContainer>
+            <LabelInputContainer className="mb-4">
+              <Label htmlFor="password">Password</Label>
+              <Input
+                id="password"
+                placeholder="••••••••"
+                type="password"
+                {...form.register("password")}
+              />
+              {is === 4 && <p className="text-red-500 text-sm my-4">{error}</p>}
+            </LabelInputContainer>
+            <button
+              className="bg-gradient-to-br relative group/btn bg-[#192536] block w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
+              type="submit"
+            >
+              Sign In &rarr;
+              <BottomGradient />
+            </button>
+
+            <div className="bg-gradient-to-r from-transparent via-neutral-700 to-transparent my-8 h-[1px] w-full" />
+
+            <div className="flex flex-col space-y-4">
+              <button
+                className=" relative group/btn bg-[#192536] flex space-x-2 items-center justify-center px-4 w-full text-black rounded-md h-10 font-medium shadow-input "
+                type="button"
+                onClick={handle42}
               >
-                Login
-              </motion.h1>
-
-            <form className="my-8" onSubmit={form.handleSubmit(onSubmit)}>
-              <LabelInputContainer className="mb-4">
-                <Label htmlFor="username">Username</Label>
-                <Input id="username" placeholder="Enter your username" type="text" {...form.register('username')}/>
-                {is === 3 && <p className="text-red-500 text-sm my-4">{error}</p>}
-              </LabelInputContainer>
-              <LabelInputContainer className="mb-4">
-                <Label htmlFor="password">Password</Label>
-                <Input id="password" placeholder="••••••••" type="password" {...form.register('password')}/>
-                {is === 4 && <p className="text-red-500 text-sm my-4">{error}</p>}
-              </LabelInputContainer>
+                <Image
+                  src="/Apple Logo.svg"
+                  className="w-5"
+                  alt="42"
+                  width={100}
+                  height={100}
+                />
+                <span className="text-neutral-300 text-sm">Intra 42</span>
+                <BottomGradient />
+              </button>
               <button
-                className="bg-gradient-to-br relative group/btn bg-[#192536] block w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
-                type="submit"
+                className=" relative group/btn flex space-x-2 items-center justify-center px-4 w-full  rounded-md h-10 font-medium shadow-input bg-[#192536]"
+                type="button"
+                onClick={handleGoogle}
               >
-                Sign In &rarr;
+                <IconBrandGoogle className="h-4 w-4 text-neutral-300" />
+                <span className="text-neutral-300 text-sm">Google</span>
                 <BottomGradient />
               </button>
-
-              <div className="bg-gradient-to-r from-transparent via-neutral-700 to-transparent my-8 h-[1px] w-full" />
-
-              <div className="flex flex-col space-y-4">
-                <button
-                  className=" relative group/btn bg-[#192536] flex space-x-2 items-center justify-center px-4 w-full text-black rounded-md h-10 font-medium shadow-input "
-                  type="button"
-                  onClick={handle42}
-                >
-                  <Image src="/Apple Logo.svg" className="w-5" alt="42" width={100} height={100} />
-                  <span className="text-neutral-300 text-sm">
-                    Intra 42
-                  </span>
-                  <BottomGradient />
-                </button>
-                <button
-                  className=" relative group/btn flex space-x-2 items-center justify-center px-4 w-full  rounded-md h-10 font-medium shadow-input bg-[#192536]"
-                  type="button"
-                  onClick={handleGoogle}
-                >
-                  <IconBrandGoogle className="h-4 w-4 text-neutral-300" />
-                  <span className="text-neutral-300 text-sm">
-                    Google
-                  </span>
-                  <BottomGradient />
-                </button>
-              </div>
-            </form>
-            <div className="bg-gradient-to-r from-transparent via-neutral-700 to-transparent my-8 h-[1px] w-full" />
-            <div className="w-full flex justify-between">
-              <Label className="text-gray-300 text-sm" >Don&apos;t have an account?</Label>
-              <Link href="/register" className="text-gray-300 text-sm" >Sign Up &rarr;</Link>
             </div>
+          </form>
+          <div className="bg-gradient-to-r from-transparent via-neutral-700 to-transparent my-8 h-[1px] w-full" />
+          <div className="w-full flex justify-between">
+            <Label className="text-gray-300 text-sm">
+              Don&apos;t have an account?
+            </Label>
+            <Link href="/register" className="text-gray-300 text-sm">
+              Sign Up &rarr;
+            </Link>
           </div>
+        </div>
       </div>
     </BgWrapper>
   );
@@ -189,5 +201,3 @@ const LabelInputContainer = ({
     </div>
   );
 };
-
-
diff --git a/app/register/page.tsx b/app/register/page.tsx
index a072a49..bcf8f8a 100644
--- a/app/register/page.tsx
+++ b/app/register/page.tsx
@@ -1,21 +1,20 @@
 "use client";
-import React, { useEffect, useState } from "react";
-import { Label } from "../../components/ui/newlabel";
-import { Input } from "../../components/ui/newinput";
-import { cn } from "../../components/cn";
 import axios from "axios";
-import { useRouter } from 'next/navigation';
-import { set, useForm } from "react-hook-form";
 import { motion } from "framer-motion";
+import { useRouter } from 'next/navigation';
+import React, { useEffect, useState } from "react";
+import { useForm } from "react-hook-form";
+import { cn } from "../../components/cn";
+import { Input } from "../../components/ui/newinput";
+import { Label } from "../../components/ui/newlabel";
 // import { BgWrapper } from "../page";
 
+import BottomGradient from "@/components/ui/bottomGradiant";
 import {
-  IconBrandGithub,
-  IconBrandGoogle,
+  IconBrandGoogle
 } from "@tabler/icons-react";
-import Link from "next/link";
 import Image from "next/image";
-import BottomGradient from "@/components/ui/bottomGradiant";
+import Link from "next/link";
 
 
 export default function SignupFormDemo() {
diff --git a/app/utils/fontConfig.ts b/app/utils/fontConfig.ts
new file mode 100644
index 0000000..be6cebf
--- /dev/null
+++ b/app/utils/fontConfig.ts
@@ -0,0 +1,21 @@
+import { Oswald, Rajdhani, Roboto, Inter, Rubik } from "next/font/google";
+
+const inter = Inter({
+  subsets: ["latin"],
+  weight: ["400", "500", "600", "700"],
+});
+const rubik = Rubik({
+  subsets: ["latin"],
+  weight: ["400", "500", "600", "700"],
+});
+
+const rajdhani = Rajdhani({
+  subsets: ["latin"],
+  weight: ["400", "500", "600", "700"],
+});
+const roboto = Roboto({
+  subsets: ["latin"],
+  weight: ["400", "500", "700", "900"],
+});
+const oswald = Oswald({ subsets: ["latin"], weight: ["400", "500"] });
+export { rajdhani, rubik, inter, roboto, oswald };
diff --git a/components/ui/background-boxes.tsx b/components/ui/background-boxes.tsx
index b5ea09f..746e519 100644
--- a/components/ui/background-boxes.tsx
+++ b/components/ui/background-boxes.tsx
@@ -6,9 +6,7 @@ import { cn } from "../cn";
 export const BoxesCore = ({ className, ...rest }: { className?: string }) => {
   const rows = new Array(150).fill(1);
   const cols = new Array(100).fill(1);
-  let colors = [
-    "--red-500",
-  ];
+  let colors = ["--red-500"];
   const getRandomColor = () => {
     return colors[Math.floor(Math.random() * colors.length)];
   };
@@ -27,7 +25,7 @@ export const BoxesCore = ({ className, ...rest }: { className?: string }) => {
       {rows.map((_, i) => (
         <motion.div
           key={`row` + i}
-          className="w-16 h-8  border-l  border-[#172234] relative"
+          className="w-16 h-8  border-l  border-secondaryColor relative"
         >
           {cols.map((_, j) => (
             <motion.div
@@ -39,7 +37,7 @@ export const BoxesCore = ({ className, ...rest }: { className?: string }) => {
                 transition: { duration: 2 },
               }}
               key={`col` + j}
-              className="w-16 h-8  border-r border-t border-red-500/[0.5] relative bg-[#172234]"
+              className="w-16 h-8  border-r border-t border-red-500/[0.5] relative bg-secondaryColor"
             >
               {j % 2 === 0 && i % 2 === 0 ? (
                 <svg
@@ -48,7 +46,7 @@ export const BoxesCore = ({ className, ...rest }: { className?: string }) => {
                   viewBox="0 0 24 24"
                   strokeWidth="1.5"
                   stroke="currentColor"
-                  className="absolute h-6 w-10 -top-[14px] -left-[22px] text-[#172234] stroke-[1px] pointer-events-none"
+                  className="absolute h-6 w-10 -top-[14px] -left-[22px] text-secondaryColor stroke-[1px] pointer-events-none"
                 >
                   <path
                     strokeLinecap="round"
diff --git a/tailwind.config.ts b/tailwind.config.ts
index 2d2e7a3..e2cc911 100644
--- a/tailwind.config.ts
+++ b/tailwind.config.ts
@@ -3,35 +3,35 @@ const {
   default: flattenColorPalette,
 } = require("tailwindcss/lib/util/flattenColorPalette");
 
-
 const svgToDataUri = require("mini-svg-data-uri");
- 
+
 const colors = require("tailwindcss/colors");
 
 module.exports = {
-  darkMode: ['class'],
+  darkMode: ["class"],
   content: [
-    './pages/**/*.{ts,tsx}',
-    './components/**/*.{ts,tsx}',
-    './app/**/*.{ts,tsx}',
-    './src/**/*.{ts,tsx}',
+    "./pages/**/*.{ts,tsx}",
+    "./components/**/*.{ts,tsx}",
+    "./app/**/*.{ts,tsx}",
+    "./src/**/*.{ts,tsx}",
   ],
   theme: {
     container: {
       center: true,
-      padding: '2rem',
+      padding: "2rem",
       screens: {
-        '2xl': '1400px',
+        "2xl": "1400px",
       },
     },
     extend: {
       screens: {
-        xm: '391px',
-        sm: '480px',
-        md: '768px',
-        lg: '1024px',
-        xl: '1280px',
-        '2xl': '1536px',
+        xm: "391px",
+        sm: "480px",
+        md: "768px",
+        lg: "1024px",
+        xl: "1280px",
+        xl2: "1408px", // Adjust the value according to your preference
+        "2xl": "1800px",
         boxShadow: {
           input: `0px 2px 3px -1px rgba(0,0,0,0.1), 0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08)`,
         },
@@ -40,116 +40,125 @@ module.exports = {
         Dark: "url('/Background.png')",
       },
       colors: {
-        colorr: '#181818',
-        shopButton:"#393434",
-        greenButton:'#124607',
+        colorr: "#181818",
+        shopButton: "#393434",
+        greenButton: "#124607",
 
-        leaderboarddiv:"#252728",
-        buttonGray: '#808080',
-        blurredRed:"#24191b",
-        rightArrowBg:"#161214",
-        buttonColor:"#4a3832",
-        rightArrowColor:"#9f6689",
-        optionMenu:"#171010",
-        redd: '#a8353f',
-        yellowUnderline: '#fff692',
-        lineGray: '#8b8b8b',
-        redText: '#bd3844',
-        dashBack: '#0d090a',
-        redValorant: '#ff4655',
-        border: 'hsl(var(--border))',
-        input: 'hsl(var(--input))',
-        ring: 'hsl(var(--ring))',
-        progressBg:"#4f4f4f",
-        progressColor:"#52212c",
-        progressIndicator:"#bd3844",
-        background: 'hsl(var(--background))',
-        foreground: 'hsl(var(--foreground))',
+        leaderboarddiv: "#252728",
+        buttonGray: "#808080",
+        blurredRed: "#24191b",
+        rightArrowBg: "#161214",
+        buttonColor: "#4a3832",
+        rightArrowColor: "#9f6689",
+        ////////////////////////////////////////////
+        primaryColor: "#101823",
+        secondaryColor: "#172234",
+        sidebarRedColor: "#FF5866",
+        mainRedColor: "#FF4654",
+        mathHistoryGreenColor: "#24D8AF",
+        // progressBarRedColor:"#FF4654",
+        ////////////////////////////////////////////
+        optionMenu: "#171010",
+        redd: "#a8353f",
+        yellowUnderline: "#fff692",
+        lineGray: "#8b8b8b",
+        redText: "#bd3844",
+        dashBack: "#0d090a",
+        redValorant: "#ff4655",
+        border: "hsl(var(--border))",
+        input: "hsl(var(--input))",
+        ring: "hsl(var(--ring))",
+        progressBg: "#4f4f4f",
+        progressColor: "#52212c",
+        progressIndicator: "#bd3844",
+        background: "hsl(var(--background))",
+        foreground: "hsl(var(--foreground))",
         primary: {
-          DEFAULT: 'hsl(var(--primary))',
-          foreground: 'hsl(var(--primary-foreground))',
+          DEFAULT: "hsl(var(--primary))",
+          foreground: "hsl(var(--primary-foreground))",
         },
         secondary: {
-          DEFAULT: 'hsl(var(--secondary))',
-          foreground: 'hsl(var(--secondary-foreground))',
+          DEFAULT: "hsl(var(--secondary))",
+          foreground: "hsl(var(--secondary-foreground))",
         },
         destructive: {
-          DEFAULT: 'hsl(var(--destructive))',
-          foreground: 'hsl(var(--destructive-foreground))',
+          DEFAULT: "hsl(var(--destructive))",
+          foreground: "hsl(var(--destructive-foreground))",
         },
         muted: {
-          DEFAULT: 'hsl(var(--muted))',
-          foreground: 'hsl(var(--muted-foreground))',
+          DEFAULT: "hsl(var(--muted))",
+          foreground: "hsl(var(--muted-foreground))",
         },
         accent: {
-          DEFAULT: 'hsl(var(--accent))',
-          foreground: 'hsl(var(--accent-foreground))',
+          DEFAULT: "hsl(var(--accent))",
+          foreground: "hsl(var(--accent-foreground))",
         },
         popover: {
-          DEFAULT: 'hsl(var(--popover))',
-          foreground: 'hsl(var(--popover-foreground))',
+          DEFAULT: "hsl(var(--popover))",
+          foreground: "hsl(var(--popover-foreground))",
         },
         card: {
-          DEFAULT: 'hsl(var(--card))',
-          foreground: 'hsl(var(--card-foreground))',
+          DEFAULT: "hsl(var(--card))",
+          foreground: "hsl(var(--card-foreground))",
         },
       },
       borderRadius: {
-        lg: 'var(--radius)',
-        md: 'calc(var(--radius) - 2px)',
-        sm: 'calc(var(--radius) - 4px)',
+        lg: "var(--radius)",
+        md: "calc(var(--radius) - 2px)",
+        sm: "calc(var(--radius) - 4px)",
       },
       keyframes: {
-        'accordion-down': {
+        "accordion-down": {
           from: { height: 0 },
-          to: { height: 'var(--radix-accordion-content-height)' },
+          to: { height: "var(--radix-accordion-content-height)" },
         },
-        'accordion-up': {
-          from: { height: 'var(--radix-accordion-content-height)' },
+        "accordion-up": {
+          from: { height: "var(--radix-accordion-content-height)" },
           to: { height: 0 },
         },
       },
       animation: {
-        'accordion-down': 'accordion-down 0.2s ease-out',
-        'accordion-up': 'accordion-up 0.2s ease-out',
+        "accordion-down": "accordion-down 0.2s ease-out",
+        "accordion-up": "accordion-up 0.2s ease-out",
       },
     },
   },
-  plugins: [require('tailwindcss-animate'),
-  addVariablesForColors,
-  function ({ matchUtilities, theme }: any) {
-    matchUtilities(
-      {
-        "bg-grid": (value: any) => ({
-          backgroundImage: `url("${svgToDataUri(
-            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
-          )}")`,
-        }),
-        "bg-grid-small": (value: any) => ({
-          backgroundImage: `url("${svgToDataUri(
-            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
-          )}")`,
-        }),
-        "bg-dot": (value: any) => ({
-          backgroundImage: `url("${svgToDataUri(
-            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`
-          )}")`,
-        }),
-      },
-      { values: flattenColorPalette(theme("backgroundColor")), type: "color" }
-    );
-  }, require("@tailwindcss/forms")],
+  plugins: [
+    require("tailwindcss-animate"),
+    addVariablesForColors,
+    function ({ matchUtilities, theme }: any) {
+      matchUtilities(
+        {
+          "bg-grid": (value: any) => ({
+            backgroundImage: `url("${svgToDataUri(
+              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
+            )}")`,
+          }),
+          "bg-grid-small": (value: any) => ({
+            backgroundImage: `url("${svgToDataUri(
+              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
+            )}")`,
+          }),
+          "bg-dot": (value: any) => ({
+            backgroundImage: `url("${svgToDataUri(
+              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`
+            )}")`,
+          }),
+        },
+        { values: flattenColorPalette(theme("backgroundColor")), type: "color" }
+      );
+    },
+    require("@tailwindcss/forms"),
+  ],
 };
 
-
-
 function addVariablesForColors({ addBase, theme }: any) {
   let allColors = flattenColorPalette(theme("colors"));
   let newVars = Object.fromEntries(
     Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
   );
- 
+
   addBase({
     ":root": newVars,
   });
-}
\ No newline at end of file
+}
