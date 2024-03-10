import React from "react";

const MiddleBubbleRight = (props: any) => {
  return (
    <div className="flex items-center group justify-end">
      <p className="px-6 py-3 rounded-lg bg-green-800 max-w-xs lg:max-w-md text-white">
        {props.message}
      </p>
    </div>
  );
};

export default MiddleBubbleRight;
