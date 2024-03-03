import React from "react";

export function GridBackground() {
  return (
    <div className="absolute h-full w-full bg-black z-[-1]   bg-grid-white/[0.4]  flex items-center justify-center">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black  [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
    </div>
  );
}
