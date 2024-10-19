'use client';
import ProductForm from "@/components/products/productForm";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const AddProductPage = () => {  // Remove `updatedData` argument
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle form submission
  const handleSubmit = async (formData: any) => {  // formData will be passed from ProductForm
    setLoading(true);
    try {
      await axios.post("/api/products", formData);  // Send product data to API
      router.push("/user/dashboard");  // Redirect after successful submission
    } catch (err) {
      console.error("Failed to submit form:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-[1100px]">
      <h1 className="text-3xl font-bold mb-6 text-center">Add New Product</h1>
      <ProductForm 
        initialData={{
          name: "",
          description: "",
          price: 0,
          quantity: 0,
          images: [],
        }}
        onSubmit={handleSubmit} // Pass the form submission handler
        isLoading={loading}
        submitButtonText="Create Product" is_update={false} initialImages={[]}        />
    </div>
  );
};

export default AddProductPage;
