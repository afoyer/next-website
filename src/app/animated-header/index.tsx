"use client"

import { motion } from "motion/react";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ['latin'] });

const variants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] } },
};

export default function AnimatedHeader() {

    return (
         <motion.h1 
            initial="initial"
            animate="animate"
            variants={variants}
            className={`${montserrat.className} text-xs sm:text-lg font-bold tracking-[0.5em] sm:tracking-[1em]`}
        >
            aymeric foyer
        </motion.h1>
       

    );
}