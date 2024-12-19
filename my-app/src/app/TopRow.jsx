
'use client'

import React, { useState } from 'react'

export default function TopRow() {

    const [park, setPark] = useState(false);
    const [engineStat, setEngineStat] = useState(false);
    const [motorStat, setMotorStat] = useState(false);
    const [lowBattery, setLowBattery] = useState(false);

    return (
        <div className='w-full h-1/6 bg-red-500'>
            <div className="bg-white w-full h-1/4"></div>
            <div className="bg-black w-full h-1/4"></div>
            <div className="bg-yellow-50 w-full h-1/4"></div>
            <div className="bg-blue-400 w-full h-1/4"></div>
        </div>
    );
}
