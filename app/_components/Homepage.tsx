'use client';

import React, { useState, ChangeEvent } from 'react';
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Divider } from '@nextui-org/divider';
import { Image } from '@nextui-org/image';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { MailIcon } from '@/components/icon/MailIcon';
import { KeyIcon } from '@/components/icon/KeyIcon';

export default function Homepage() {
    const [email, setEmail] = useState('icanbejo@gmail.com');
    const [password, setPassword] = useState('');
    const [csvFile, setCsvFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            alert('Please fill email.');
            return;
        } else if (!password) {
            alert('Please fill password.');
            return;
        } else if (!csvFile) {
            alert('Please select a CSV file.');
            return;
        }

        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('csvFile', csvFile);

        try {
            const formDataObj = Object.fromEntries(formData.entries());
            console.log('Form data:', formDataObj);

            const res = await fetch('/api/automation', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                throw new Error('Server responded with an error');
            }

            const result = await res.json();
            alert(result.message);
        } catch (error) {
            console.error('Error during form submission:', error);
            alert('An error occurred. Please try again.');
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCsvFile(e.target.files[0]);
        }
    };

    return (
        <div className='w-full h-full flex justify-center'>
            <form onSubmit={handleSubmit}>
                <Card className="max-w-[400px]">
                    <CardHeader className="flex gap-3">
                        <Image
                            alt="nextui logo"
                            height={40}
                            radius="sm"
                            src="https://res.cloudinary.com/dutlw7bko/image/upload/v1722869254/images_1_umygcp.png"
                            width={40}
                        />
                        <div className="flex flex-col">
                            <p className="text-md">Bot LPG</p>
                            <a className="text-small text-default-500 hover:text-default-600 duration-200" href='https://subsiditepatlpg.mypertamina.id' target='_blank'>https://subsiditepatlpg.mypertamina.id</a>
                        </div>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        <div className='w-full h-full flex flex-col gap-5 pt-3'>
                            <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                <Input
                                    type="email"
                                    label="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    labelPlacement="outside"
                                    variant='bordered'
                                    endContent={
                                        <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                                    }
                                />
                                <Input
                                    type="password"
                                    label="Pin"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="6 digit"
                                    labelPlacement="outside"
                                    variant='bordered'
                                    endContent={
                                        <KeyIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                                    }
                                />
                            </div>
                            <Input
                                type="file"
                                variant={'bordered'}
                                label="Upload file CSV"
                                onChange={handleFileChange}
                                accept=".csv"
                                className='cursor-pointer'
                            />
                            <Button color="success" className='h-auto py-2 font-semibold text-white mt-2' type="submit">
                                Submit
                            </Button>
                        </div>
                    </CardBody>
                    <Divider />
                    <CardFooter>
                        <p className="text-small text-default-500">Pastikan data yang diinputkan benar!</p>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}