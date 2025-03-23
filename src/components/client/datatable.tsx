'use client';

import { useState } from 'react';
import Multiselect from 'multiselect-react-dropdown';
import {
  ArrowLongDownIcon,
  ArrowLongUpIcon,
  ArrowsUpDownIcon,
} from '@heroicons/react/24/outline';

type DatatableProps = {
  columns: {
    key: string;
    label: string;
    type: string;
    filter: boolean;
    distinctValues?: string[];
    placeholder?: string;
    sortKey?: string;
    colorMap?: Record<string, string>;
    prefilters?: string[];
  }[];
  allData: Record<string, string | number | boolean>[];
  filteredData: Record<string, string | number | boolean>[];
  setAllData: any;
  setFilteredData: any;
};

const Datatable: React.FC<DatatableProps> = ({
  columns,
  allData,
  filteredData,
  setAllData,
  setFilteredData,
}) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: string;
  } | null>(null);

  const [selectedOptions, setSelectedOptions] = useState<
    Set<{ column: string; value: string | number | boolean }>
  >(
    new Set(
      columns
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

  const handleSelectOption = (selectedItem: {
    column: string;
    value: string;
  }) => {
    const nextSelectedOptions = selectedOptions.add(selectedItem);
    setSelectedOptions(nextSelectedOptions);
    const selectedOptionsArr = [...nextSelectedOptions];
    const nextFilteredData = [...allData].filter((row) => {
      let res = true;
      columns.forEach((column) => {
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
    setFilteredData(nextFilteredData);
    setSelectAll(!nextFilteredData.some((r) => r.selected === false));
  };

  const handleRemoveOption = (removedItem: {
    column: string;
    value: string;
  }) => {
    let nextSelectedOptions = new Set(
      Array.from(selectedOptions).filter(
        (e) =>
          !(e.column === removedItem.column && e.value === removedItem.value),
      ),
    );
    setSelectedOptions(nextSelectedOptions);
    const selectedOptionsArr = [...nextSelectedOptions];
    const nextFilteredData = [...allData].filter((row) => {
      let res = true;
      columns.forEach((column) => {
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
    setFilteredData(nextFilteredData);
    setSelectAll(!nextFilteredData.some((r) => r.selected === false));
  };

  const handleSelectAll = () => {
    const nextAllData = allData.map((v) => {
      if (filteredData.filter((v2) => v.id === v2.id).length > 0) {
        let nextV = v;
        nextV.selected = !selectAll;
        return nextV;
      } else {
        return v;
      }
    });
    setAllData(nextAllData);
    const nextFilteredData = filteredData.map((v) => {
      let nextV = v;
      nextV.selected = !selectAll;
      return nextV;
    });
    setFilteredData(nextFilteredData);
    setSelectAll(!selectAll);
  };

  const handleRowSelect = (id: number) => {
    const nextAllData = allData.map((row) => {
      if (id === row.id) {
        let nextRow = row;
        nextRow.selected = !row.selected;
        return nextRow;
      } else {
        return row;
      }
    });
    setAllData(nextAllData);
    setSelectAll(!filteredData.some((r) => r.selected === false));
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
    selectedValues: { column: string; value: string }[],
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
            width: '148px',
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
          {columns.map((column, index) => (
            <th
              key={index}
              className="border border-gray-200 p-2 text-left text-gray-800 hover:bg-gray-200 cursor-pointer"
            >
              <div
                className="flex items-center justify-between"
                onClick={() =>
                  column.type != 'button'
                    ? onSortData(
                        typeof column.sortKey === 'string'
                          ? column.sortKey
                          : column.key,
                      )
                    : {}
                }
              >
                <span
                  className={`${column.type === 'button' ? 'w-full text-center' : ''}`}
                >
                  {column.label}
                </span>
                {column.type != 'button'
                  ? renderSortIcon(
                      typeof column.sortKey === 'string'
                        ? column.sortKey
                        : column.key,
                    )
                  : null}
              </div>
              {column.filter === true &&
              column.distinctValues &&
              column.placeholder
                ? renderMultiSelect(
                    column.distinctValues.map((value) => ({
                      column: column.key,
                      value: value,
                    })),
                    onSelectOption,
                    onRemoveOption,
                    column.placeholder,
                    typeof column.prefilters === 'undefined'
                      ? []
                      : column.prefilters.map((prefilter) => ({
                          column: column.key,
                          value: prefilter,
                        })),
                  )
                : null}
            </th>
          ))}
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
            {columns.map((c, i) => (
              <td
                key={i}
                className={`border border-gray-200 p-2 text-gray-600
                  ${
                    typeof c.colorMap === 'undefined'
                      ? ''
                      : (row[c.key].toString() in c.colorMap
                          ? c.colorMap[row[c.key].toString()]
                          : c.colorMap.default) + ' font-semibold'
                  }`}
              >
                {row[c.key as keyof typeof row]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Datatable;
