'use client';
import { useAppDispatch } from "@/lib/hooks";
import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import axios from "axios";
import { setAuthTokens } from "@/lib/slices/authSlice";

const SignupForm = () => {
  const [formData, setFormData] = useState<{name: string, email: string, password: string, image: File | null}>({
    name: "",
    email: "",
    password: "",
    image: null,
  });

  const dispatch: any = useAppDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files) {
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

    let imageUrl = '';
    if (formData.image) {
      const imageRef = ref(storage, `images/${formData.image.name}`);
      const snapshot = await uploadBytes(imageRef, formData.image);
      imageUrl = await getDownloadURL(snapshot.ref);
    }

    try {
      const { data } = await axios.post('/api/auth/signup', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        image: imageUrl,
      });
      
      dispatch(setAuthTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      }));
    } catch (error) {
      console.error('Signup failed: ', error);
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <input 
        type="text"
        name="name"
        placeholder="Username"
        value={formData.name}
        onChange={handleChange}
      />
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
      <input 
        type="file"
        name="image"
        onChange={handleChange}
      />
      <button type="submit">Signup</button>
    </form>
  );
};

export default SignupForm;
