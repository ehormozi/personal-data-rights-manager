'use client';

import { useState } from 'react';
import Widget from '@/components/material/widget';
import ConfirmationDialog from '@/components/material/confirmation-dialog';
import FileFormatDialog from '@/components/material/file-format-dialog';
import Datatable from '@/components/material/datatable';
import WhiteBox from '@/components/material/white-box';

export default function SupportHistoryClient(props: {
  statuses: string[];
  data: {
    id: number;
    subject: string;
    message: string;
    status: string;
    updated_at: string;
  }[];
}) {
  const statusColors: Record<string, string> = {
    Pending: 'bg-yellow-100 text-yellow-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    'Awaiting User Response': 'bg-blue-100 text-blue-800',
    Escalated: 'bg-red-100 text-red-800',
    Resolved: 'bg-green-100 text-green-800',
    Closed: 'bg-green-100 text-green-800',
    Reopened: 'bg-blue-100 text-blue-800',
    Canceled: 'bg-yellow-100 text-yellow-800',
  };

  const columns = [
    {
      key: 'subject',
      label: 'Subject',
      type: 'string',
      filter: false,
    },
    {
      key: 'message',
      label: 'Message',
      type: 'string',
      filter: false,
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
      subject: string;
      message: string;
      status: string;
      updated_at: string;
      selected: boolean;
    }[]
  >(
    [...props.data].map((row) => ({
      ...row,
      selected: false,
    })),
  );

  const [filteredData, setFilteredData] = useState<typeof allData>(allData);

  const [selectedRow, setSelectedRow] = useState<number>();

  const [showExportFFDialog, setShowExportFFDialog] = useState(false);

  const [showExportConfDialog, setShowExportConfDialog] = useState(false);

  const [selectedExportFormat, setselectedExportFormat] = useState('CSV');

  const handleExportFFClick = () => {
    setShowExportFFDialog(true);
  };

  const confirmExportFF = (format: string) => {
    setselectedExportFormat(format);
    setShowExportConfDialog(true);
  };

  const cancelExportFF = () => {
    setShowExportFFDialog(false);
  };

  const confirmExportConf = () => {
    handleExport(
      filteredData
        .filter((row) => row.selected === true)
        .map((row) => ({
          subject: row.subject,
          message: row.message,
          status: row.status,
          updated_at: row.updated_at,
        })),
      selectedExportFormat,
    );
    setShowExportConfDialog(false);
    setShowExportFFDialog(false);
  };

  const cancelExportConf = () => {
    setShowExportConfDialog(false);
  };

  const handleExport = async (
    selectedRows: {
      subject: string;
      message: string;
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
      } else {
        console.log(response);
        console.error('Export failed');
      }
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  return (
    <Widget title="Your Support History">
      <WhiteBox className="p-4 max-h-screen overflow-y-auto">
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
      </WhiteBox>
    </Widget>
  );
}
