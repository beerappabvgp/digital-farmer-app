'use client';

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setUser } from "@/lib/slices/authSlice";
import { useState } from "react";
import axios from "axios";
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button"; // shadcn Button
import { Input } from "@/components/ui/input"; // shadcn Input
import { Label } from "@/components/ui/label"; // shadcn Label
import { Skeleton } from "@/components/ui/skeleton"; // Custom Spinner Component
import { useRouter } from 'next/navigation';  // For client routing

const SignInForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post('/api/auth/signin/', {
        email: formData.email,
        password: formData.password,
      });

      // Dispatch user details after successful sign-in
      dispatch(setUser({
        user: data.user.name,
        imageUrl: data.user.image,
      }));

      // Redirect to home page
      router.push('/');
    } catch (err: any) {
      console.error('SignIn Failed:', err);
      setError(err.response?.data?.message || "Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center"
    >
      <div className="p-8 rounded-lg max-w-md w-full shadow-lg shadow-gray-400 mt-[50px]">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Sign In
        </h2>
        {error && (
          <div className="mb-4 text-red-600 dark:text-red-400 text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-xl">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-2 w-full text-xl"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-xl">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-2 w-full text-xl"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full text-xl py-3"
          >
            {loading ? (
              <>
                <Skeleton className="mr-2" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
        <p className="mt-4 text-center">
          Don't have an account? <a href="/signup" className="text-blue-600 text-xl">Signup</a>
        </p>
      </div>
    </motion.div>
  );
};

export default SignInForm;
