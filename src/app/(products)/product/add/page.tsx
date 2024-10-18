'use client';
import ProductForm from "@/components/products/productForm";

const AddProductPage = () => {
  return (
    <div className="container mx-auto py-8 max-w-[1100px]">
      <h1 className="text-3xl font-bold mb-6 text-center">Add New Product</h1>
      <ProductForm />
    </div>
  );
};

export default AddProductPage;
