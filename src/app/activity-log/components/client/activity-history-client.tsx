'use client';

import { useState } from 'react';

import Widget from '@/components/server/widget';
import ConfirmationDialog from '@/components/server/confirmation-dialog';
import FileFormatDialog from '@/components/client/file-format-dialog';
import Datatable from '@/components/client/datatable';
import WhiteBox from '@/components/server/white-box';

type ActivityHistoryClientProps = {
  categories: string[];
  events: string[];
  data: {
    id: number;
    time: string;
    category: string;
    event: string;
    details: string;
    action: string;
  }[];
};

const ActivityHistoryClient: React.FC<ActivityHistoryClientProps> = ({
  categories,
  events,
  data,
}) => {
  const columns = [
    {
      key: 'time',
      label: 'Time',
      type: 'string',
      filter: false,
    },
    {
      key: 'category',
      label: 'Category',
      type: 'string',
      filter: true,
      distinctValues: categories,
      placeholder: 'Select Category',
    },
    {
      key: 'event',
      label: 'Event',
      type: 'string',
      filter: true,
      distinctValues: events,
      placeholder: 'Select Event',
    },
    {
      key: 'details',
      label: 'Details',
      type: 'string',
      filter: false,
    },
    {
      key: 'actions',
      label: 'Actions',
      type: 'button',
      filter: false,
    },
  ];

  const [showUndoDialog, setShowUndoDialog] = useState(false);

  const [showCancelRequestDialog, setShowCancelRequestDialog] = useState(false);

  const [showResendRequestDialog, setShowResendRequestDialog] = useState(false);

  const handleViewSession = (id: number) => {
    console.log(`ViewSession with ID: ${id}`);
    // Add API call
  };

  const handleViewDetails = (id: number) => {
    console.log(`ViewDetails with ID: ${id}`);
    // Add API call
  };

  const handleUndo = (id: number) => {
    console.log(`Undo with ID: ${id}`);
    // Add API call
  };

  const handleCancelRequest = (id: number) => {
    console.log(`CancelRequest with ID: ${id}`);
    // Add API call
  };

  const handleResendRequest = (id: number) => {
    console.log(`ResendRequest with ID: ${id}`);
    // Add API call
  };

  const handleReportIssue = (id: number) => {
    console.log(`ReportIssue with ID: ${id}`);
    // Add API call
  };

  const handleAcknowledge = (id: number) => {
    console.log(`Acknowledge with ID: ${id}`);
    // Add API call
  };

  const actions = [
    {
      key: 'View Session',
      bgColor: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      handleConfirm: handleViewSession,
    },
    {
      key: 'View Details',
      bgColor: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      handleConfirm: handleViewDetails,
    },
    {
      key: 'Undo',
      bgColor: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      showDialog: showUndoDialog,
      setShowDialog: setShowUndoDialog,
      handleConfirm: handleUndo,
      title: 'Undo',
      message: 'Are you sure you want to undo this action?',
      confirmLabel: 'Yes, Undo',
      cancelLabel: 'Cancel',
    },
    {
      key: 'Cancel Request',
      bgColor: 'bg-red-500',
      hoverColor: 'hover:bg-red-600',
      showDialog: showCancelRequestDialog,
      setShowDialog: setShowCancelRequestDialog,
      handleConfirm: handleCancelRequest,
      title: 'Cancel Request',
      message:
        'Are you sure you want to cancel this request? This action cannot be undone.',
      confirmLabel: 'Yes, Cancel',
      cancelLabel: 'No, Keep It',
    },
    {
      key: 'Resend Request',
      bgColor: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      showDialog: showResendRequestDialog,
      setShowDialog: setShowResendRequestDialog,
      handleConfirm: handleResendRequest,
      title: 'Resend Request',
      message:
        'Are you sure you want to resend this request? This will retry the request with the same details.',
      confirmLabel: 'Yes, Resend',
      cancelLabel: 'Cancel',
    },
    {
      key: 'Report Issue',
      bgColor: 'bg-red-500',
      hoverColor: 'hover:bg-red-600',
      handleConfirm: handleReportIssue,
    },
    {
      key: 'Acknowledge',
      bgColor: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      handleConfirm: handleAcknowledge,
    },
  ];

  const [allData, setAllData] = useState<
    {
      id: number;
      time: string;
      category: string;
      event: string;
      details: string;
      selected: boolean;
      actions: any;
    }[]
  >(
    [...data].map((row) => ({
      ...row,
      selected: false,
      actions: row.action.split(', ').map((action, index) => (
        <button
          key={index}
          className={`w-full py-1 px-3 my-1 mx-1 text-white rounded-lg text-sm
            ${actions.find((a) => a.key === action)?.bgColor}
            ${actions.find((a) => a.key === action)?.hoverColor}`}
          onClick={() => {
            const a = actions.find((a) => a.key === action);
            if (a) {
              setSelectedRow(row.id);
              if (a.showDialog !== undefined) {
                showConfirmationDialog(a.key);
              } else {
                a.handleConfirm(row.id);
              }
            }
          }}
        >
          {action}
        </button>
      )),
    })),
  );

  const [filteredData, setFilteredData] = useState<typeof allData>(allData);

  const [selectedRow, setSelectedRow] = useState<number>();

  const [showExportFFDialog, setShowExportFFDialog] = useState(false);

  const [showExportConfDialog, setShowExportConfDialog] = useState(false);

  const [selectedExportFormat, setselectedExportFormat] = useState('CSV');

  const showConfirmationDialog = (action: string) => {
    const actionObj = actions.find((a) => a.key === action);
    if (actionObj && actionObj.setShowDialog) {
      actionObj.setShowDialog(true);
    }
  };

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
          time: row.time,
          category: row.category,
          event: row.event,
          details: row.details,
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
      time: string;
      category: string;
      event: string;
      details: string;
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
    <Widget title="Activity History">
      <WhiteBox className="flex flex-col max-h-screen overflow-y-auto p-4">
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
        {actions
          .filter((action) => action.showDialog)
          .map(
            (action, index) =>
              action.showDialog && (
                <ConfirmationDialog
                  key={index}
                  title={action.title}
                  message={action.message}
                  confirmLabel={action.confirmLabel}
                  cancelLabel={action.cancelLabel}
                  onConfirm={() => {
                    if (selectedRow) {
                      action.handleConfirm(selectedRow);
                    }
                    action.setShowDialog(false);
                  }}
                  onCancel={() => {
                    action.setShowDialog(false);
                  }}
                />
              ),
          )}
      </WhiteBox>
    </Widget>
  );
};

export default ActivityHistoryClient;
