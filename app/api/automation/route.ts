import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'csv-parse';
import { Readable } from 'stream';
import { chromium } from 'playwright';

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
        const headless = formData.get('headless') === 'true';

        if (!email || !password || !csvFile) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const fileBuffer = await csvFile.arrayBuffer();
        const data: CsvRow[] = await parseCSV(fileBuffer);

        await runAutomation(email, password, data, headless);

        return NextResponse.json({ message: 'Semua data berhasil di generate🙌' });
    } catch (error) {
        console.error('Error during automation:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
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
            .on('error', (error) => {
                console.error('Error parsing CSV:', error);
                reject(error);
            });
    });
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function runAutomation(email: string, password: string, data: CsvRow[], headless: boolean) {
    const browser = await chromium.launch({
        headless,
    });

    try {
        const pages = await Promise.all(data.map(async (_, index) => {
            const page = await browser.newPage();
            console.log(`Processing data ${index + 1}/${data.length}`);
            return page;
        }));

        for (let index = 0; index < data.length; index++) {
            const row = data[index];
            const page = pages[index];
            try {
                await page.goto('https://subsiditepatlpg.mypertamina.id/merchant/app/verification-nik');

                await page.fill('#mantine-r0', email);
                await wait(1000);

                await page.fill('#mantine-r1', password);
                await wait(1000);

                await page.click('button.styles_btnLogin__wsKTT');
                await wait(1000);

                await page.fill('#mantine-r5', row.nomor);
                await page.click('#__next > div:nth-child(1) > div:nth-child(1) > main > div > div > div > div > div:nth-child(2) > div > div:nth-child(1) > form > div:nth-child(2) > button');

                await wait(2000);
            } catch (error) {
                console.error(`Error during processing entry ${index + 1}:`, error);
            } finally {
                await page.close();
            }
        }
    } catch (error) {
        console.error('Error during automation:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

