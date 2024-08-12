import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'csv-parse';
import { Readable } from 'stream';
import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import * as path from 'path';

export const config = {
    api: {
        bodyParser: false,
    },
};

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
    const chromeDriverPath = path.resolve('public', 'chromedriver.exe');

    for (let i = 0; i < data.length; i++) {
        const options = new chrome.Options();
        const serviceBuilder = new chrome.ServiceBuilder(chromeDriverPath);

        const driver: WebDriver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .setChromeService(serviceBuilder)
            .build();

        try {
            console.log(`Processing data ${i + 1}/${data.length}`);
            await driver.get('https://subsiditepatlpg.mypertamina.id/merchant/app/verification-nik');
            
            await driver.wait(until.elementLocated(By.css('#mantine-r0'))).sendKeys(email);

            await wait(1000);

            await driver.findElement(By.css('#mantine-r1')).sendKeys(password);

            await wait(1000);

            await driver.findElement(By.css('button.styles_btnLogin__wsKTT')).click();
            
            await wait(1000);
            
            await driver.wait(until.elementLocated(By.css('#mantine-r5'))).sendKeys(data[i].nomor);
            await driver.findElement(By.css('#__next > div:nth-child(1) > div:nth-child(1) > main > div > div > div > div > div:nth-child(2) > div > div:nth-child(1) > form > div:nth-child(2) > button')).click();
            
            await driver.sleep(2000);
        } catch (error) {
            console.error(`Error during processing entry ${i + 1}:`, error);
        } finally {
            await driver.quit();
        }
    }
}