"use client";
import Box from "./components/Box.jsx";
import LowBattery from "./components/LowBattery.jsx";

import React, { useState } from "react";

export default function TopRow({ machine, juice }) {
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
    <div className="top-0 flex flex-row w-[99.5%] h-1/6 bg-[#1A1A1A] mb-2 rounded-md shadow-md shadow-black">
      <div className="flex bg-transparent w-1/12 border-r-2 border-r-gray-500 justify-center items-center">
        <Box type="parking" color={getColor("parking")} className="h-1/2"></Box>
      </div>
      <div className="flex bg-transparent w-1/12 border-l-2 border-r-2 border-l-gray-500 border-r-gray-500 justify-center items-center">
        <Box
          type="engineWarning"
          color={getColor("engineWarning")}
          className="h-3/4"
        ></Box>
      </div>
      <div className="flex bg-transparent w-1/12 border-l-2 border-r-2 border-l-gray-500 border-r-gray-500 justify-center items-center">
        <Box type="motor" color={getColor("motor")} className="h-3/4"></Box>
      </div>
      <div className="flex bg-transparent w-1/12 border-l-2 border-r-2 border-l-gray-500 border-r-gray-500 justify-center items-center">
        <Box
          type="lowbattery"
          color={getColor("lowBattery")}
          className="h-2/3"
        ></Box>
      </div>
    </div>
  );
}
