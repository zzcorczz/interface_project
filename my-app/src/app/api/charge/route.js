import prisma from "../../lib/db.ts";

let chargingInterval;

export async function PATCH(req) {
  const { charge } = await req.json();

  try {
    clearInterval(chargingInterval);
    chargingInterval = null;
    chargingInterval = chargingStart(charge);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (err) {
    console.error("Error Start Charging", err);
    return new Response(
      JSON.stringify({ error: "failed to start charging" }, { status: 500 }),
    );
  }
}

function chargingStart(charging) {
  return setInterval(async () => {
    const machine = await prisma.machine.findUnique({ where: { id: 1 } });

    if (machine.juice >= 100 && charging === true) {
      clearInterval(chargingInterval);
      chargingInterval = null;
      charging = false;
      await prisma.machine.update({
        where: { id: 1 },
        data: {
          powerGauge: 0,
          setting: 0,
          gearRatio: 0,
          motorGauge: 0,
          motorRpm: 0,
          motorStatus: false,
          charging: charging,
        },
      });
      return;
    }
    if (charging === true) {
      await prisma.machine.update({
        where: { id: 1 },
        data: {
          juice: machine.juice + 1,
          powerGauge: -250,
          setting: 0,
          gearRatio: 0,
          motorGauge: 0,
          motorRpm: 0,
          motorStatus: false,
          charging: charging,
        },
      });
    } else {
      clearInterval(chargingInterval);
      chargingInterval = null;
    }
  }, 1000);
}
