
'use client'

import React, { useState } from 'react'

export default function TopRow() {

    const [park, setPark] = useState(false);
    const [engineStat, setEngineStat] = useState(false);
    const [motorStat, setMotorStat] = useState(false);
    const [lowBattery, setLowBattery] = useState(false);

    return (
        <div className='relative flex flex-row w-screen h-1/6 bg-transparent'>
            <div className="bg-white w-1/6"></div>
            <div className="bg-black w-1/6"></div>
            <div className="bg-yellow-50 w-1/6"></div>
            <div className="bg-blue-400 w-1/6"></div>
        </div>
    );
}
