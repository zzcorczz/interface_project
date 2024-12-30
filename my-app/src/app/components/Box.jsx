import React from "react";
import Motor from "../components/Motor.jsx";
import LowBattery from "./LowBattery.jsx";
import EngineWarning from "./EngineWarning.jsx";
import Parking from "./Parking.jsx";
import GearRatio from "./GearRatio.jsx";
import BatteryTemp from "./BatteryTemp.jsx";
import Menu from "./Menu.jsx";

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
  };

  return map[type] || null;
}

export default Box;
