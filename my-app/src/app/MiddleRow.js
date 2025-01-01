"use client";
import React from "react";
import Gauge from "./components/Gauge";

/**
 * MiddleRow component
 * @description The Wrapper for the power and motor gauge.
 */
export default function MiddleRow({ machine }) {
  return (
    <div className="flex flex-row justify-around items-center w-[99.5%] mb-2 min-h-64 h-[25vw] bg-[#333333] rounded-lg px-4 shadow-black shadow-md">
      <div className="h-[95%]">
        <Gauge
          value={machine.powerGauge}
          min={-1000}
          max={1000}
          totalGaps={8}
          type={"KW"}
        ></Gauge>
      </div>
      <div className="h-[95%]">
        <Gauge
          value={machine.motorGauge}
          min={0}
          max={800}
          totalGaps={8}
          type={"RPM"}
        ></Gauge>
      </div>
    </div>
  );
}
