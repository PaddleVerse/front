import React from "react";

const MiddleBuble = (props: any) => {
  return (
    <div className="flex items-center group">
      <div className="w-8 h-8 relative flex flex-shrink-0 mr-4">
        {props.showProfilePic && (
          <img
            className="shadow-md rounded-full w-full h-full object-cover"
            src={props.picture}
            alt=""
          />
        )}
      </div>
      <p className="px-6 py-3 rounded-lg bg-gray-800 max-w-xs lg:max-w-md text-gray-200">
        {props.message}
      </p>
    </div>
  );
};

export default MiddleBuble;
