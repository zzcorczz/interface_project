"use client";
import TopRow from "./TopRow";
import MiddleRow from "./MiddleRow";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import ThirdRow from "./components/ThirdRow.jsx";
import Slider from "@mui/material/Slider";
import BottomRow from "./BottomRow.jsx";
import Box from "./components/Box.jsx";

/**
 * Home component
 * @description website client side home page.
 * The entry of the web application.
 */
export default function Home() {
  const marks = [
    { value: 0, label: "OFF" },
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
  ];

  const [machine, setMachine] = useState(null);
  const [setting, setSetting] = useState(0);
  const [charging, setCharging] = useState(false);
  const [disabled, setDisabled] = useState(false);

  /**
   * getData() function
   * @description get initial data from the backend.
   */
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

  /**
   * changeSetting() function
   * @description changed the setting of the machine based on
   * user selection and charging state.
   */
  async function changeSetting(setting, charging) {
    try {
      console.log(setting);
      if (machine.juice === 0 && setting !== -1) {
        Swal.fire({
          title: "No Power!",
          text: "Charge the battery first!",
          icon: "question",
        });
        if (setting === 0 && charging === false) {
          const res = await fetch("api/interface", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ setting }),
          });

          if (!res.ok) {
            throw new Error("failed to update setting");
          }
        }
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

  /**
   * startCharging() function
   * @description start charging when the user pressed
   * charging button.
   */
  async function startCharging(charge) {
    try {
      setCharging(charge);
      console.log(charge);
      if (charge === false) {
        changeSetting(0, charge);
      } else {
        changeSetting(-1, charge);
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

  // get initial data
  useEffect(() => {
    const res = getData();
    setMachine(res);
  }, []);

  // establish event stream
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

  // update state variables when backend data changes.
  useEffect(() => {
    if (!machine) {
      return;
    } else if (machine.juice === 0 && setting > 0) {
      changeSetting(0, false);
      setCharging(false);
      setSetting(0);
    } else if (machine.juice === 100 && setting === -1) {
      setCharging(false);
      setSetting(0);
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
      <div className="overflow-hidden flex flex-col items-center justify-center bg-[#5A5A5A] min-h-screen h-screen w-screen font-[family-name:var(--font-geist-sans)]">
        <TopRow machine={machine} juice={machine.juice}></TopRow>
        <MiddleRow machine={machine}></MiddleRow>
        <div className="flex flex-row w-[99.5%] h-1/6 mb-3 bg-[#1A1A1A] rounded-md shadow-md shadow-black">
          <ThirdRow
            juice={machine.juice}
            set={changeSetting}
            charging={charging}
            rpm={machine.motorRpm}
            temp={machine.batteryTemp}
            gear={machine.gearRatio}
          ></ThirdRow>
          <div className="w-1/5 bg-transparent h-full"></div>
          <div className="flex flex-col bg-transparent w-[70%] justify-center items-center">
            <h1 className="text-white text-4xl">MOTOR SPEED SETTING</h1>
            <Slider
              value={setting}
              marks={marks}
              min={0}
              max={4}
              sx={{
                width: "80%",
                "& .MuiSlider-thumb": {
                  backgroundColor: "black",
                  border: "2px solid white",
                  "&.Mui-active": {
                    boxShadow: "0 0 0 12px rgba(0, 0, 255, 0.3)",
                  },
                },
                "& .MuiSlider-track": {
                  backgroundColor: "gray",
                  height: "10px",
                },
                "& .MuiSlider-rail": {
                  backgroundColor: "gray",
                  height: "10px",
                },
                "& .MuiSlider-mark": {
                  backgroundColor: "#00000000",
                  height: "8px",
                  width: "2px",
                },
                "& .MuiSlider-markLabel": {
                  color: "white",
                  fontSize: "24px",
                },
              }}
              onChange={(event, newValue) => changeSetting(newValue)}
            />
          </div>
        </div>
        <div className="flex relative justify-between w-[99.5%] h-1/8 bg-[#1A1A1A] rounded-md shadow-md shadow-black">
          <BottomRow />

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="flex items-center justify-center bg-[#333333] w-1/12 h-full border-l-2 border-r-2 border-l-gray-500 border-r-gray-500">
              <Box
                type={"Menu"}
                className={"relative top-[25%] left-[12%]"}
              ></Box>
            </div>
          </div>
          <button
            className="h-auto w-24 aspect-square justify-center items-center"
            onClick={() => startCharging(!charging)}
            disabled={disabled}
          >
            {charging ? (
              <Box
                type={"Charging"}
                color={"green"}
                className={"h-full w-full"}
              ></Box>
            ) : (
              <Box
                type={"Charging"}
                color={"gray"}
                className={"h-full w-full"}
              ></Box>
            )}
          </button>
        </div>
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
}
