import prisma from "../../lib/db.ts";

let TempUpdateInterval;
let juiceUpdateInterval;

export async function PATCH(req) {
  const { setting } = await req.json();
  if (setting > 4 || setting < -1) {
    return res.status(400).json({ error: "Invalid Setting Value" });
  }

  try {
    let result;
    if (setting !== -1) {
      result = await prisma.machine.update({
        where: { id: 1 },
        data: {
          setting: setting,
          gearRatio: setting * 1,
          motorGauge: setting * 200,
          powerGauge: setting * 250,
          motorRpm: setting * 200,
          motorStatus: setting > 2,
        },
      });
    } else {
      result = await prisma.machine.update({
        where: { id: 1 },
        data: {
          setting: 0,
          gearRatio: 0,
          motorGauge: 0,
          powerGauge: -250,
          motorRpm: 0,
          motorStatus: setting > 2,
        },
      });
    }

    clearInterval(TempUpdateInterval);
    TempUpdateInterval = null;
    TempUpdateInterval = tempUpdateStart(setting);
    clearInterval(juiceUpdateInterval);
    juiceUpdateInterval = null;
    juiceUpdateInterval = juiceUpdateStart(setting);

    return new Response(JSON.stringify({ success: true, machine: result }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error updating machine data", error);
    return new Response(
      JSON.stringify({ error: "failed to change setting " }),
      { status: 500 },
    );
  }
}

function juiceUpdateStart(setting) {
  return setInterval(async () => {
    console.log("juice draining");
    const machine = await prisma.machine.findUnique({ where: { id: 1 } });
    if (setting > 0 && machine.juice > 0) {
      await prisma.machine.update({
        where: { id: 1 },
        data: { juice: machine.juice - 1 },
      });
    } else if (machine.juice === 0 || setting <= 0) {
      console.log("interval cleared:juice");
      clearInterval(juiceUpdateInterval);
      juiceUpdateInterval = null;
      await prisma.machine.update({
        where: { id: 1 },
        data: {
          setting: 0,
          gearRatio: 0,
          motorGauge: 0,
          powerGauge: 0,
          motorRpm: 0,
          motorStatus: false,
        },
      });
    }
  }, 500);
}

function tempUpdateStart(setting) {
  let tempTarget = 25 + setting * 5;
  if (setting === -1) {
    tempTarget = 25;
  }

  console.log(tempTarget);
  return setInterval(async () => {
    const machine = await prisma.machine.findUnique({ where: { id: 1 } });
    console.log(machine.batteryTemp);
    if (machine.batteryTemp < tempTarget) {
      await prisma.machine.update({
        where: { id: 1 },
        data: { batteryTemp: machine.batteryTemp + 1 },
      });
    } else if (machine.batteryTemp > tempTarget) {
      await prisma.machine.update({
        where: { id: 1 },
        data: { batteryTemp: machine.batteryTemp - 1 },
      });
    } else {
      clearInterval(TempUpdateInterval);
      TempUpdateInterval = null;
    }
  }, 500);
}
