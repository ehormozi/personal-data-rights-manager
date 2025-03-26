'use client';

import { useState } from 'react';

import Widget from '@/components/server/widget';
import WhiteBox from '@/components/server/white-box';
import ConfirmationDialog from '@/components/server/confirmation-dialog';
import FileFormatDialog from '@/components/client/file-format-dialog';
import Datatable from '@/components/client/datatable';

type PermissionsDetailsClientProps = {
  services: string[];
  assets: string[];
  data: {
    id: number;
    service: string;
    asset: string;
    sensitivity: number;
    sensitivityLabel: string;
  }[];
  prefilter?: string;
};

const PermissionsDetailsClient: React.FC<PermissionsDetailsClientProps> = ({
  services,
  assets,
  data,
  prefilter,
}) => {
  const sensitivityColors: Record<string, string> = {
    Low: 'text-green-500',
    Medium: 'text-yellow-500',
    High: 'text-red-500',
  };

  const columns = [
    typeof prefilter === 'undefined'
      ? {
          key: 'service',
          label: 'Service',
          type: 'string',
          filter: true,
          distinctValues: services,
          placeholder: 'Select Service',
        }
      : {
          key: 'service',
          label: 'Service',
          type: 'string',
          filter: true,
          distinctValues: services,
          placeholder: 'Select Service',
          prefilters: [prefilter],
        },
    {
      key: 'asset',
      label: 'Asset',
      type: 'string',
      filter: true,
      distinctValues: assets,
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
  ];

  const [allData, setAllData] = useState<
    {
      id: number;
      service: string;
      asset: string;
      sensitivity: number;
      sensitivityLabel: string;
      selected: boolean;
    }[]
  >([...data].map((row) => ({ ...row, selected: false })));

  const [filteredData, setFilteredData] = useState<
    {
      id: number;
      service: string;
      asset: string;
      sensitivity: number;
      sensitivityLabel: string;
      selected: boolean;
    }[]
  >(
    !prefilter
      ? allData
      : [...allData]
          .map((row) => ({ ...row, selected: false }))
          .filter((row) => row.service === prefilter),
  );

  const [showRevokeDialog, setShowRevokeDialog] = useState(false);

  const [showDDRDialog, setShowDDRDialog] = useState(false);

  const [showExportFFDialog, setshowExportFFDialog] = useState(false);

  const [showExportConfDialog, setShowExportConfDialog] = useState(false);

  const [selectedExportFormat, setselectedExportFormat] = useState('CSV');

  const handleRevokePermissionsClick = (
    permissions: { service: string; asset: string }[],
  ) => {
    setShowRevokeDialog(true);
  };

  const confirmRevokePermissions = () => {
    // Call API to revoke permissions
    setShowRevokeDialog(false);
  };

  const cancelRevokePermissions = () => {
    setShowRevokeDialog(false);
  };

  const handleDDRClick = (
    permissions: { service: string; asset: string }[],
  ) => {
    setShowDDRDialog(true);
  };

  const confirmDDR = () => {
    // Call API to revoke permissions
    setShowDDRDialog(false);
  };

  const cancelDDR = () => {
    setShowDDRDialog(false);
  };

  const handleExportFFClick = (
    permissions: { service: string; asset: string }[],
  ) => {
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
          service: row.service,
          asset: row.asset,
          sensitivity: row.sensitivityLabel,
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
    selectedRows: { service: string; asset: string }[],
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
    <Widget title="Permissions Details">
      <WhiteBox className="flex flex-col max-h-screen overflow-y-auto p-4">
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
                  .map((row) => ({ service: row.service, asset: row.asset })),
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
                  .map((row) => ({ service: row.service, asset: row.asset })),
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
                  .map((row) => ({ service: row.service, asset: row.asset })),
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
      </WhiteBox>
    </Widget>
  );
};

export default PermissionsDetailsClient;
