"use client";
import Box from "./components/Box.jsx";

/**
 * BottomRow component
 * @description wrapper for the bottom row icons.
 */

export default function BottomRow({ machine, juice }) {
  return (
    <>
      <div className="flex w-1/5">
        <div className="flex bg-transparent w-1/3 border-r-2 border-r-gray-500 justify-center items-center">
          <Box
            type="gearRatio"
            color={"gray"}
            className="h-full relative top-[20%] left-[10%]"
          ></Box>
        </div>
        <div className="flex bg-transparent w-1/3 border-l-2 border-r-2 border-l-gray-500 border-r-gray-500 justify-center items-center">
          <Box type="motor" color={"gray"} className="h-3/4"></Box>
        </div>
        <div className="flex bg-transparent w-1/3 border-l-2 border-r-2 border-l-gray-500 border-r-gray-500 justify-center items-center">
          <Box
            type="batteryTemp"
            color={"gray"}
            className="relative top-[20%] left-[12%]"
          ></Box>
        </div>
      </div>
    </>
  );
}
