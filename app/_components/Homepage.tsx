"use client";
import Image from "next/image";
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { Botlpg } from "./Botlpg";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { Generatecsv } from "./Generatecsv";
import { BotlpgLocal } from "./BotlpgLocal";

export default function Homepage() {
    const [active, setActive] = useState<(typeof cards)[number] | boolean | null>(
        null
    );
    const id = useId();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function onKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setActive(false);
            }
        }

        if (active && typeof active === "object") {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [active]);

    useOutsideClick(ref, () => setActive(null));

    return (
        <>
            <AnimatePresence>
                {active && typeof active === "object" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/20 h-full w-full z-10"
                    />
                )}
            </AnimatePresence>
            <AnimatePresence>
                {active && typeof active === "object" ? (
                    <div className="fixed inset-0 grid top-5 bottom-5 place-content-center place-items-center z-[100]">
                        <motion.button
                            key={`button-${active.title}-${id}`}
                            layout
                            initial={{
                                opacity: 0,
                            }}
                            animate={{
                                opacity: 1,
                            }}
                            exit={{
                                opacity: 0,
                                transition: {
                                    duration: 0.05,
                                },
                            }}
                            className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
                            onClick={() => setActive(null)}
                        >
                            <CloseIcon />
                        </motion.button>
                        <motion.div
                            layoutId={`card-${active.title}-${id}`}
                            ref={ref}
                            className="w-full max-w-[500px] h-full flex flex-col sm:rounded-3xl overflow-x-hidden"
                        >
                            <div className="relative">
                                <motion.div
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-neutral-600 h-full text-xs md:text-sm lg:text-base md:h-fit flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                                >
                                    {typeof active.content === "function"
                                        ? active.content()
                                        : active.content}
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                ) : null}
            </AnimatePresence>
            <ul className="w-full flex flex-row flex-wrap items-center justify-center">
                {cards.map((card, index) => (
                    <motion.div
                        layoutId={`card-${card.title}-${id}`}
                        key={card.title}
                        onClick={() => setActive(card)}
                        className="p-7 flex flex-col rounded-xl cursor-pointer"
                    >
                        <BackgroundGradient className="rounded-[22px] max-w-[250px] w-fit p-4 sm:p-10 bg-white dark:bg-zinc-900 flex justify-center flex-col items-center">
                            <Image
                                src={card.src}
                                alt="jordans"
                                height={100}
                                width={100}
                                className="object-contain rounded-[20px]"
                            />
                            <motion.p
                                layoutId={`title-${card.title}-${id}`}
                                className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200"
                            >
                                {card.title}
                            </motion.p>

                            <motion.p
                                layoutId={`description-${card.description}-${id}`}
                                className="text-sm text-neutral-600 dark:text-neutral-400 text-center"
                            >
                                {card.description}
                            </motion.p>
                        </BackgroundGradient>
                    </motion.div>
                ))}
            </ul>
        </>
    );
}

export const CloseIcon = () => {
    return (
        <motion.svg
            initial={{
                opacity: 0,
            }}
            animate={{
                opacity: 1,
            }}
            exit={{
                opacity: 0,
                transition: {
                    duration: 0.05,
                },
            }}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-black"
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M18 6l-12 12" />
            <path d="M6 6l12 12" />
        </motion.svg>
    );
};

const cards = [
    {
        description: "Pengisian data-data lpg pertamina secara otomatis",
        title: "Bot LPG",
        src: "https://res.cloudinary.com/dutlw7bko/image/upload/v1722869254/images_1_umygcp.png",
        ctaText: "Visit",
        ctaLink: "https://ui.aceternity.com/templates",
        content: () => {
            return (
                <Botlpg />
            );
        },
    },
    {
        description: "Tools untuk membuat atau mengedit CSV",
        title: "CSV Editor",
        src: "https://res.cloudinary.com/dutlw7bko/image/upload/v1723383902/project-orang/8242984_t6ek42.png",
        ctaText: "Visit",
        ctaLink: "https://ui.aceternity.com/templates",
        content: () => {
            return (
                <Generatecsv />
            );
        },
    },
    {
        description: "Program untuk running bot secara local dengan vscode",
        title: "Local Bot",
        src: "https://res.cloudinary.com/dutlw7bko/image/upload/v1724163847/project-orang/pythoned_rbrdcl.png",
        ctaText: "Visit",
        ctaLink: "https://ui.aceternity.com/templates",
        content: () => {
            return (
                <BotlpgLocal />
            );
        },
    },
];
