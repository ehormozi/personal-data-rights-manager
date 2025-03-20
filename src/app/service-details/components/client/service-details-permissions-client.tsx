'use client';

import { useState } from 'react';
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
import ConfirmationDialog from '@/components/material/confirmation-dialog';
import FileFormatDialog from '@/components/material/file-format-dialog';
import Datatable from '@/components/material/datatable';

Chart.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
);

export default function ServiceDetailsPermissionsClient(props: {
  countBySensitivity: { sensitivity: number; count: number }[];
  countByWeek: { week: number; count: number }[];
  assets: string[];
  data: {
    id: number;
    asset: string;
    sensitivity: number;
    sensitivityLabel: string;
    time: string;
  }[];
  prefilter?: string;
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

  const pieData = {
    labels: ['High Sensitivity', 'Medium Sensitivity', 'Low Sensitivity'],
    datasets: [
      {
        data: [
          highSensitivityCount,
          mediumSensitivityCount,
          lowSensitivityCount,
        ],
        backgroundColor: ['#EF4444', '#FBBF24', '#10B981'],
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
            const value = tooltipItem.raw;
            const percentage = ((value / totalPermissions) * 100).toFixed(2);
            return `${tooltipItem.label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  const barData = {
    labels: props.countByWeek.map((entry) => `Week ${entry.week}`),
    datasets: [
      {
        label: 'Permissions Granted',
        data: props.countByWeek.map((entry) => entry.count),
        backgroundColor: '#3B82F6',
        borderWidth: 1,
      },
    ],
  };

  const sensitivityColors: Record<string, string> = {
    Low: 'text-green-500',
    Medium: 'text-yellow-500',
    High: 'text-red-500',
  };

  const columns = [
    {
      key: 'asset',
      label: 'Asset',
      type: 'string',
      filter: true,
      distinctValues: props.assets,
      placeholder: 'Filter by Permissions',
    },
    {
      key: 'sensitivityLabel',
      label: 'Sensitivity',
      type: 'string',
      filter: true,
      distinctValues: ['Low', 'Medium', 'High'],
      sortKey: 'sensitivity',
      placeholder: 'Select Sensitivity',
      colorMap: sensitivityColors,
    },
    {
      key: 'time',
      label: 'Granted Time',
      type: 'string',
      filter: false,
    },
  ];

  const [allData, setAllData] = useState<
    {
      id: number;
      asset: string;
      sensitivity: number;
      sensitivityLabel: string;
      time: string;
      selected: boolean;
    }[]
  >([...props.data].map((row) => ({ ...row, selected: false })));

  const [filteredData, setFilteredData] = useState<typeof allData>(allData);

  const [showRevokeDialog, setShowRevokeDialog] = useState(false);

  const [showDDRDialog, setShowDDRDialog] = useState(false);

  const [showExportFFDialog, setshowExportFFDialog] = useState(false);

  const [showExportConfDialog, setShowExportConfDialog] = useState(false);

  const [selectedExportFormat, setselectedExportFormat] = useState('CSV');

  const handleRevokePermissionsClick = (permissions: { asset: string }[]) => {
    setShowRevokeDialog(true);
  };

  const confirmRevokePermissions = () => {
    // Call API to revoke permissions
    setShowRevokeDialog(false);
  };

  const cancelRevokePermissions = () => {
    setShowRevokeDialog(false);
  };

  const handleDDRClick = (permissions: { asset: string }[]) => {
    setShowDDRDialog(true);
  };

  const confirmDDR = () => {
    // Call API to revoke permissions
    setShowDDRDialog(false);
  };

  const cancelDDR = () => {
    setShowDDRDialog(false);
  };

  const handleExportFFClick = (permissions: { asset: string }[]) => {
    setshowExportFFDialog(true);
  };

  const confirmExportFF = (format: string) => {
    // Call API to revoke permissions
    setselectedExportFormat(format);
    setShowExportConfDialog(true);
  };

  const cancelExportFF = () => {
    setshowExportFFDialog(false);
  };

  const confirmExportConf = () => {
    handleExport(
      filteredData
        .filter((row) => row.selected === true)
        .map((row) => ({
          asset: row.asset,
          sensitivity: row.sensitivityLabel,
          time: row.time,
        })),
      selectedExportFormat,
    );
    setShowExportConfDialog(false);
    setshowExportFFDialog(false);
  };

  const cancelExportConf = () => {
    setShowExportConfDialog(false);
  };

  const handleExport = async (
    selectedRows: { asset: string; sensitivity: string; time: string }[],
    format: string,
  ) => {
    try {
      const response = await fetch('http://localhost:3001/api/export-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, PUT, POST',
          'Access-Control-Allow-Headers':
            'Origin, X-Requested-With, Content-Type, Accept',
        },
        body: JSON.stringify({ data: selectedRows, format }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `exported_data.${format.toLowerCase()}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.log(response);
        console.error('Export failed');
      }
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  return (
    <Widget title="Permissions">
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
      <section className="flex flex-col max-h-screen overflow-y-auto bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-wrap gap-4 mb-4">
          <button
            className={
              allData.filter((row) => row.selected === true).length === 0
                ? 'px-4 py-2 bg-gray-300 rounded-lg text-sm cursor-not-allowed opacity-50'
                : 'px-4 py-2 bg-red-600 rounded-lg text-sm text-white hover:bg-red-700'
            }
            onClick={() =>
              handleRevokePermissionsClick(
                filteredData
                  .filter((row) => row.selected === true)
                  .map((row) => ({ asset: row.asset })),
              )
            }
            disabled={
              allData.filter((row) => row.selected === true).length === 0
            }
          >
            Revoke Permissions
          </button>
          <button
            className={
              allData.filter((row) => row.selected === true).length === 0
                ? 'px-4 py-2 bg-gray-300 rounded-lg text-sm cursor-not-allowed opacity-50'
                : 'px-4 py-2 bg-yellow-600 rounded-lg text-sm text-white hover:bg-yellow-700'
            }
            onClick={() =>
              handleDDRClick(
                filteredData
                  .filter((row) => row.selected === true)
                  .map((row) => ({ asset: row.asset })),
              )
            }
            disabled={
              allData.filter((row) => row.selected === true).length === 0
            }
          >
            Send Data Deletion Requests
          </button>
          <button
            className={
              allData.filter((row) => row.selected === true).length === 0
                ? 'px-4 py-2 bg-gray-300 rounded-lg text-sm cursor-not-allowed opacity-50'
                : 'px-4 py-2 bg-green-600 rounded-lg text-sm text-white hover:bg-green-700'
            }
            onClick={() =>
              handleExportFFClick(
                filteredData
                  .filter((row) => row.selected === true)
                  .map((row) => ({ asset: row.asset })),
              )
            }
            disabled={
              allData.filter((row) => row.selected === true).length === 0
            }
          >
            Export Data
          </button>
        </div>
        <Datatable
          columns={columns}
          allData={allData}
          filteredData={filteredData}
          setAllData={setAllData}
          setFilteredData={setFilteredData}
        />
        {showRevokeDialog && (
          <ConfirmationDialog
            title="Revoke Selected Permissions"
            message="Are you sure you want to revoke the selected permissions ?"
            confirmLabel="Yes, Revoke"
            cancelLabel="Cancel"
            onConfirm={confirmRevokePermissions}
            onCancel={cancelRevokePermissions}
          />
        )}
        {showDDRDialog && (
          <ConfirmationDialog
            title="Send Data Deletion Requests"
            message="Are you sure you want to send data deletion requests for the selected permissions?"
            confirmLabel="Yes, Send"
            cancelLabel="Cancel"
            onConfirm={confirmDDR}
            onCancel={cancelDDR}
          />
        )}
        {showExportFFDialog && (
          <FileFormatDialog
            isOpen={showExportFFDialog}
            onClose={cancelExportFF}
            onConfirm={confirmExportFF}
          />
        )}
        {showExportConfDialog && (
          <ConfirmationDialog
            title="Export Data"
            message="You are about to export data for the selected permissions. Do you wish to proceed?"
            confirmLabel="Export"
            cancelLabel="Cancel"
            onConfirm={confirmExportConf}
            onCancel={cancelExportConf}
          />
        )}
      </section>
    </Widget>
  );
}
