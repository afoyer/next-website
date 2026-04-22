'use client';

import { motion } from "motion/react";
import Image from "next/image";

export function AwsLogoHeader() {
  return (
    <motion.div
      className="w-full flex justify-center items-center pt-12 pb-2 sm:pt-8 sm:pb-0"
      initial={{ opacity: 0, scale: 0.85, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="rounded-2xl px-6 py-4">
        <Image
          src="/images/nav/aws.png"
          alt="Amazon Web Services"
          width={140}
          height={84}
          className="object-contain"
          priority
        />
      </div>
    </motion.div>
  );
}
