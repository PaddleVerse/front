import React from "react";

export const OnlinePreview = ({ status }: { status: string }) => {
  if (status === "ONLINE") return <p className="text-green-500">Online</p>;
  else return <p className="text-gray-400">Offline</p>;
};

// export default OnlinePreview;
