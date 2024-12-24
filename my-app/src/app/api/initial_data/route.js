import prisma from "../../lib/db.ts";

export async function GET() {
  try {
    const machine = await prisma.machine.findUnique({
      where: { id: 1 },
    });

    if (!machine) {
      const initial_data = await prisma.machine.create({
        data: {
          parking: false,
          engineStatus: false,
          motorStatus: false,
          batteryStatus: false,
          powerGauge: 0,
          motorGauge: 0,
          gearRatio: 0,
          juice: 50,
          batteryTemp: 25,
          setting: 0,
        },
      });
      return new Response(JSON.stringify(initial_data), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(machine), {
      status: 200,
      "Content-Type": "application/json",
    });
  } catch (err) {
    console.error("error fetching data", err);
    return new Response(JSON.stringify({ error: "failed to fetch data" }), {
      status: 500,
    });
  }
}