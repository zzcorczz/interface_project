"use client";
import React, { useState } from "react";
import Box from "./Box.jsx";
import BatteryGauge from "react-battery-gauge";

/**
 * ThirdRow Component.
 * @description The third row of the interface.
 * This component will take relevant user data and display them on the screen.
 * It reutilizes some of the key components from the TopRow Component.
 * @param {object} props - user data needed.
 * @param {numebr} props.juice - the current battery percentage.
 * @param {number} props.rpm - the current rpm of the machine.
 */

export default function ThirdRow(props) {
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
      <div className="flex flex-col bg-transparent w-1/6 border-l-2 border-r-2 border-l-gray-500 border-r-gray-500 justify-end items-center">
        <BatteryGauge
          value={props.juice}
          orientation={"vertical"}
          size={100}
          customization={customization}
          className="mb-8"
        ></BatteryGauge>
        <div className="relative text-white">{props.juice}</div>
        <h1 className="text-gray-500 relative ">%</h1>
      </div>
      <div className="flex flex-col bg-transparent w-1/6 border-l-2 border-r-2 border-l-gray-500 border-r-gray-500 justify-end items-center">
        <Box
          type="batteryTemp"
          color={"gray"}
          className="relative h-full top-[17%] left-[10%]"
        ></Box>
        <div className="relative bottom-[2%] text-white">{props.temp}</div>
        <h1 className="text-gray-500 relative bottom-[0%]">°C</h1>
      </div>
      <div className="flex flex-col bg-transparent w-1/6 border-l-2 border-r-2 border-l-gray-500 border-r-gray-500 justify-center items-center">
        <Box type="motor" color={"gray"} className="h-2/3 w-[100%]"></Box>
        <div className="text-white relative top-[3%]">{props.rpm}</div>
        <h1 className="text-gray-500 relative top-[3%]">RPM</h1>
      </div>
    </>
  );
}
