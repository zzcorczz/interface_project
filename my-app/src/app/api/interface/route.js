import prisma from "@/lib/db";

let TempUpdateInterval;

export async function PATCH(req) {
  const { setting } = req.body;

  if (setting > 4 || setting < 0) {
    return res.status(400).json({ error: "Invalid Setting Value" });
  }

  try {
    const result = await prisma.machine.update({
      where: { id: 1 },
      data: {
        setting: setting,
        gearRatio: setting * 1,
        motorGauge: setting * 200,
        powerGauge: setting * 250,
        motorRpm: setting * 200,
        motorStatus: setting > 1,
      },
    });
    clearInterval(TempUpdateInterval);
    TempUpdateInterval = tempUpdateStart();
    return new response(JSON.stringify({ success: true, machine: result }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error updating machine data", error);
    return new response(
      JSON.stringify({ error: "failed to change setting " }),
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const machine = await prisma.machine.findUnique({
      where: { id: 1 },
    });
    if (!machine) {
      return new Response(j);
    }
  } catch {}
}

function tempUpdateStart(setting) {
  const tempTarget = setting * 5;
  const interval = setInterval(async () => {
    const machine = await prisma.machine.findUnique({ where: { id: 1 } });
    if (machine.batteryTemp < tempTarget) {
      await prisma.machine.update({
        where: { id: 1 },
        data: { batteryTemp: machine.batteryTemp + 1 },
      });
    } else {
      clearInterval(TempUpdateInterval);
    }
  }, 1000);
  return interval;
}
