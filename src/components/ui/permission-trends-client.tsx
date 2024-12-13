'use client';

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
} from 'chart.js';

Chart.register(LineElement, PointElement, CategoryScale, LinearScale, Legend);

export default function PermissionTrendsClient(props: {
  granted: number[];
  revoked: number[];
}) {
  // Mock data for permission trends
  const data = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], // Time intervals
    datasets: [
      {
        label: 'Permissions Granted',
        data: props.granted,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Permissions Revoked',
        data: props.revoked,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Permissions',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Permission Trends</h2>
      <div className="h-64">
        <Line data={data} options={options} />
      </div>
      <p className="text-gray-600 text-sm">
        Analyze how your permissions have changed over the past weeks. Keeping
        track of these trends helps you stay in control of your data.
      </p>
    </div>
  );
}
