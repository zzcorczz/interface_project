"use client";
import Image from "next/image";
import TopRow from "./TopRow";
import motorGauge from "./MotorGauge";
import PowerGauge from "./PowerGauge";
import { useEffect, useState } from "react";

export default function Home() {
  // const [parking, setParking] = useState(false);
  // const [engineStatus, setEngineStatus] = useState(false);
  // const [motorStatus, setMotorStatus] = useState(false);
  // const [batteryStatus, setBatteryStatus] = useState(false);
  // const [powerGauge, setPowerGauge] = useState(0);
  // const [motorGauge, setMotorGauge] = useState(0);
  // const [gearRatio, setGearRatio] = useState(0);
  // const [juice, setJuice] = useState(0);
  // const [batteryTemperature, setBatteryTemperature] = useState(0);
  // const [motorRPM, setMotorRPM] = useState(0);
  // const [setting, setSetting] = useState(0);
  //
  const [machine, setMachine] = useState(null);
  const [loading, setLoading] = useState(false);

  async function updateSetting() {
    setLoading(true);
    try {
      const res = await fetch("api/interface/", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ setting }),
      });
      if (!res.ok) {
        throw new Error("failed to connect to api");
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function getData() {
    try {
      // const res = await fetch("api/initial_data", {
      //   method: "GET",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ machine }),
      // });
      const res = await fetch("api/initial_data");
      if (!res.ok) {
        throw new Error("failed to connect to api");
      }
      const data = await res.json();
      setMachine(data);
    } catch (err) {
      console.error("get data failed", err);
      return new Response(JSON.stringify({ error: "failed to get data" }), {
        status: 500,
      });
    }
  }

  useEffect(() => {
    console.log("useEffect Engaged.");
    const res = getData();
    setMachine(res);
  }, []);

  return (
    <div className="flex-col overflow-hidden bg-gray-300 min-h-screen h-screen w-screen p-0 m-0 font-[family-name:var(--font-geist-sans)]">
      <TopRow></TopRow>
      <div className="flex flex-col items-center h-full w-full">
        {machine ? (
          <div>parking status of machine: {machine.parking}</div>
        ) : (
          <div>loading..</div>
        )}
        {/* {machine.engineStatus ? <div>Engine On</div> : <div>Engine Off</div>} */}
        {/* {machine.motorStatus ? ( */}
        {/*   <div>MotorStatus: repair needed</div> */}
        {/* ) : ( */}
        {/*   <div>MotorStatus: repair not needed</div> */}
        {/* )} */}
        {/* {machine.batteryStatus ? ( */}
        {/*   <div>Battery Low</div> */}
        {/* ) : ( */}
        {/*   <div>Battery Normal</div> */}
        {/* )} */}
        {/* {<div>gearRatio: {machine.gearRatio}</div>} */}
        {/* {<div>Power Gauge: {machine.powerGauge}</div>} */}
        {/* {<div>Motor Gauge: {machine.motorGauge}</div>} */}
        {/* {<div>Battery Percentage: {machine.juice}</div>} */}
        {/* {<div>Battery Temperature: {machine.batteryTemp}</div>} */}
        {/* {<div>MotorRPM: {machine.motorRpm}</div>} */}
        {/* {<div>Setting: {setting}</div>} */}
        {/* <div className="flex flex-row w-full justify-evenly"> */}
        {/*   <button>OFF</button> */}
        {/*   <button>1</button> */}
        {/*   <button>2</button> */}
        {/*   <button>3</button> */}
        {/*   <button>4</button> */}
        {/* </div> */}
      </div>
    </div>
  );
}
