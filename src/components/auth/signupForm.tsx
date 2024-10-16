"use client";

import { useAppDispatch } from "@/lib/hooks";
import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import axios from "axios";
import { setAuthTokens } from "@/lib/slices/authSlice";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button"; // shadcn/ui Button
import { Input } from "@/components/ui/input"; // shadcn/ui Input
import { Label } from "@/components/ui/label"; // shadcn/ui Label
import { Skeleton } from "@/components/ui/skeleton"; // Custom Spinner Component
import { useRouter } from "next/navigation";

const SignupForm = () => {
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    password: string;
    image: File | null;
  }>({
    name: "",
    email: "",
    password: "",
    image: null,
  });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "image" && files) {
      setFormData((prevData) => ({
        ...prevData,
        image: files[0],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let imageUrl = "";
    try {
      if (formData.image) {
        const imageRef = ref(
          storage,
          `images/${Date.now()}-${formData.image.name}`
        );
        const snapshot = await uploadBytes(imageRef, formData.image);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const { data } = await axios.post("/api/auth/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        image: imageUrl,
      });

      dispatch(
        setAuthTokens({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        })
      );
      router.push('/signin');
    } catch (err: any) {
      console.error("Signup failed:", err);
      setError(
        err.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center max-h-[100vh]  mt-[15px]"
    > 
      <div className="p-6 rounded-lg shadow-lg shadow-slate-400">
        <h2 className="text-4xl font-bold mb-6 text-center">
          Create an Account
        </h2>
        {error && (
          <div className="mb-4 text-red-600 dark:text-red-400 text-center">
            {error}
          </div>
        )}
        <form
          onSubmit={handleSignup}
          className="space-y-4 max-h-[calc(100vh-50px)]"
        >
          <div>
            <Label
              htmlFor="name"
              className="block text-2xl"
            >
              Username
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your username"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-2 block text-xl"
            />
          </div>
          <div>
            <Label
              htmlFor="email"
              className="block text-2xl"
            >
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-2 block text-xl"
            />
          </div>
          <div>
            <Label
              htmlFor="password"
              className="block text-2xl"
            >
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block text-xl"
            />
          </div>
          <div>
            <Label
              htmlFor="image"
              className="block text-2xl"
            >
              Profile Image
            </Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="mt-2 block text-xl"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="flex justify-center items-center text-2xl w-full"
          >
            {loading ? (
              <>
                <Skeleton className="mr-2" />
                Signing Up...
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>
      </div>
    </motion.div>
  );
};

export default SignupForm;
