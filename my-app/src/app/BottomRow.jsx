"use client";
import Box from "./components/Box.jsx";

import React, { useState } from "react";

export default function BottomRow({ machine, juice }) {
  const getColor = (type) => {
    switch (type) {
      case "parking":
        return machine.parking ? "red" : "gray";
      case "engineWarning":
        return machine.engineStatus ? "red" : "gray";
      case "motor":
        return machine.motorStatus ? "red" : "gray";
      case "lowBattery":
        if (juice < 25) {
          return "red";
        } else {
          return "gray";
        }
      default:
        return "gray";
    }
  };

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
