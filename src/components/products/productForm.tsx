'use client';

import { useState, useEffect } from "react";
import ImageUploader from "./ImageUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

interface ProductFormProps {
  initialData: {
    name: string;
    description: string;
    price: number;
    quantity: number;
    images: string[];
  };
  onSubmit: (data: any) => Promise<void>;  // Accepts form data and returns a Promise
  isLoading: boolean;
  submitButtonText: string;
  is_update: boolean;
  initialImages: string[];
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSubmit, isLoading, submitButtonText, is_update, initialImages=[] }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    quantity: 1,
    images: [] as string[],
  });

  const [error, setError] = useState<string | null>(null);

  // Pre-fill form if initialData is provided (for editing)
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImagesChange = (imageUrls: string[]) => {
    setFormData((prev) => ({ ...prev, images: imageUrls }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await onSubmit(formData);  // Pass the form data to the onSubmit handler from the parent
    } catch (err) {
      setError("Failed to submit form.");
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
          <Label htmlFor="description" className="text-xl font-medium">Product Description</Label>
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
          <ImageUploader onImagesChange={handleImagesChange} is_update={is_update} initialImages={initialImages}/>
        </div>

        <Button type="submit" className="text-xl w-full" disabled={isLoading}>
          {isLoading ? "Processing..." : submitButtonText}
        </Button>
      </form>
    </motion.div>
  );
};

export default ProductForm;
