'use client';

import { useState } from 'react';
import {
  ArrowsUpDownIcon,
  ArrowLongUpIcon,
  ArrowLongDownIcon,
} from '@heroicons/react/24/outline';
import Multiselect from 'multiselect-react-dropdown';
import Widget from '@/components/material/widget';

export default function PermissionsTableClient(props: {
  services: string[];
  assets: string[];
  data: { service: string; permissions: string; sensitivity: number }[];
}) {
  const sensitivityLabels: Record<number, string> = {
    1: 'Low',
    2: 'Medium',
    3: 'High',
  };

  const sensitivityColors: Record<string, string> = {
    Low: 'text-green-500',
    Medium: 'text-yellow-500',
    High: 'text-red-500',
  };

  const formattedData = [...props.data].map((value) => {
    return {
      service: value.service,
      permissions: value.permissions,
      sensitivityID: value.sensitivity,
      sensitivity: sensitivityLabels[value.sensitivity],
    };
  });

  const [data, setData] =
    useState<{ service: string; permissions: string; sensitivity: string }[]>(
      formattedData,
    );

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: string;
  } | null>(null);

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [selectedSensitivities, setSelectedSensitivities] = useState<string[]>(
    [],
  );

  const renderSortIcon = (key: string) => {
    if (sortConfig && sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? (
        <ArrowLongUpIcon className="h-6 w-6" />
      ) : (
        <ArrowLongDownIcon className="h-6 w-6" />
      );
    }
    return <ArrowsUpDownIcon className="h-6 w-6" />;
  };

  const renderMultiSelect = (
    options: Array<String>,
    onSelect: (selectedList: any, selectedItem: any) => void,
    onRemove: (selectedList: any, selectedItem: any) => void,
    placeholder: string,
  ) => {
    return (
      <Multiselect
        isObject={false}
        options={options}
        onSelect={onSelect}
        onRemove={onRemove}
        placeholder={placeholder}
        style={{
          multiselectContainer: {
            marginTop: '8px',
          },
          searchBox: {
            backgroundColor: 'rgb(255,255,255)',
          },
          inputField: {
            width: '192px',
          },
          option: {
            padding: '6px',
            fontWeight: '600',
          },
        }}
      />
    );
  };

  const sortData = (key: string) => {
    let direction = 'asc';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'asc'
    ) {
      direction = 'desc';
    }
    setData(
      [...data].sort((a, b) => {
        if (a[key as keyof typeof a] < b[key as keyof typeof b]) {
          return direction === 'asc' ? -1 : 1;
        }
        if (a[key as keyof typeof a] > b[key as keyof typeof b]) {
          return direction === 'asc' ? 1 : -1;
        }
        return 0;
      }),
    );
    setSortConfig({ key, direction });
  };

  function intersection(arr1: string[], arr2: string[]): string[] {
    return arr1.filter((val1) => {
      return arr2.find((val2) => val1 === val2);
    });
  }

  const onSelectService = (selectedList: Array<string>) => {
    setSelectedServices(selectedList);
    setData(
      [...formattedData].filter((row) => {
        let res = selectedList.includes(row.service);
        if (selectedAssets.length > 0) {
          res =
            res &&
            intersection(selectedAssets, row.permissions.split(', ')).length >
              0;
        }
        if (selectedSensitivities.length > 0) {
          res = res && selectedSensitivities.includes(row.sensitivity);
        }
        return res;
      }),
    );
  };

  const onRemoveService = (selectedList: Array<string>) => {
    setSelectedServices(selectedList);
    setData(
      [...formattedData].filter((row) => {
        let res = true;
        if (selectedList.length > 0) {
          res = selectedList.includes(row.service);
        }
        if (selectedAssets.length > 0) {
          res =
            res &&
            intersection(selectedAssets, row.permissions.split(', ')).length >
              0;
        }
        if (selectedSensitivities.length > 0) {
          res = res && selectedSensitivities.includes(row.sensitivity);
        }
        return res;
      }),
    );
  };

  const onSelectPermission = (selectedList: Array<string>) => {
    setSelectedAssets(selectedList);
    setData(
      [...formattedData].filter((row) => {
        let res =
          intersection(selectedList, row.permissions.split(', ')).length > 0;
        if (selectedServices.length > 0) {
          res = res && selectedServices.includes(row.service);
        }
        if (selectedSensitivities.length > 0) {
          res = res && selectedSensitivities.includes(row.sensitivity);
        }
        return res;
      }),
    );
  };

  const onRemovePermission = (selectedList: Array<string>) => {
    setSelectedAssets(selectedList);
    setData(
      [...formattedData].filter((row) => {
        let res = true;
        if (selectedList.length > 0) {
          res =
            intersection(selectedList, row.permissions.split(', ')).length > 0;
        }
        if (selectedServices.length > 0) {
          res = res && selectedServices.includes(row.service);
        }
        if (selectedSensitivities.length > 0) {
          res = res && selectedSensitivities.includes(row.sensitivity);
        }
        return res;
      }),
    );
  };

  const onSelectSensitivity = (selectedList: Array<string>) => {
    setSelectedSensitivities(selectedList);
    setData(
      [...formattedData].filter((row) => {
        let res = selectedList.includes(row.sensitivity);
        if (selectedServices.length > 0) {
          res = res && selectedServices.includes(row.service);
        }
        if (selectedAssets.length > 0) {
          res =
            res &&
            intersection(selectedAssets, row.permissions.split(', ')).length >
              0;
        }
        return res;
      }),
    );
  };

  const onRemoveSensitivity = (selectedList: Array<string>) => {
    setSelectedSensitivities(selectedList);
    setData(
      [...formattedData].filter((row) => {
        let res = true;
        if (selectedList.length > 0) {
          res = selectedList.includes(row.sensitivity);
        }
        if (selectedServices.length > 0) {
          res = res && selectedServices.includes(row.service);
        }
        if (selectedAssets.length > 0) {
          res =
            res &&
            intersection(selectedAssets, row.permissions.split(', ')).length >
              0;
        }
        return res;
      }),
    );
  };

  return (
    <Widget title="Permissions Table">
      <section className="flex flex-col bg-white p-4 rounded-lg shadow-md">
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-200 p-2 text-left text-gray-800 hover:bg-gray-200 cursor-pointer">
                <div
                  className="flex items-center justify-between"
                  onClick={() => sortData('service')}
                >
                  <span>Service</span>
                  {renderSortIcon('service')}
                </div>
                {renderMultiSelect(
                  props.services.sort((a, b) => {
                    if (a < b) {
                      return -1;
                    }
                    if (a > b) {
                      return 1;
                    }
                    return 0;
                  }),
                  onSelectService,
                  onRemoveService,
                  'Select Service',
                )}
              </th>
              <th className="border border-gray-200 p-2 text-left text-gray-800 hover:bg-gray-200 cursor-pointer w-1/2">
                <div
                  className="flex items-center justify-between"
                  onClick={() => sortData('permissions')}
                >
                  <span>Permissions</span>
                  {renderSortIcon('permissions')}
                </div>
                {renderMultiSelect(
                  props.assets.sort((a, b) => {
                    if (a < b) {
                      return -1;
                    }
                    if (a > b) {
                      return 1;
                    }
                    return 0;
                  }),
                  onSelectPermission,
                  onRemovePermission,
                  'Filter by Permissions',
                )}
              </th>
              <th className="border border-gray-200 p-2 text-left text-gray-800 hover:bg-gray-200 cursor-pointer">
                <div
                  className="flex items-center justify-between"
                  onClick={() => sortData('sensitivityID')}
                >
                  <span>Sensitivity</span>
                  {renderSortIcon('sensitivityID')}
                </div>
                {renderMultiSelect(
                  ['Low', 'Medium', 'High'],
                  onSelectSensitivity,
                  onRemoveSensitivity,
                  'Select Sensitivity',
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
              >
                <td className="border border-gray-200 p-2 text-gray-600">
                  {row.service}
                </td>
                <td className="border border-gray-200 p-2 text-gray-600">
                  {row.permissions}
                </td>
                <td
                  className={`border border-gray-200 p-2 ${sensitivityColors[row.sensitivity]}`}
                >
                  {row.sensitivity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </Widget>
  );
}
