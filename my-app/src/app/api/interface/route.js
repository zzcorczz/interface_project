/**
 * The interface endpoint.
 * @description the interface endpoint accepts requests from the frontend to change setting.
 * Then, it is going to emulate data change and push such change to the database.
 * By changing the setting, different machine states will change, as well as some time-sensitive data,
 * such as battery temperature and battery percentage.
 */

import prisma from "../../lib/db.ts";

/**
 * GET function.
 * @description when GET() is called, get initial data from the database.
 * if no data exists, generate a set of initial data.
 */

let TempUpdateInterval;
let juiceUpdateInterval;

/**
 * PATCH function.
 * @description when patch is called, change the data in the database to the correct data assigned to the selected setting.
 * initiate temperature change interval and battery percentage change interval, 1 unit change / 1000ms.
 * @param {object} req: the standard fetch api object, containing selected setting by the user.
 */
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

/**
 * juiceUpdateStart function.
 * @description talks to the database on a predetermined time interval (1000ms)
 * when the battery is empty, stops charging by clearing the interval and set setting back to 0.
 * @param {number} setting: selected setting by the user.
 */
function juiceUpdateStart(setting) {
  return setInterval(async () => {
    const machine = await prisma.machine.findUnique({ where: { id: 1 } });
    if (setting > 0 && machine.juice > 0) {
      await prisma.machine.update({
        where: { id: 1 },
        data: { juice: machine.juice - 1 },
      });
    } else if (machine.juice === 0 || setting <= 0) {
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
  }, 1000);
}

/**
 * tempUpdateStart function.
 * @description begins updating the temperature.
 * determines the temperature target corresponding to the selected setting,
 * and uses a time interval to update the temperature.
 * @param {number} setting: selected setting by the user.
 */

function tempUpdateStart(setting) {
  let tempTarget = 25 + setting * 5;
  if (setting === -1) {
    tempTarget = 25;
  }

  return setInterval(async () => {
    const machine = await prisma.machine.findUnique({ where: { id: 1 } });
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
  }, 1000);
}
