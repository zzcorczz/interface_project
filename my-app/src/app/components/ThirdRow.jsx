"use client";

import React, { useState } from "react";
import Box from "./Box.jsx";
import BatteryGauge from "react-battery-gauge";
import Slider from "@mui/material/Slider";

export default function ThirdRow(props) {
  const [value, setValue] = useState(0);
  const customization = {
    batteryBody: {
      strokeColor: "gray",
    },
    batteryCap: {
      strokeColor: "gray",
    },
    batteryMeter: {
      fill: "gray",
      lowBatteryValue: 25,
    },
    readingText: {
      lightContrastColor: "white",
      darkContrastColor: "white",
    },
  };

  const marks = [
    { value: 0, label: "OFF" },
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
  ];

  return (
    <>
      <div className="flex flex-col bg-transparent w-1/6 border-r-2 border-r-gray-500 justify-center items-center">
        <Box
          type="gearRatio"
          color={"gray"}
          className="h-[80%] relative top-[20%] left-[8%]"
        ></Box>
        <div className="text-white">{props.gear}</div>
      </div>
      <div className="flex flex-col bg-transparent w-1/6 border-l-2 border-r-2 border-l-gray-500 border-r-gray-500 justify-center items-center">
        <BatteryGauge
          value={props.juice}
          orientation={"vertical"}
          size={100}
          customization={customization}
        ></BatteryGauge>
        <div className="relative top-[14%] text-white">{props.juice}</div>
        <h1 className="text-gray-500 relative top-[14%]">%</h1>
      </div>
      <div className="flex flex-col bg-transparent w-1/6 border-l-2 border-r-2 border-l-gray-500 border-r-gray-500 justify-center items-center">
        <Box
          type="batteryTemp"
          color={"gray"}
          className="relative h-full top-[15%] left-[10%]"
        ></Box>
        <div className="relative bottom-[2%] text-white">{props.temp}</div>
        <h1 className="text-gray-500 relative bottom-[1%]">°C</h1>
      </div>
      <div className="flex flex-col bg-transparent w-1/6 border-l-2 border-r-2 border-l-gray-500 border-r-gray-500 justify-center items-center">
        <Box type="motor" color={"gray"} className="h-2/3 w-[100%]"></Box>
        <div className="text-white relative top-[3%]">{props.rpm}</div>
        <h1 className="text-gray-500 relative top-[3%]">RPM</h1>
      </div>
    </>
  );
}
