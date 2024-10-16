'use client';

import {motion} from 'framer-motion';

const Hero = () => {
    return (
        <section className="bg-hero-pattern bg-cover bg-center h-screen flex flex-col items-center justify-center">
            <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 1 }}
                transition={{ duration: 0.6 }}
                className="text-4xl font-bold text-white"
            >
                Empower Farmers, Connect Consumers
            </motion.h1>
            <motion.p
                initial = {{ opacity: 0 }}
                animate = {{ opacity: 1 }}
                transition = {{ delay: 0.3, duration: 0.6 }}
                className="text-lg text-white mt-4"
            >
                Join our platform to ensure fair trade and fresh produce.
            </motion.p>
            <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="mt-6 bg-green-600 text-white py-2 px-6 rounded-full"
            >
                Get Started
            </motion.button>
        </section>
    );
}

export default Hero;