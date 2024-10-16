'use client';

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setAuthTokens, setUser } from "@/lib/slices/authSlice";
import { useState } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation';  // Correct for App Router

const SignInForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const accessToken = useAppSelector((state) => state.auth.accessToken);
    const refreshToken = useAppSelector((state) => state.auth.refreshToken);
    const user = useAppSelector((state) => state.auth.username);
    const router = useRouter();  // useRouter from next/navigation works for client components
    const dispatch = useAppDispatch();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = new FormData();
        form.append('email', formData.email);
        form.append('password', formData.password);

        try {
            const { data } = await axios.post('/api/auth/signin/', {
                email: formData.email,
                password: formData.password,
            });

            // Dispatch tokens after successful sign-in
            // dispatch(setAuthTokens({
            //     accessToken: data.accessToken,
            //     refreshToken: data.refreshToken, 
            // }));
            console.log("data" , data);
            dispatch(setUser({
                user: data.user.name,
                imageUrl: data.user.image,
            }));
            console.log("Access Token:", accessToken);
            console.log("Refresh Token:", refreshToken);
            console.log("User:", user);
            // Redirect to home page on success
            router.push('/');  // Works with the App Router

        } catch (error) {
            console.log('SignIn Failed:', error);
        }
    }

    return (
        <form onSubmit={handleSignIn}>
            <input 
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
            />
            <input 
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
            />
            <button type="submit">SignIn</button>
        </form>
    );
}

export default SignInForm;
