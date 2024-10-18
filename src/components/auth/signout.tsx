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
        <button onClick={handleSignOut} className="p-4 shadow-sm shadow-gray-100 rounded-lg">Signout</button>
    )
}

export default Signout;