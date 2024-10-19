"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import ProductForm from "@/components/products/productForm";

// Define a type for the product
interface Product {
  name: string;
  description: string;
  price: number;
  quantity: number;
  images: string[];
}

const UpdateProductPage = () => {
  const [initialData, setInitialData] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { productId } = useParams();
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${productId}`);
        console.log("data - ", data);
        setInitialData({
          name: data.product.name,
          description: data.product.description,
          price: data.product.price,
          quantity: data.product.quantity,
          images: data.product.images,
        });
      } catch (err) {
        console.error("Failed to fetch product data", err);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleUpdate = async (updatedData: Product) => {
    setIsLoading(true);
    try {
      await axios.put(`/api/products/${productId}`, updatedData); 
      console.log("succesfully updated ... ");
      router.push("/user/dashboard");  // Redirect after successful update
    } catch (err) {
      console.error("Failed to update product", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!initialData) {
    return <p>Loading...</p>;  // Show a loading state while fetching data
  }

  return (
    <ProductForm
      initialData={initialData}
      onSubmit={handleUpdate}
      isLoading={isLoading}
      submitButtonText="Update Product"
      is_update={true}
      initialImages={initialData.images}
    />
  );
};

export default UpdateProductPage;
