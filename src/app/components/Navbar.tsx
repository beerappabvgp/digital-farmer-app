'use client';
import { motion } from "framer-motion"
import { useAppSelector } from "@/lib/hooks";
import { useState } from "react";
import Link from "next/link";
import Signout from "./auth/signout";
const Navbar = () => {
    const state = useAppSelector((state) => state.auth);
    console.log("user - " , state);
    console.log(state.username)
    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <nav className="w-full bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <motion.div
                    initial= {{ opacity: 0 }}
                    animate= {{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-2xl font-bold text-green-600"
                >
                    <Link href="/">DigiFarmerApp</Link>
                </motion.div>
                <div className="flex items-center space-x-4">
                    {state.username ? (
                        <>
                            <p>{state.username}</p>
                            <motion.img 
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                src={state.imageUrl!}
                                alt="User Profile"
                                className="w-10 h-10 rounded-full"
                            />
                            <Signout />
                            {/* <Link href="/logout">Logout</Link> */}
                        </>
                    ) : (
                        <>
                            <Link href="/signin" className="text-green-600">
                                signin
                            </Link>
                            <Link href="/signup" className="text-green-600">
                                signup
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;