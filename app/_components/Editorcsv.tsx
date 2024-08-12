import React, { useState } from 'react';
import Spreadsheet, { Matrix } from 'react-spreadsheet';
import { generateCSVFile } from '@/lib/utils';

const formatKtpNumber = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{6})(\d{6})(\d{4})$/);
    return match ? `${match[1]} ${match[2]} ${match[3]}` : cleaned;
};

interface Cell {
    value: string;
}

export const Editorcsv: React.FC = () => {
    const [data, setData] = useState<Matrix<Cell>>([
        [{ value: '330805 510890 0001' }],
        [{ value: '330805 510892 0001' }]
    ]);

    const handleChange = (newData: Matrix<Cell>) => {
        const formattedData = newData.map(row => 
            row.map(cell => cell ? { value: formatKtpNumber(cell.value) } : { value: '' })
        );
        setData(formattedData);
    };

    const handleAddRow = () => {
        setData([...data, [{ value: '' }]]);
    };

    const handleDownload = () => {
        const ktpNumbers = data.map(row => row[0]?.value || '');
        const csv = generateCSVFile(ktpNumbers);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="font-sans border border-gray-300 rounded-md overflow-hidden">
            <Spreadsheet
                data={data}
                onChange={handleChange}
                columnLabels={['A']}
                rowLabels={data.map((_, index) => (index + 1).toString())}
            />
            <div className="p-2 bg-gray-100 border-t border-gray-300 flex gap-2">
                <button
                    onClick={handleAddRow}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Add Row
                </button>
                <button
                    onClick={handleDownload}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                >
                    Download CSV
                </button>
            </div>
        </div>
    );
};

export default Editorcsv;