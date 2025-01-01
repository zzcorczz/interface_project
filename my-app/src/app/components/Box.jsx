"use client";

import React from "react";
import Motor from "../components/Motor.jsx";
import LowBattery from "./LowBattery.jsx";
import EngineWarning from "./EngineWarning.jsx";
import Parking from "./Parking.jsx";
import GearRatio from "./GearRatio.jsx";
import BatteryTemp from "./BatteryTemp.jsx";
import Menu from "./Menu.jsx";
import Charging from "./Charging.jsx";

/**
 * Box component
 * @description The wrapper for all svg icons.
 * @param {string} type: the type of the machine.
 * @param {string} color: the color of the icon.
 * @param {string} className: other formatting properties, usually tailwind.
 */
function Box({ type, color, className }) {
  const map = {
    motor: <Motor color={color} className={className}></Motor>,
    lowbattery: <LowBattery color={color} className={className}></LowBattery>,
    engineWarning: (
      <EngineWarning color={color} className={className}></EngineWarning>
    ),
    parking: <Parking color={color} className={className}></Parking>,
    gearRatio: <GearRatio color={color} className={className}></GearRatio>,
    batteryTemp: (
      <BatteryTemp color={color} className={className}></BatteryTemp>
    ),
    Menu: <Menu color={color} className={className}></Menu>,
    Charging: <Charging color={color} className={className}></Charging>,
  };

  return map[type] || null;
}

export default Box;
