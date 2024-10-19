"use client";

import { motion } from "framer-motion";
import { Card } from "../ui/card";
import ImageSlider from "./ImageSlider";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";  // Optional: to show notifications

interface ProductProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    images: string[];
  };
  isDashboard: boolean;
}

const ProductCard: React.FC<ProductProps> = ({ product, isDashboard }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false); // State to manage delete button loading
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    setLoading(true);

    try {
      // Make DELETE request to the API
      await axios.delete(`/api/products/${product.id}`);

      // Show success message (optional, you can use any notification library)
      toast.success("Product deleted successfully!");

      // Redirect to the dashboard after successful deletion
      router.push("user/dashboard");
    } catch (error) {
      // Handle error, show a message to the user
      toast.error("Failed to delete the product. Please try again.");
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  return (
    <motion.div className="card-container" whileTap={{ scale: 0.95 }}>
      <Card className="shadow-lg p-4">
        <div className="product-image-slider mb-4">
          <ImageSlider images={product.images} />
        </div>
        <h2 className="text-lg font-semibold">{product.name}</h2>
        <p>{product.description}</p>
        <p className="text-sm text-gray-500">Price: ${product.price}</p>
        {isDashboard ? (
          <div className="mt-4 flex justify-between">
            <Button onClick={() => router.push(`/product/edit/${product.id}`)}>Edit</Button>
            <Button
              variant="destructive"
              onClick={() => handleDelete()}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        ) : (
          <Button variant="default" className="mt-4 w-full">
            Add to Cart
          </Button>
        )}
      </Card>
    </motion.div>
  );
};

export default ProductCard;
