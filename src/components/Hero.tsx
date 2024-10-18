'use client';

import { motion } from 'framer-motion';
import Image from 'next/image'; // For optimized images
import { clsx } from 'clsx';
import { useAppSelector } from '@/lib/hooks';
import { useRouter } from 'next/navigation';

const Hero = () => {
    const state = useAppSelector((state) => state.auth);
    const router = useRouter();
    return (
        <section className="bg-cover bg-center h-screen flex flex-col items-center justify-center">
            {/* Farmer Image */}
            {/* <div className="relative w-full h-full">
                <Image 
                    src="/farmer.webp" 
                    alt="Farmer at work"
                    layout="fill"
                    objectFit="cover"
                    className="opacity-70" // Make it slightly transparent for text visibility
                />
            </div> */}

            {/* Headline and Pitch */}
            <div className="absolute flex flex-col items-center justify-center h-full text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-8xl font-bold drop-shadow-lg"
                >
                    Empower Farmers, Connect Consumers
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="text-5xl mt-4 drop-shadow-md"
                >
                    Fair trade, fresh produce, directly from farm to table.
                </motion.p>
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="mt-6 bg-green-700 hover:bg-green-800 py-3 px-8 rounded-full shadow-lg"
                    onClick={() => state.role === 'FARMER' ? (router.push('/product/add')): (router.push('/'))}
                >
                    { state.role === 'FARMER' ? 'Add Product' : 'Join us now' } 
                </motion.button>
            </div>
        </section>
    );
}

export default Hero;
