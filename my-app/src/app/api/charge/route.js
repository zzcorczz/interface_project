import prisma from "../../lib/db.ts";

let chargingInterval;

export async function PATCH(req) {
  const { charge } = await req.json();
  console.log("This is charging status", charge);

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
    console.log("charging!");
    const machine = await prisma.machine.findUnique({ where: { id: 1 } });

    if (machine.juice >= 100) {
      clearInterval(chargingInterval);
      chargingInterval = null;
      charging = false;
    }
    if (charging === true) {
      await prisma.machine.update({
        where: { id: 1 },
        data: { juice: machine.juice + 1 },
      });
    } else {
      console.log("interval cleared:Battery Full");
      clearInterval(chargingInterval);
      chargingInterval = null;
    }
  }, 500);
}
