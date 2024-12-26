"use client";
import TopRow from "./TopRow";
import { useEffect, useState } from "react";

export default function Home() {
  const [machine, setMachine] = useState(null);
  const [loading, setLoading] = useState(false);
  const [setting, setSettting] = useState(0);
  const [temp, setTemp] = useState(0);
  const [juice, setJuice] = useState(0);
  const [charging, setCharging] = useState(false);

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

  // async function changeSetting(setting, charging) {
  //   if (charging === false) {
  //     try {
  //       const res = await fetch("api/interface", {
  //         method: "PATCH",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ setting }),
  //       });
  //       if (!res.ok) {
  //         throw new Error("failed to update setting");
  //       }
  //       const data = await res.json();
  //       setMachine(data.machine);
  //     } catch (err) {
  //       console.error("failed to update setting", err);
  //     }
  //   } else {
  //     setCharging(false);
  //     const res = await fetch("/api/interface", {
  //       method: "PATCH",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ setting }),
  //     });
  //     const data = await res.json();
  //     setMachine(data.machine);
  //   }
  // }

  async function changeSetting(setting, charging) {
    try {
      if (setting !== -1) {
        setCharging(false);
        await fetch("api/charge", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ charging }),
        });
      }
      const res = await fetch("api/interface", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ setting }),
      });
      if (!res.ok) {
        throw new Error("failed to update setting");
      }
      const data = await res.json();
      setMachine(data.machine);
    } catch (err) {
      console.error("failed to update setting", err);
    }
  }

  async function startCharging(charge) {
    try {
      console.log("charging: ", charging);
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
      setTemp(data.batteryTemp);
      setJuice(data.juice);
    };
    return () => {
      eventListener.close();
    };
  }, []);

  if (machine) {
    return (
      <div className="flex-col overflow-hidden bg-gray-300 min-h-screen h-screen w-screen p-0 m-0 font-[family-name:var(--font-geist-sans)]">
        <TopRow></TopRow>
        <div className="flex flex-col items-center h-full w-full">
          <div>parking status of machine: {machine.parking}</div>
          <div>{machine.engineStatus ? "Engine On" : "Engine Off"}</div>
          <div>
            {machine.motorStatus
              ? "MotorStatus: repair needed"
              : "MotorStatus: repair not needed"}
          </div>
          <div>{machine.batteryStatus ? "Battery Low" : "Battery Normal"}</div>
          <div>gearRatio: {machine.gearRatio}</div>
          <div>Power Gauge: {machine.powerGauge}</div>
          <div>Motor Gauge: {machine.motorGauge}</div>
          <div>Battery Percentage: {juice}</div>
          <div>Battery Temperature: {temp}</div>
          <div>MotorRPM: {machine.motorRpm}</div>
          <div>Setting: {machine.setting}</div>
          <div> charging status {charging.toString()} </div>
          <div className="flex flex-row w-full justify-evenly">
            <button onClick={() => changeSetting(0)}>OFF</button>
            <button onClick={() => changeSetting(1)}>1</button>
            <button onClick={() => changeSetting(2)}>2</button>
            <button onClick={() => changeSetting(3)}>3</button>
            <button onClick={() => changeSetting(4)}>4</button>
          </div>

          <div>
            <button onClick={() => startCharging(!charging)}>
              {charging ? "Stop Charging" : "StartCharging"}
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
}
