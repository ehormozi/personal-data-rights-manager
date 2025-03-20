'use client';

import React, { useRef, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
} from 'chart.js';
import Widget from '../material/widget';
import WhiteBox from '../material/white-box';

Chart.register(LineElement, PointElement, CategoryScale, LinearScale, Legend);

export default function PermissionTrendsClient(props: {
  granted: number[];
  revoked: number[];
}) {
  const chartRef = useRef<any>(null);

  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current && chartRef.current.chartInstance) {
        chartRef.current.chartInstance.resize();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const data = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
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
    maintainAspectRatio: false,
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
    <Widget title="Permission Trends">
      <div className="h-64">
        <Line ref={chartRef} data={data} options={options} />
      </div>
      <WhiteBox className="p-4 space-y-2">
        <p className="text-gray-600 text-sm">
          Analyze how your permissions have changed over the past weeks. Keeping
          track of these trends helps you stay in control of your data.
        </p>
      </WhiteBox>
    </Widget>
  );
}
