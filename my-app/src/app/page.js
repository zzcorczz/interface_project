"use client";
import TopRow from "./TopRow";
import MiddleRow from "./MiddleRow";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import ThirdRow from "./components/ThirdRow.jsx";
import Slider from "@mui/material/Slider";
import BottomRow from "./BottomRow.jsx";
import Box from "./components/Box.jsx";

export default function Home() {
  const marks = [
    { value: 0, label: "OFF" },
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
  ];

  const [machine, setMachine] = useState(null);
  const [loading, setLoading] = useState(false);
  const [setting, setSetting] = useState(0);
  const [temp, setTemp] = useState(0);
  const [juice, setJuice] = useState(0);
  const [charging, setCharging] = useState(false);
  const [disabled, setDisabled] = useState(false);

  async function getData() {
    try {
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

  async function changeSetting(setting, charging) {
    try {
      if (machine.juice === 0 && setting !== -1) {
        Swal.fire({
          title: "No Power!",
          text: "Charge the battery first!",
          icon: "question",
        });
        return;
      }
      if (setting !== -1) {
        setCharging(false);
        await fetch("api/charge", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ charging }),
        });
      } else if (setting === -1) {
        setSetting(0);
      }
      const res = await fetch("api/interface", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ setting }),
      });
      if (!res.ok) {
        throw new Error("failed to update setting");
      }
      setSetting(setting);
    } catch (err) {
      console.error("failed to update setting", err);
    }
  }

  async function startCharging(charge) {
    try {
      setCharging(charge);
      if (charge === false) {
        changeSetting(0);
      } else {
        changeSetting(-1);
      }

      const res = await fetch("api/charge", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ charge }),
      });
      if (!res.ok) {
        throw new Error("failed to start charging");
      }
    } catch (err) {
      console.error("failed to start charging", err);
    }
  }

  useEffect(() => {
    const res = getData();
    setMachine(res);
  }, []);

  useEffect(() => {
    const eventListener = new EventSource("/api/stream");
    eventListener.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMachine(data);
    };
    return () => {
      eventListener.close();
    };
  }, []);

  useEffect(() => {
    if (!machine) {
      return;
    } else if (machine.juice === 0 && setting !== 0) {
      setSetting(0);
    } else if (machine.juice === 100 && setting === -1) {
      setCharging(false);
      setDisabled(true);
      Swal.fire({
        title: "Charging Complete!",
        text: "Battery Full. Charging Stopped.",
        icon: "success",
      });
    } else if (machine.juice !== 100) {
      setDisabled(false);
    }
  }, [JSON.stringify(machine)]);

  if (machine) {
    return (
      <div className="overflow-hidden flex flex-col items-center justify-center bg-[#5A5A5A] min-h-screen h-full w-full font-[family-name:var(--font-geist-sans)]">
        <TopRow machine={machine} juice={machine.juice}></TopRow>
        <MiddleRow value={machine.motorGauge}></MiddleRow>
        <div className="flex flex-row w-[99%] h-32 mb-3 bg-[#1A1A1A] rounded-md shadow-md shadow-black">
          <ThirdRow
            juice={machine.juice}
            set={changeSetting}
            charging={charging}
          ></ThirdRow>
          <div className="flex bg-white w-[70%] justify-center items-center">
            <Slider
              value={setting}
              sx={{
                width: "80%",
              }}
              marks={marks}
              min={0}
              max={4}
              onChange={(event, newValue) => changeSetting(newValue)}
            />
          </div>
        </div>
        {/* <div>{machine.batteryStatus ? "Battery Low" : "Battery Normal"}</div> */}
        {/* <div>gearRatio: {machine.gearRatio}</div> */}
        {/* <div>Power Gauge: {machine.powerGauge}</div> */}
        {/* <div>Motor Gauge: {machine.motorGauge}</div> */}
        {/* <div>Battery Percentage: {juice}</div> */}
        {/* <div>Battery Temperature: {temp}</div> */}
        {/* <div>MotorRPM: {machine.motorRpm}</div> */}
        {/* <div>Setting: {machine.setting}</div> */}
        {/* <div> charging status {charging.toString()} </div> */}
        {/* <div className="flex flex-row w-full justify-evenly"> */}
        {/*   <button onClick={() => changeSetting(0)}>OFF</button> */}
        {/*   <button onClick={() => changeSetting(1)}>1</button> */}
        {/*   <button onClick={() => changeSetting(2)}>2</button> */}
        {/*   <button onClick={() => changeSetting(3)}>3</button> */}
        {/*   <button onClick={() => changeSetting(4)}>4</button> */}
        {/* </div> */}
        <div className="flex relative justify-between w-[99vw] h-1/6 bg-[#1A1A1A] rounded-md shadow-md shadow-black">
          <BottomRow />

          {/* <div className="flex w-[100vw] bg-red-400 items-center justify-center"> */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="flex items-center justify-center bg-[#333333] w-1/12 h-full border-l-2 border-r-2 border-l-gray-500 border-r-gray-500">
              <Box
                type={"Menu"}
                className={"relative top-[25%] left-[12%]"}
              ></Box>
            </div>
          </div>
          <button onClick={() => startCharging(!charging)} disabled={disabled}>
            {charging ? "Stop Charging" : "StartCharging"}
          </button>
        </div>
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
}
