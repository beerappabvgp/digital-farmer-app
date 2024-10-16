'use client';
import { motion } from 'framer-motion';
import { useAppSelector } from '@/lib/hooks';
import { useState } from 'react';
import Link from 'next/link';
import Signout from './auth/signout';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const state = useAppSelector((state) => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full shadow-md bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Branding */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold text-green-600 dark:text-green-400"
        >
          <Link href="/">DigiFarmerApp</Link>
        </motion.div>

        {/* Right Side (Links & User Info) */}
        <div className="flex items-center space-x-4">
          {state.username ? (
            <>
              <p className="text-green-600 dark:text-white">{state.username}</p>
              <motion.img
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={state.imageUrl!}
                alt="User Profile"
                className="w-10 h-10 rounded-full"
              />
              <Signout />
              <ThemeToggle />
            </>
          ) : (
            <>
              <Link href="/signin" className="text-green-600 dark:text-green-400">
                Sign In
              </Link>
              <Link href="/signup" className="text-green-600 dark:text-green-400">
                Sign Up
              </Link>
              <ThemeToggle />
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
