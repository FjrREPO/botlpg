'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Divider } from '@nextui-org/divider';
import { Image } from '@nextui-org/image';
import { Button } from '@nextui-org/button';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Spinner } from '@nextui-org/spinner';
import { FileUpload } from '@/components/ui/file-upload';
import Spreadsheet, { Matrix } from 'react-spreadsheet';
import { generateCSVFile } from '@/lib/utils';

const formatKtpNumber = (value: string): string => {
    if (typeof value !== 'string') {
        console.warn('Received non-string value in formatKtpNumber:', value);
        return '';
    }
    const cleaned = value.replace(/\D/g, '');
    const truncated = cleaned.slice(0, 16);
    const match = truncated.match(/^(\d{6})(\d{6})(\d{4})$/);
    return match ? `${match[1]} ${match[2]} ${match[3]}` : truncated;
};

interface Cell {
    value: string;
}

export const Generatecsv = () => {
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<Matrix<Cell>>([]);

    useEffect(() => {
        const ensureMinSize = (currentData: Matrix<Cell>) => {
            const newData = [...currentData];
            while (newData.length < 3) {
                newData.push(Array(newData[0]?.length || 3).fill({ value: '' }));
            }
            newData.forEach(row => {
                while (row.length < 3) {
                    row.push({ value: '' });
                }
            });
            return newData;
        };

        setData(prevData => {
            const updatedData = ensureMinSize(prevData);
            if (JSON.stringify(updatedData) !== JSON.stringify(prevData)) {
                return updatedData;
            }
            return prevData;
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!csvFile) {
            toast.warn('Upload file csv dahulu!', {
                position: "top-right",
                autoClose: 3000,
                rtl: false,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                transition: Bounce,
            });
            return;
        }

        setLoading(true);
        try {
            const text = await csvFile.text();
            const rows = text.split('\n').map(row => row.split(','));
            const newData = rows.map(row => 
                row.map(cell => ({ value: formatKtpNumber(cell.trim()) }))
            );
            const filteredData = newData.filter(row => row.some(cell => cell.value.trim() !== ''));
            setData(filteredData);
            toast.success('File CSV berhasil diupload!', {
                position: "top-right",
                autoClose: 3000,
                rtl: false,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                transition: Bounce,
            });
        } catch (error) {
            toast.error('Gagal memproses file CSV!', {
                position: "top-right",
                autoClose: 3000,
                rtl: false,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                transition: Bounce,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (file: File | null) => {
        if (file) {
            setCsvFile(file);
        }
    };

    const handleChange = (newData: Matrix<Cell>) => {
        const formattedData = newData.map(row => 
            row.map(cell => cell ? { value: formatKtpNumber(cell.value) } : { value: '' })
        );
        setData(formattedData);
    };

    const handleAddRow = () => {
        setData(prevData => [...prevData, Array(prevData[0]?.length || 3).fill({ value: '' })]);
    };

    const handleAddColumn = () => {
        if (data[0] && data[0].length < 3) {
            setData(prevData => prevData.map(row => [...row, { value: '' }]));
        } else {
            toast.warn('Maksimal kolom adalah 3!', {
                position: "top-right",
                autoClose: 3000,
                rtl: false,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                transition: Bounce,
            });
        }
    };   

    const handleDownload = () => {
        const csvData = data.map(row => row.map(cell => cell!.value));
        const csv = generateCSVFile(csvData.map(row => row.join(' ')));
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className='w-full h-full flex justify-center'>
            <ToastContainer />
            <form onSubmit={handleSubmit}>
                <Card>
                    {loading && <Spinner size='lg' className='absolute w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 brightness-100' />}
                    <CardHeader className={`flex gap-3 ${loading && 'brightness-50'}`}>
                        <Image
                            alt="pertamina logo"
                            height={40}
                            radius="sm"
                            src="https://res.cloudinary.com/dutlw7bko/image/upload/v1723383902/project-orang/8242984_t6ek42.png"
                            width={40}
                        />
                        <div className="flex flex-col">
                            <p className="text-md">Generate CSV</p>
                        </div>
                    </CardHeader>
                    <Divider />
                    <CardBody className={`${loading && 'brightness-50'}`}>
                        <div className='w-full h-full flex flex-col gap-5 pt-3'>
                            <FileUpload
                                onChange={handleFileChange}
                                disabled={loading}
                            />
                            <Button color="success" className={`h-auto py-2 font-semibold text-white ${loading || !csvFile ? 'cursor-no-drop' : ''}`} type="submit" disabled={loading}>
                                Generate file ke editor
                            </Button>
                            <div className="font-sans border border-gray-300 rounded-md overflow-hidden">
                                <Spreadsheet
                                    data={data}
                                    onChange={handleChange}
                                    columnLabels={data[0]?.map((_, index) => String.fromCharCode(65 + index)) || []}
                                    rowLabels={data.map((_, index) => (index + 1).toString())}
                                />
                                <div className="p-2 bg-gray-100 border-t border-gray-300 flex gap-2">
                                    <button
                                        type="button"
                                        onClick={handleAddRow}
                                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                    >
                                        Add Row
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleAddColumn}
                                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                    >
                                        Add Column
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleDownload}
                                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                                    >
                                        Download CSV
                                    </button>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                    <Divider />
                    <CardFooter className={`flex flex-col items-start w-full h-auto ${loading && 'brightness-50'}`}>
                        <p className="text-small text-default-500">
                            File csv dibuat secara otomatis dan tinggal upload ke bot lpg!
                        </p>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
