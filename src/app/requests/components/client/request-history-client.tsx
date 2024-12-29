'use client';

import { useState } from 'react';
import Widget from '@/components/material/widget';
import ConfirmationDialog from '@/components/material/confirmation-dialog';
import FileFormatDialog from '@/components/material/file-format-dialog';
import Datatable from '@/components/material/datatable';

export default function RequestHistoryClient(props: {
  types: string[];
  services: string[];
  assets: string[];
  statuses: string[];
  data: {
    id: number;
    type: string;
    service: string;
    asset: string;
    status: string;
    updated_at: string;
  }[];
}) {
  const statusColors: Record<string, string> = {
    Completed: 'text-green-600',
    Pending: 'text-yellow-500',
    Failed: 'text-red-600',
    default: 'text-red-600',
  };

  const columns = [
    {
      key: 'type',
      label: 'Type',
      type: 'string',
      filter: true,
      distinctValues: props.types,
      placeholder: 'Select Type',
    },
    {
      key: 'service',
      label: 'Service',
      type: 'string',
      filter: true,
      distinctValues: props.services,
      placeholder: 'Select Service',
    },
    {
      key: 'asset',
      label: 'Asset',
      type: 'string',
      filter: true,
      distinctValues: props.assets,
      placeholder: 'Select Asset',
    },
    {
      key: 'status',
      label: 'Status',
      type: 'string',
      filter: true,
      distinctValues: props.statuses,
      placeholder: 'Select Status',
      colorMap: statusColors,
    },
    {
      key: 'updated_at',
      label: 'Last Update',
      type: 'string',
      filter: false,
    },
  ];

  const [allData, setAllData] = useState<
    {
      id: number;
      type: string;
      service: string;
      asset: string;
      status: string;
      updated_at: string;
      selected: boolean;
    }[]
  >([...props.data].map((row) => ({ ...row, selected: false })));

  const [filteredData, setFilteredData] = useState<
    {
      id: number;
      type: string;
      service: string;
      asset: string;
      status: string;
      updated_at: string;
      selected: boolean;
    }[]
  >(allData);

  const [showExportFFDialog, setshowExportFFDialog] = useState(false);

  const [showExportConfDialog, setShowExportConfDialog] = useState(false);

  const [selectedExportFormat, setselectedExportFormat] = useState('CSV');

  const handleExportFFClick = () => {
    setshowExportFFDialog(true);
  };

  const confirmExportFF = (format: string) => {
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
          type: row.type,
          service: row.service,
          asset: row.asset,
          status: row.status,
          updated_at: row.updated_at,
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
    selectedRows: {
      type: string;
      service: string;
      asset: string;
      status: string;
      updated_at: string;
    }[],
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
        console.log('Export successful');
      } else {
        console.log(response);
        console.error('Export failed');
      }
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  return (
    <Widget title="Request History">
      <section className="flex flex-col max-h-screen overflow-y-auto bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-wrap gap-4 mb-4">
          <button
            className={
              allData.filter((row) => row.selected === true).length === 0
                ? 'px-4 py-2 bg-gray-300 rounded-lg text-sm cursor-not-allowed opacity-50'
                : 'px-4 py-2 bg-green-600 rounded-lg text-sm text-white hover:bg-green-700'
            }
            onClick={() => handleExportFFClick()}
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
