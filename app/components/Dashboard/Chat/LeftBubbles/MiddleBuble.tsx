import React from "react";

const MiddleBuble = (props: any) => {
  return (
    <div className="flex items-center group justify-start">
      <p className="px-6 py-3 rounded-lg bg-gray-800 max-w-xs lg:max-w-md text-gray-200">
        {props.message}
      </p>
    </div>
  );
};

export default MiddleBuble;
