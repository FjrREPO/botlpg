import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

import Papa from 'papaparse';

export const generateCSVFile = (data: string[]) => {
    const csv = Papa.unparse(data.map(num => ({ nomor: num })));
    return csv;
};
