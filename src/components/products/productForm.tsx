'use client';

import { useState } from "react";
import ImageUploader from "./ImageUploader";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; // Shadcn Button
import { Input } from "@/components/ui/input";   // Shadcn Input
import { Textarea } from "@/components/ui/textarea";  // Shadcn Textarea
import { Label } from "@/components/ui/label";  // Shadcn Label
import { motion } from "framer-motion";
import axios from "axios";

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    quantity: 1,
    images: [] as string[],  // For storing image URLs
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImagesChange = (imageUrls: string[]) => {
    setFormData((prev) => ({ ...prev, images: imageUrls }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("submit handler enters")
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log("entered ...")
      await axios.post("/api/products", formData);  // Send product data to API
      console.log("product created")
      router.push("/product");  // Redirect after successful submission
    } catch (err) {
      console.error(err);
      setError("Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 rounded-lg shadow-md"
    >
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-xl font-medium">Product Name</Label>
          <Input id="name" name="name" placeholder="Enter product name" value={formData.name} onChange={handleChange} required className="focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md text-lg" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-xl font-medium ">Product Description</Label>
          <Textarea id="description" name="description" placeholder="Enter product description" value={formData.description} onChange={handleChange} required className="focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md text-lg" />
        </div>

        <div className="flex space-x-4">
          <div className="space-y-2 w-full">
            <Label htmlFor="price" className="font-medium text-xl">Price</Label>
            <Input type="number" id="price" name="price" placeholder="Enter price" value={formData.price} onChange={handleChange} required className="focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md text-lg" />
          </div>

          <div className="space-y-2 w-full">
            <Label htmlFor="quantity" className="text-xl font-medium">Quantity</Label>
            <Input type="number" id="quantity" name="quantity" placeholder="Enter quantity" value={formData.quantity} onChange={handleChange} required className="focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md text-lg" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="images" className="font-medium text-xl">Upload Images</Label>
          <ImageUploader onImagesChange={handleImagesChange} />
        </div>

        <Button type="submit" className="text-xl w-full  hover:bg-gray-300  font-semibold py-2 rounded-md transition" disabled={loading}>
          {loading ? "Adding Product..." : "Add Product"}
        </Button>
      </form>
    </motion.div>
  );
};

export default ProductForm;