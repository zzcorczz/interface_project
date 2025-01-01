/**
 * The stream endpoint.
 * @description the stream endpoint lets you establish server-sent events stream.
 * This is the beakend implementation of the SSE design.
 * It constantly talks to the database and when new data is received, it pushes
 * the new data to the client side.
 */

import prisma from "../../lib/db.ts";

/**
 * The GET() method.
 * @description GET method establishes a TransformStream.
 * It checks for any change in the database. If there is one,
 * it pushes data to the client.
 */
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

      if (!data || JSON.stringify(data) !== JSON.stringify(machine)) {
        writer.write(`data: ${JSON.stringify(machine)}\n\n`);
        data = machine;
      }
    } catch (err) {
      console.error("error fetching machine data at update()", err);
      writer.write(`data: ${JSON.stringify({ error: "failed to gat data" })}`);
    }
  }

  let interval = setInterval(update, 1000);

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
      "X-Accel-Buffering": "no",
      "Content-Encoding": "identity",
    },
  });
}
