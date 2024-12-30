"use client";
import React from "react";
import Gauge from "./components/Gauge";

export default function MiddleRow({ value }) {
  return (
    <div className="flex flex-row justify-around items-center w-[99.5%] mb-2 min-h-64 h-[25vw] bg-[#333333] rounded-lg px-4 shadow-black shadow-md">
      <div className="h-[95%]">
        <Gauge value={value}></Gauge>
      </div>
      <div className="h-[95%]">
        <Gauge value={0}></Gauge>
      </div>
    </div>
  );
}
