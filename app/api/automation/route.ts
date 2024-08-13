import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'csv-parse';
import { Readable } from 'stream';
import { chromium, Browser, Page } from 'playwright';

interface CsvRow {
    nomor: string;
    [key: string]: string;
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const csvFile = formData.get('csvFile') as File;

        if (!email || !password || !csvFile) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const fileBuffer = await csvFile.arrayBuffer();
        const data: CsvRow[] = await parseCSV(fileBuffer);
        await runAutomation(email, password, data);

        return NextResponse.json({ message: 'Semua data berhasil di generate🙌' });
    } catch (error) {
        console.error('Error during automation:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error }, { status: 500 });
    }
}

async function parseCSV(fileBuffer: ArrayBuffer): Promise<CsvRow[]> {
    return new Promise((resolve, reject) => {
        const data: CsvRow[] = [];
        const readableStream = Readable.from(Buffer.from(fileBuffer));
        readableStream
            .pipe(parse({ columns: true }))
            .on('data', (row: CsvRow) => data.push(row))
            .on('end', () => resolve(data))
            .on('error', reject);
    });
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function runAutomation(email: string, password: string, data: CsvRow[]) {
    const browser: Browser = await chromium.launch({ headless: false });

    for (let i = 0; i < data.length; i++) {
        const page: Page = await browser.newPage();

        try {
            console.log(`Processing data ${i + 1}/${data.length}`);
            await page.goto('https://subsiditepatlpg.mypertamina.id/merchant/app/verification-nik');
            
            await page.fill('#mantine-r0', email);
            await wait(1000);

            await page.fill('#mantine-r1', password);
            await wait(1000);

            await page.click('button.styles_btnLogin__wsKTT');
            await wait(1000);
            
            await page.fill('#mantine-r5', data[i].nomor);
            await page.click('#__next > div:nth-child(1) > div:nth-child(1) > main > div > div > div > div > div:nth-child(2) > div > div:nth-child(1) > form > div:nth-child(2) > button'); // Click submit button
            
            await page.waitForTimeout(2000);
        } catch (error) {
            console.error(`Error during processing entry ${i + 1}:`, error);
        } finally {
            await page.close();
        }
    }

    await browser.close();
}
