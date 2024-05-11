import React from "react";

export const OnlinePreview = ({ status }: { status: string }) => {
  if (status === "ONLINE") return <p className="text-green-500">Online</p>;
  else if (status === "ON_GAME") return <p className="text-red-500">On Game</p>;
  else return <p className="text-gray-400">Offline</p>;
};
