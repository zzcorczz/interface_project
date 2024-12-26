import prisma from "../../lib/db.ts";

export async function GET(req) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  let data;

  async function update() {
    try {
      const machine = await prisma.machine.findUnique({
        where: { id: 1 },
      });

      if (!machine) {
        const warning = JSON.stringify({ error: "Machine Not Found" });
        writer.write(`data: ${warning}`);
        return;
      }

      if (
        !data ||
        data.juice !== machine.juice ||
        data.batteryTemp !== machine.batteryTemp
      ) {
        writer.write(`data: ${JSON.stringify(machine)}\n\n`);
        data = machine;
      }
    } catch (err) {
      console.error("error fetching machine data at update()", err);
      writer.write(`data: ${JSON.stringify({ error: "failed to gat data" })}`);
    }
  }

  let interval = setInterval(update, 500);

  req.signal.addEventListener("abort", () => {
    clearInterval(interval);
    interval = null;
    writer.close();
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
