'use client';

import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

import Widget from '@/components/material/widget';
import WhiteBox from '@/components/material/white-box';

Chart.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
);

export default function ServiceAnalyticsClient(props: {
  countBySensitivity: { sensitivity: number; count: number }[];
  countByWeek: { week: number; count: number }[];
}) {
  const highSensitivityCount = props.countBySensitivity.filter(
    (e: { sensitivity: number; count: number }) => e.sensitivity === 3,
  ).length;
  const mediumSensitivityCount = props.countBySensitivity.filter(
    (e: { sensitivity: number; count: number }) => e.sensitivity === 2,
  ).length;
  const lowSensitivityCount = props.countBySensitivity.filter(
    (e: { sensitivity: number; count: number }) => e.sensitivity === 1,
  ).length;
  const totalPermissions =
    highSensitivityCount + mediumSensitivityCount + lowSensitivityCount;

  // Pie Chart Data
  const pieData = {
    labels: ['High Sensitivity', 'Medium Sensitivity', 'Low Sensitivity'],
    datasets: [
      {
        data: [
          highSensitivityCount,
          mediumSensitivityCount,
          lowSensitivityCount,
        ],
        backgroundColor: ['#EF4444', '#FBBF24', '#10B981'], // Red, Yellow, Green
        borderWidth: 1,
      },
    ],
  };

  const position:
    | 'bottom'
    | 'center'
    | 'left'
    | 'top'
    | 'right'
    | 'chartArea'
    | undefined = 'right';

  const options = {
    plugins: {
      legend: {
        position: position,
        labels: {
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (tooltipItem: { raw: any; label: any }) {
            const value = tooltipItem.raw; // Value for the hovered section
            const percentage = ((value / totalPermissions) * 100).toFixed(2); // Calculate percentage
            return `${tooltipItem.label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  // Bar Chart Data
  const barData = {
    labels: props.countByWeek.map((entry) => `Week ${entry.week}`),
    datasets: [
      {
        label: 'Permissions Granted',
        data: props.countByWeek.map((entry) => entry.count),
        backgroundColor: '#3B82F6', // Blue
        borderWidth: 1,
      },
    ],
  };

  return (
    <Widget title="Analytics">
      <div className="flex space-x-4">
        <WhiteBox className="w-full md:w-1/2 max-h-80 p-4 pb-12">
          <h4 className="text-md font-semibold text-gray-800 mb-2">
            Sensitivity Breakdown
          </h4>
          {<Pie data={pieData} options={options} />}
        </WhiteBox>
        <WhiteBox className="w-full md:w-1/2 max-h-80 p-4 pb-12">
          <h4 className="text-md font-semibold text-gray-800 mb-2">
            Permissions Granted Over Time
          </h4>
          {<Bar data={barData} />}
        </WhiteBox>
      </div>
    </Widget>
  );
}
