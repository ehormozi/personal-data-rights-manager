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
    action: string;
  }[];
}) {
  const statusColors: Record<string, string> = {
    Pending: 'text-yellow-600',
    'In Progress': 'text-yellow-600',
    Completed: 'text-green-600',
    Failed: 'text-red-600',
    Cancelled: 'text-red-600',
    'Awaiting User Action': 'text-yellow-600',
    Rejected: 'text-red-600',
    Delayed: 'text-yellow-600',
    Scheduled: 'text-yellow-600',
    Expired: 'text-yellow-600',
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
    {
      key: 'actions',
      label: 'Actions',
      type: 'button',
      filter: false,
    },
  ];

  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const [showResendDialog, setShowResendDialog] = useState(false);

  const [showCancelScheduleDialog, setShowCancelScheduleDialog] =
    useState(false);

  const [showResubmitDialog, setShowResubmitDialog] = useState(false);

  const handleCancelRequest = (id: number) => {
    console.log(`Cancel request with ID: ${id}`);
    // Add API call to cancel the request
  };

  const handleResend = (id: number) => {
    console.log(`Resend request with ID: ${id}`);
    // Add API call to cancel the request
  };

  const handleDownloadData = (id: number) => {
    console.log(`DownloadData request with ID: ${id}`);
    // Add API call to cancel the request
  };

  const handleEdit = (id: number) => {
    console.log(`Edit request with ID: ${id}`);
    // Add API call to cancel the request
  };

  const handleProvideDetails = (id: number) => {
    console.log(`ProvideDetails request with ID: ${id}`);
    // Add API call to cancel the request
  };

  const handleContactSupport = (id: number) => {
    console.log(`ContactSupport request with ID: ${id}`);
    // Add API call to cancel the request
  };

  const handleSetNotification = (id: number) => {
    console.log(`NotifyMe request with ID: ${id}`);
    // Add API call to cancel the request
  };

  const handleCancelSchedule = (id: number) => {
    console.log(`CancelSchedule request with ID: ${id}`);
    // Add API call to cancel the request
  };

  const handleResubmit = (id: number) => {
    console.log(`Resubmit request with ID: ${id}`);
    // Add API call to cancel the request
  };

  const handleViewErrorDetails = (id: number) => {
    console.log(`ViewErrorDetails request with ID: ${id}`);
    // Add API call to cancel the request
  };

  const handleViewDetails = (id: number) => {
    console.log(`ViewDetails request with ID: ${id}`);
    // Add API call to cancel the request
  };

  const actions = [
    {
      key: 'Cancel',
      bgColor: 'bg-red-500',
      hoverColor: 'hover:bg-red-600',
      showDialog: showCancelDialog,
      setShowDialog: setShowCancelDialog,
      handleConfirm: handleCancelRequest,
      title: 'Cancel Request',
      message:
        'Are you sure you want to cancel this request? This action cannot be undone.',
      confirmLabel: 'Yes, Cancel',
      cancelLabel: 'No, Keep It',
    },
    {
      key: 'Resend',
      bgColor: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      showDialog: showResendDialog,
      setShowDialog: setShowResendDialog,
      handleConfirm: handleResend,
      title: 'Resend Request',
      message:
        'Are you sure you want to resend this request? This will retry the request with the same details.',
      confirmLabel: 'Yes, Resend',
      cancelLabel: 'Cancel',
    },
    {
      key: 'Download Results',
      bgColor: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      handleConfirm: handleDownloadData,
    },
    {
      key: 'Edit',
      bgColor: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      handleConfirm: handleEdit,
    },
    {
      key: 'Provide Details',
      bgColor: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      handleConfirm: handleProvideDetails,
    },
    {
      key: 'Contact Support',
      bgColor: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      handleConfirm: handleContactSupport,
    },
    {
      key: 'Notify Me',
      bgColor: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      handleConfirm: handleSetNotification,
    },
    {
      key: 'Cancel Schedule',
      bgColor: 'bg-red-500',
      hoverColor: 'hover:bg-red-600',
      showDialog: showCancelScheduleDialog,
      setShowDialog: setShowCancelScheduleDialog,
      handleConfirm: handleCancelSchedule,
      title: 'Cancel Scheduled Request',
      message:
        'Are you sure you want to cancel this scheduled request? This action cannot be undone.',
      confirmLabel: 'Yes, Cancel Schedule',
      cancelLabel: 'Keep Schedule',
    },
    {
      key: 'Resubmit',
      bgColor: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      showDialog: showResubmitDialog,
      setShowDialog: setShowResubmitDialog,
      handleConfirm: handleResubmit,
      title: 'Resubmit Request',
      message:
        'Are you sure you want to resubmit this request? This will restart the process.',
      confirmLabel: 'Yes, Resubmit',
      cancelLabel: 'Cancel',
    },
    {
      key: 'View Error Details',
      bgColor: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      handleConfirm: handleViewErrorDetails,
    },
    {
      key: 'View Details',
      bgColor: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      handleConfirm: handleViewDetails,
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
      actions: any;
    }[]
  >(
    [...props.data].map((row) => ({
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

  const [filteredData, setFilteredData] = useState<
    {
      id: number;
      type: string;
      service: string;
      asset: string;
      status: string;
      updated_at: string;
      selected: boolean;
      actions: any;
    }[]
  >(allData);

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
          type: row.type,
          service: row.service,
          asset: row.asset,
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
      </section>
    </Widget>
  );
}
