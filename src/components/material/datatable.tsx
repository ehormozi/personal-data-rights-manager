'use client';

import { useState } from 'react';
import Multiselect from 'multiselect-react-dropdown';
import {
  ArrowLongDownIcon,
  ArrowLongUpIcon,
  ArrowsUpDownIcon,
} from '@heroicons/react/24/outline';

export default function Datatable(props: {
  columns: {
    key: string;
    label: string;
    type: string;
    distinctValues: string[];
    placeholder: string;
    sortKey?: string;
    colorMap?: Record<string, string>;
    prefilters?: string[];
  }[];
  allData: Record<string, string | number | boolean>[];
  filteredData: Record<string, string | number | boolean>[];
  setAllData: any;
  setFilteredData: any;
}) {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: string;
  } | null>(null);

  const [selectedOptions, setSelectedOptions] = useState<
    Set<{ column: string; value: string | number | boolean }>
  >(
    new Set(
      props.columns
        .filter((column) => typeof column.prefilters != 'undefined')
        .map((column) => ({
          column: column.key,
          value: column.prefilters![0],
        })),
    ),
  );

  const [selectAll, setSelectAll] = useState(false);

  const handleSortData = (key: string) => {
    let direction = 'asc';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'asc'
    ) {
      direction = 'desc';
    }
    props.setFilteredData(
      [...props.filteredData].sort((a, b) => {
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

  const handleSelectOption = (selectedItem: {
    column: string;
    value: string;
  }) => {
    const nextSelectedOptions = selectedOptions.add(selectedItem);
    setSelectedOptions(nextSelectedOptions);
    const selectedOptionsArr = [...nextSelectedOptions];
    const nextFilteredData = [...props.allData].filter((row) => {
      let res = true;
      props.columns.forEach((column) => {
        res =
          res &&
          (selectedOptionsArr.filter((option) => column.key === option.column)
            .length === 0 ||
            selectedOptionsArr
              .filter((option) => column.key === option.column)
              .map((option) => option.value)
              .includes(row[column.key as keyof typeof row]));
      });
      return res;
    });
    props.setFilteredData(nextFilteredData);
    setSelectAll(!nextFilteredData.some((r) => r.selected === false));
  };

  const handleRemoveOption = (removedItem: {
    column: string;
    value: string;
  }) => {
    let nextSelectedOptions = selectedOptions;
    nextSelectedOptions.delete(removedItem);
    setSelectedOptions(nextSelectedOptions);
    const selectedOptionsArr = [...nextSelectedOptions];
    const nextFilteredData = [...props.allData].filter((row) => {
      let res = true;
      props.columns.forEach((column) => {
        res =
          res &&
          (selectedOptionsArr.filter((option) => column.key === option.column)
            .length === 0 ||
            selectedOptionsArr
              .filter((option) => column.key === option.column)
              .map((option) => option.value)
              .includes(row[column.key as keyof typeof row]));
      });
      return res;
    });
    props.setFilteredData(nextFilteredData);
    setSelectAll(!nextFilteredData.some((r) => r.selected === false));
  };

  const handleSelectAll = () => {
    const nextAllData = props.allData.map((v) => {
      if (props.filteredData.filter((v2) => v.id === v2.id).length > 0) {
        let nextV = v;
        nextV.selected = !selectAll;
        return nextV;
      } else {
        return v;
      }
    });
    props.setAllData(nextAllData);
    const nextFilteredData = props.filteredData.map((v) => {
      let nextV = v;
      nextV.selected = !selectAll;
      return nextV;
    });
    props.setFilteredData(nextFilteredData);
    setSelectAll(!selectAll);
  };

  const handleRowSelect = (id: number) => {
    const nextAllData = props.allData.map((row) => {
      if (id === row.id) {
        let nextRow = row;
        nextRow.selected = !row.selected;
        return nextRow;
      } else {
        return row;
      }
    });
    props.setAllData(nextAllData);
    setSelectAll(!props.filteredData.some((r) => r.selected === false));
  };

  const onSortData = (key: string) => {
    handleSortData(key);
  };

  const onSelectOption = (
    selectedList: { column: string; value: string }[],
    selectedItem: { column: string; value: string },
  ) => {
    handleSelectOption(selectedItem);
  };

  const onRemoveOption = (
    selectedList: { column: string; value: string }[],
    removedItem: { column: string; value: string },
  ) => {
    handleRemoveOption(removedItem);
  };

  const onSelectAll = () => {
    handleSelectAll();
  };

  const onRowSelect = (id: number) => {
    handleRowSelect(id);
  };

  const renderMultiSelect = (
    options: { column: string; value: string }[],
    onSelect: (selectedList: any, selectedItem: any) => void,
    onRemove: (selectedList: any, selectedItem: any) => void,
    placeholder: string,
    selectedValues: string[],
  ) => {
    return (
      <Multiselect
        isObject={true}
        options={options}
        displayValue="value"
        onSelect={onSelect}
        onRemove={onRemove}
        placeholder={placeholder}
        selectedValues={selectedValues}
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

  return (
    <table className="w-full border-collapse border border-gray-200">
      <thead className="bg-gray-100">
        <tr>
          <th className="border border-gray-200 p-2 text-center text-gray-800">
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4 text-blue-600"
              checked={selectAll}
              onChange={onSelectAll}
            />
          </th>
          {props.columns.map((column, index) => (
            <th
              key={index}
              className="border border-gray-200 p-2 text-left text-gray-800 hover:bg-gray-200 cursor-pointer"
            >
              <div
                className="flex items-center justify-between"
                onClick={() =>
                  onSortData(
                    typeof column.sortKey === 'string'
                      ? column.sortKey
                      : column.key,
                  )
                }
              >
                <span>{column.label}</span>
                {renderSortIcon(
                  typeof column.sortKey === 'string'
                    ? column.sortKey
                    : column.key,
                )}
              </div>
              {renderMultiSelect(
                column.distinctValues.map((value) => ({
                  column: column.key,
                  value: value,
                })),
                onSelectOption,
                onRemoveOption,
                column.placeholder,
                typeof column.prefilters === 'undefined'
                  ? []
                  : column.prefilters,
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.filteredData.map((row, index) => (
          <tr
            key={index}
            className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
          >
            <td className="border border-gray-200 p-2 text-center">
              <input
                key={index}
                type="checkbox"
                className="form-checkbox h-4 w-4 text-blue-600"
                checked={
                  typeof row.selected === 'boolean' ? row.selected : false
                }
                onChange={() => {
                  onRowSelect(typeof row.id === 'number' ? row.id : 0);
                }}
              />
            </td>
            {props.columns.map((c, i) => (
              <td
                key={i}
                className={`border border-gray-200 p-2 text-gray-600 ${typeof c.colorMap === 'undefined' ? null : c.colorMap[row[c.key].toString()] + ' font-semibold'}`}
              >
                {row[c.key as keyof typeof row]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
