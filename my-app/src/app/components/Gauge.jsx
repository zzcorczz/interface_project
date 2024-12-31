"use client";

import React, { useEffect } from "react";

export default function Gauge({
  value,
  min = 0,
  max = 800,
  totalGaps = 8,
  type,
}) {
  const r = 45;
  const calculateAngle = (value) => ((value - min) / (max - min)) * 280 + 40; //calculate the display angle based on need.
  const angle = Math.cos((calculateAngle(value) * Math.PI) / 180);

  const gaps = [];

  for (let i = 0; i <= totalGaps; i++) {
    const percent = i / totalGaps;
    const angle = percent * 280 + 129;
    const number = Math.round(min + percent * (max - min));
    gaps.push({ angle, number });
  }

  const offset = 50;

  return (
    <div className="overflow-hidden relative flex items-center aspect-square justify-center w-full h-full bg-[#555555] border-4 border-gray-500 rounded-full">
      <div className="absolute top-[4vw] left-[4vw] w-full h-full rounded-full bg-[#333333] z-0 "></div>

      {gaps.map((gap, index) => {
        const x = offset + r * Math.cos((gap.angle * Math.PI) / 180);
        const y = offset + r * Math.sin((gap.angle * Math.PI) / 180);

        return (
          <div
            key={index}
            className="absolute text-sm text-white"
            style={{
              // transform: `rotate(${gap.angle}deg)`,
              // transformOrigin: "bottom center",
              transform: "translate(-50%, -50%)",
              left: `${x}%`,
              top: `${y}%`,
            }}
          >
            {gap.number}
          </div>
        );
      })}

      <div
        className="absolute w-16 h-[10vw] bg-stone-500 origin-top transition-transform duration-500"
        style={{
          // left: "44%",
          // bottom: "-18%",
          // bottom: "50%",
          top: "50%",
          transform: `rotate(${calculateAngle(value)}deg)`,
          transition: "transform 1s ease",
          clipPath: "polygon(50% 0%, 60% 30%, 50% 100%, 40% 30%)",
          background: "linear-gradient(to bottom, #333333, #ffffff)",
        }}
      ></div>

      {/* <div className="absolute w-4 h-4 bg-orange-500 rounded-full"></div> */}

      <div className="flex flex-col absolute bottom-10 items-center text-lg text-white font-bold">
        {value}
        <h1 class="text-gray-400">{type}</h1>
      </div>
    </div>
  );
}
