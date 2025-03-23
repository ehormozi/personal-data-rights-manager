'use client';

import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip } from 'chart.js';
import Widget from '../../../../components/server/widget';
import WhiteBox from '../../../../components/server/white-box';

Chart.register(ArcElement, Tooltip);

type YourDataAtAGlanceClientProps = {
  labels: string[];
  values: number[];
};

const YourDataAtAGlanceClient: React.FC<YourDataAtAGlanceClientProps> = ({
  labels,
  values,
}) => {
  const position:
    | 'bottom'
    | 'center'
    | 'left'
    | 'top'
    | 'right'
    | 'chartArea'
    | undefined = 'top';

  const colors = ['#3b82f6', '#f59e0b', '#16a34a', '#dc2626'];

  const data = {
    labels: labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors,
        hoverBackgroundColor: colors.map((color) => color + 'CC'),
      },
    ],
  };

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
            const value = tooltipItem.raw;
            const percentage = (
              (value / values.reduce((sum, current) => sum + current, 0)) *
              100
            ).toFixed(2);
            return `${tooltipItem.label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <Widget title="Your Data at a Glance">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="w-full md:w-1/2 h-64">
          <Pie data={data} options={options} />
        </div>

        <WhiteBox className="p-4 space-y-2">
          <p className="text-gray-700 text-sm font-medium">
            Here&apos;s a breakdown of your shared data:
          </p>
          <ul className="list-disc list-inside text-gray-500 text-sm">
            {labels?.map((label: string, index: number) => (
              <li key={index}>
                {label}:{' '}
                {Math.floor(
                  (values[index] /
                    values.reduce((sum, current) => sum + current, 0)) *
                    100,
                )}
                % of shared data
              </li>
            ))}
          </ul>
        </WhiteBox>
      </div>
    </Widget>
  );
};

export default YourDataAtAGlanceClient;
