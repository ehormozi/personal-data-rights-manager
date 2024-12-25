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
  data: { service: string; asset: string; sensitivity: number }[];
}) {
  const sensitivityLabels: Record<number, string> = {
    1: 'Low',
    2: 'Medium',
    3: 'High',
  };

  const sensitivityColors: Record<string, string> = {
    1: 'text-green-500',
    2: 'text-yellow-500',
    3: 'text-red-500',
  };

  const [allData, setAllData] = useState<
    {
      selected: boolean;
      service: string;
      asset: string;
      sensitivityID: number;
      sensitivity: string;
    }[]
  >(
    [...props.data].map((value) => {
      return {
        selected: false,
        service: value.service,
        asset: value.asset,
        sensitivityID: value.sensitivity,
        sensitivity: sensitivityLabels[value.sensitivity],
      };
    }),
  );

  const [filteredData, setFilteredData] = useState<
    {
      selected: boolean;
      service: string;
      asset: string;
      sensitivityID: number;
      sensitivity: string;
    }[]
  >(allData);

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: string;
  } | null>(null);

  const [selectedServices, setSelectedServices] = useState<Set<string>>(
    new Set(),
  );

  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());

  const [selectedSensitivities, setSelectedSensitivities] = useState<
    Set<string>
  >(new Set());

  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const [selectAll, setSelectAll] = useState(false);

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
    setFilteredData(
      [...filteredData].sort((a, b) => {
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

  const onSelectService = (selectedList: Array<string>) => {
    setSelectedServices(new Set(selectedList));
    const nextFilteredData = [...allData].filter((row) => {
      let res = selectedList.includes(row.service);
      if (selectedAssets.size > 0) {
        res = res && selectedAssets.has(row.asset);
      }
      if (selectedSensitivities.size > 0) {
        res = res && selectedSensitivities.has(row.sensitivity);
      }
      return res;
    });
    setFilteredData(nextFilteredData);
    setSelectAll(!nextFilteredData.some((r) => r.selected === false));
  };

  const onRemoveService = (selectedList: Array<string>) => {
    setSelectedServices(new Set(selectedList));
    const nextFilteredData = [...allData].filter((row) => {
      let res = true;
      if (selectedList.length > 0) {
        res = selectedList.includes(row.service);
      }
      if (selectedAssets.size > 0) {
        res = res && selectedAssets.has(row.asset);
      }
      if (selectedSensitivities.size > 0) {
        res = res && selectedSensitivities.has(row.sensitivity);
      }
      return res;
    });
    setFilteredData(nextFilteredData);
    setSelectAll(!nextFilteredData.some((r) => r.selected === false));
  };

  const onSelectAsset = (selectedList: Array<string>) => {
    setSelectedAssets(new Set(selectedList));
    const nextFilteredData = [...allData].filter((row) => {
      let res = selectedList.includes(row.asset);
      if (selectedServices.size > 0) {
        res = res && selectedServices.has(row.service);
      }
      if (selectedSensitivities.size > 0) {
        res = res && selectedSensitivities.has(row.sensitivity);
      }
      return res;
    });
    setFilteredData(nextFilteredData);
    setSelectAll(!nextFilteredData.some((r) => r.selected === false));
  };

  const onRemoveAsset = (selectedList: Array<string>) => {
    setSelectedAssets(new Set(selectedList));
    const nextFilteredData = [...allData].filter((row) => {
      let res = true;
      if (selectedList.length > 0) {
        res = selectedList.includes(row.asset);
      }
      if (selectedServices.size > 0) {
        res = res && selectedServices.has(row.service);
      }
      if (selectedSensitivities.size > 0) {
        res = res && selectedSensitivities.has(row.sensitivity);
      }
      return res;
    });
    setFilteredData(nextFilteredData);
    setSelectAll(!nextFilteredData.some((r) => r.selected === false));
  };

  const onSelectSensitivity = (selectedList: Array<string>) => {
    setSelectedSensitivities(new Set(selectedList));
    const nextFilteredData = [...allData].filter((row) => {
      let res = selectedList.includes(row.sensitivity);
      if (selectedServices.size > 0) {
        res = res && selectedServices.has(row.service);
      }
      if (selectedAssets.size > 0) {
        res = res && selectedAssets.has(row.asset);
      }
      return res;
    });
    setFilteredData(nextFilteredData);
    setSelectAll(!nextFilteredData.some((r) => r.selected === false));
  };

  const onRemoveSensitivity = (selectedList: Array<string>) => {
    setSelectedSensitivities(new Set(selectedList));
    const nextFilteredData = [...allData].filter((row) => {
      let res = true;
      if (selectedList.length > 0) {
        res = selectedList.includes(row.sensitivity);
      }
      if (selectedServices.size > 0) {
        res = res && selectedServices.has(row.service);
      }
      if (selectedAssets.size > 0) {
        res = res && selectedAssets.has(row.asset);
      }
      return res;
    });
    setFilteredData(nextFilteredData);
    setSelectAll(!nextFilteredData.some((r) => r.selected === false));
  };

  const handleSelectAll = () => {
    const nextAllData = allData.map((v) => {
      if (
        filteredData.filter(
          (v2) => v.service === v2.service && v.asset === v2.asset,
        ).length > 0
      ) {
        return {
          selected: !selectAll,
          service: v.service,
          asset: v.asset,
          sensitivityID: v.sensitivityID,
          sensitivity: v.sensitivity,
        };
      } else {
        return {
          selected: v.selected,
          service: v.service,
          asset: v.asset,
          sensitivityID: v.sensitivityID,
          sensitivity: v.sensitivity,
        };
      }
    });
    setAllData(nextAllData);
    const nextFilteredData = filteredData.map((v) => {
      return {
        selected: !selectAll,
        service: v.service,
        asset: v.asset,
        sensitivityID: v.sensitivityID,
        sensitivity: v.sensitivity,
      };
    });
    setFilteredData(nextFilteredData);
    if (selectAll) {
      setSelectedRows(
        selectedRows.difference(new Set(filteredData.map((_, index) => index))),
      );
    } else {
      setSelectedRows(
        selectedRows.union(new Set(filteredData.map((_, index) => index))),
      );
    }
    setSelectAll(!selectAll);
  };

  const handleRowSelect = (index: number) => {
    const nextAllData = allData.map((v, i) => {
      if (i === index) {
        return {
          selected: !selectedRows.has(index),
          service: v.service,
          asset: v.asset,
          sensitivityID: v.sensitivityID,
          sensitivity: v.sensitivity,
        };
      } else {
        return {
          selected: v.selected,
          service: v.service,
          asset: v.asset,
          sensitivityID: v.sensitivityID,
          sensitivity: v.sensitivity,
        };
      }
    });
    setAllData(nextAllData);
    const nextFilteredData = filteredData.map((v, i) => {
      if (i === index) {
        return {
          selected: !selectedRows.has(index),
          service: v.service,
          asset: v.asset,
          sensitivityID: v.sensitivityID,
          sensitivity: v.sensitivity,
        };
      } else {
        return {
          selected: v.selected,
          service: v.service,
          asset: v.asset,
          sensitivityID: v.sensitivityID,
          sensitivity: v.sensitivity,
        };
      }
    });
    setFilteredData(nextFilteredData);
    setSelectAll(!nextFilteredData.some((r) => r.selected === false));
    const updatedSelection = new Set(selectedRows);
    if (updatedSelection.has(index)) {
      updatedSelection.delete(index);
    } else {
      updatedSelection.add(index);
    }
    setSelectedRows(updatedSelection);
  };

  return (
    <Widget title="Permissions Table">
      <section className="flex flex-col max-h-screen overflow-y-auto bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-wrap gap-4 mb-4">
          <button
            className={
              selectedRows.size === 0
                ? 'px-4 py-2 bg-gray-300 rounded-lg text-sm cursor-not-allowed opacity-50'
                : 'px-4 py-2 bg-red-600 rounded-lg text-sm text-white hover:bg-red-700'
            }
            onClick={() =>
              console.log('Revoke permissions for:', [...selectedRows])
            }
            disabled={selectedRows.size === 0}
          >
            Revoke Permissions
          </button>
          <button
            className={
              selectedRows.size === 0
                ? 'px-4 py-2 bg-gray-300 rounded-lg text-sm cursor-not-allowed opacity-50'
                : 'px-4 py-2 bg-yellow-600 rounded-lg text-sm text-white hover:bg-yellow-700'
            }
            onClick={() =>
              console.log('Send data deletion requests for:', [...selectedRows])
            }
            disabled={selectedRows.size === 0}
          >
            Send Data Deletion Requests
          </button>
          <button
            className={
              selectedRows.size === 0
                ? 'px-4 py-2 bg-gray-300 rounded-lg text-sm cursor-not-allowed opacity-50'
                : 'px-4 py-2 bg-green-600 rounded-lg text-sm text-white hover:bg-green-700'
            }
            onClick={() => console.log('Export data for:', [...selectedRows])}
            disabled={selectedRows.size === 0}
          >
            Export Data
          </button>
        </div>
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-200 p-2 text-center text-gray-800">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-blue-600"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
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
                  onClick={() => sortData('asset')}
                >
                  <span>Data</span>
                  {renderSortIcon('asset')}
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
                  onSelectAsset,
                  onRemoveAsset,
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
            {filteredData.map((row, index) => (
              <tr
                key={index}
                className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
              >
                <td className="border border-gray-200 p-2 text-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-blue-600"
                    checked={row.selected}
                    onChange={() => handleRowSelect(index)}
                  />
                </td>
                <td className="border border-gray-200 p-2 text-gray-600">
                  {row.service}
                </td>
                <td className="border border-gray-200 p-2 text-gray-600">
                  {row.asset}
                </td>
                <td
                  className={`border border-gray-200 p-2 ${sensitivityColors[row.sensitivityID]}`}
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
