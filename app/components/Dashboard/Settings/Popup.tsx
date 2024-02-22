import React, { useState } from 'react';

const Popup = ({ children, isVisible, seter, reset }: any) => {
  const handleClose = () => {
    reset && reset();
    seter(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-800 bg-opacity-50"></div>
      <div className="relative z-10">
        <div className="container mx-auto p-4 rounded-lg bg-[#5b565453] shadow-md max-w-md">
          {children}
          <button
            className="mt-4 p-2 bg-red-500 hover:bg-red-700 text-white w-full rounded-md"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
