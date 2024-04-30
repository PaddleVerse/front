'use client'
import React, { useState } from 'react'
import {Bar} from 'react-chartjs-2'
import {Line} from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js';
import {
  PointElement,
  LineElement,
} from "chart.js";
import {PlayerData} from './Data'
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);

const BarChart = () => {
    
    const [userData, setUserData]  = useState({
        labels: PlayerData.map((data, index) => index + 1),
        datasets:[
            {
                label: 'Player Data',
                data: PlayerData.map(data => data.win),
                backgroundColor: '#4CAF50',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }
        ]
    })

  return (

      <Line data={userData}
      options={{ 
        aspectRatio: 10, 
        responsive: true, 
        maintainAspectRatio: false, 
    }} 
      />
  )
}

export default BarChart