"use client"

import { useAppDispatch } from "@/lib/hooks"
import { logout } from "@/lib/slices/authSlice";
import axios from "axios"

const Signout = () => {
    const dispatch = useAppDispatch();
    const handleSignOut = async () => {
       try {
        const response = await axios.post('/api/auth/logout', {});
        if (response.status === 200) {
            dispatch(logout());
        }
       } catch (error) {
        console.error("signout failed.", error);
       }
    };
    return (
        <button onClick={handleSignOut} className="p-[5px] bg-red-900 rounded-lg text-white">Signout</button>
    )
}

export default Signout;