'use client';

import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Divider } from '@nextui-org/divider';
import { Image } from '@nextui-org/image';
import { PinContainer } from '@/components/ui/3d-pin';

export const BotlpgLocal = () => {

    return (
        <div className='w-full h-full flex justify-center'>
            <Card>
                <CardHeader className={`flex gap-3`}>
                    <Image
                        alt="pertamina logo"
                        height={40}
                        radius="sm"
                        src="https://res.cloudinary.com/dutlw7bko/image/upload/v1724163847/project-orang/pythoned_rbrdcl.png"
                        width={40}
                    />
                    <div className="flex flex-col">
                        <p className="text-md">Bot LPG</p>
                        <a className="text-small text-default-500 hover:text-default-600 duration-200" href='https://subsiditepatlpg.mypertamina.id' rel='noreferrer' target='_blank'>
                            https://subsiditepatlpg.mypertamina.id
                        </a>
                    </div>
                </CardHeader>
                <Divider />
                <CardBody className='overflow-hidden pb-20'>
                    <div className="h-auto w-full flex items-center justify-center ">
                        <PinContainer
                            title="/drive.google.com"
                            href="https://drive.google.com/drive/folders/1I1QY1sPls2mBMA4ryXUyQrixS2YU09sO?usp=drive_link"
                            target="_blank"
                        >
                            <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[20rem] ">
                                <h3 className="max-w-xs !pb-2 !m-0 font-bold  text-base text-slate-100">
                                    Download Local Bot
                                </h3>
                                <div className="text-base !m-0 !p-0 font-normal">
                                    <span className="text-slate-500 ">
                                        Silahkan klik card ini untuk download file bot.
                                    </span>
                                </div>
                                <div className="flex flex-1 w-full rounded-lg mt-4 bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 items-center justify-center">
                                    <Image width={110} height={100} src="https://res.cloudinary.com/dutlw7bko/image/upload/v1724421086/project-orang/drive-logo_m96f3d.png" alt="Google Drive" />
                                </div>
                            </div>
                        </PinContainer>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
