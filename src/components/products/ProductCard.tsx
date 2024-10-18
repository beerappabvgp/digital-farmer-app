"use client";

import { motion } from "framer-motion";
import { Card } from "../ui/card";
import ImageSlider from "./ImageSlider";
import { Button } from "@/components/ui/button";

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
  return (
    <motion.div
      className="card-container"
      // whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Card className="shadow-lg p-4">
        <div className="product-image-slider mb-4">
          <ImageSlider images={product.images} /> {/* Use ImageSlider here */}
        </div>
        <h2 className="text-lg font-semibold">{product.name}</h2>
        <p>{product.description}</p>
        <p className="text-sm text-gray-500">Price: ${product.price}</p>
        {isDashboard ? (
          <div className="mt-4 flex justify-between">
            <Button>Edit</Button>
            <Button variant="destructive">Delete</Button>
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
