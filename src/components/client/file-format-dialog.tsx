'use client';

import { useState } from 'react';

type FileFormatDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (format: string) => void;
};

const FileFormatDialog: React.FC<FileFormatDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [selectedFormat, setSelectedFormat] = useState('CSV');

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
        <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
          <h3 className="text-lg font-semibold text-gray-800">
            Choose Export Format
          </h3>
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className="mt-4 mb-6 border border-gray-300 rounded px-2 py-1 w-full"
          >
            <option value="CSV">CSV</option>
            <option value="JSON">JSON</option>
            <option value="XLSX">Excel</option>
          </select>
          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(selectedFormat)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Export
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default FileFormatDialog;
