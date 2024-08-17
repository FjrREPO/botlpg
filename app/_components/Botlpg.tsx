'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Divider } from '@nextui-org/divider';
import { Image } from '@nextui-org/image';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { MailIcon } from '@/components/icon/MailIcon';
import { KeyIcon } from '@/components/icon/KeyIcon';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Spinner } from '@nextui-org/spinner';
import { FileUpload } from '@/components/ui/file-upload';
import { Checkbox } from '@nextui-org/checkbox';

export const Botlpg = () => {
    const [email, setEmail] = useState('icanbejo@gmail.com');
    const [password, setPassword] = useState('');
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [headless, setHeadless] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            showToast('Isi email dengan benar!', 'warn');
            return;
        }
        if (!password) {
            showToast('Isi pin dengan benar!', 'warn');
            return;
        }
        if (!csvFile) {
            showToast('Masukkan file csv dengan benar!', 'warn');
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('csvFile', csvFile);
        formData.append('headless', String(headless));

        try {
            console.log(formData)
            console.log(JSON.stringify(formData))
            const res = await fetch('/api/automation', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                throw new Error('Server responded with an error');
            }

            const result = await res.json();
            showToast(result.message, 'success');
        } catch (error) {
            console.error('Error during form submission:', error);
            showToast('An error occurred. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message: string, type: 'success' | 'warn' | 'error') => {
        toast[type](message, {
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
    };

    const handleFileChange = (file: File | null) => {
        if (file) {
            setCsvFile(file);
        }
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
                            src="https://res.cloudinary.com/dutlw7bko/image/upload/v1722869254/images_1_umygcp.png"
                            width={40}
                        />
                        <div className="flex flex-col">
                            <p className="text-md">Bot{" "}LPG</p>
                            <a className="text-small text-default-500 hover:text-default-600 duration-200" href='https://subsiditepatlpg.mypertamina.id' rel='noreferrer' target='_blank'>
                                https://subsiditepatlpg.mypertamina.id
                            </a>
                        </div>
                    </CardHeader>
                    <Divider />
                    <CardBody className={`${loading && 'brightness-50'}`}>
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
                                    disabled={loading}
                                    endContent={<MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
                                />
                                <Input
                                    type="password"
                                    label="Pin"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="6 digit"
                                    labelPlacement="outside"
                                    variant='bordered'
                                    disabled={loading}
                                    endContent={<KeyIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
                                />
                            </div>
                            <FileUpload
                                onChange={handleFileChange}
                                disabled={loading}
                            />
                            <div className="flex items-center gap-2 mb-4">
                                <Checkbox
                                    defaultSelected
                                    checked={headless}
                                    onChange={() => setHeadless(!headless)}
                                    disabled={loading}
                                    radius="sm"
                                >
                                    Tampilkan progress browser
                                </Checkbox>
                            </div>
                            <Button color="success" className={`h-auto py-2 font-semibold text-white ${loading || !email || !password || !csvFile ? 'cursor-not-allowed' : ''}`} type="submit" disabled={loading || !email || !password || !csvFile}>
                                Submit
                            </Button>
                        </div>
                    </CardBody>
                    <Divider />
                    <CardFooter className={`flex flex-col items-start w-full h-auto ${loading && 'brightness-50'}`}>
                        <p className="text-small text-default-500">
                            Lihat / Download contoh csv{" "}
                            <a href="https://drive.google.com/file/d/18JqOP2d4_AIG6XLY_BBhvQHxVcgKThQN/view?usp=sharing" className='text-blue-500 font-bold' target='_blank' rel='noreferrer'>
                                klik disini
                            </a>
                        </p>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
