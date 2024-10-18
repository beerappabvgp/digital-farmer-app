// productForm.tsx

import React from 'react';

interface Product {
  // Define the structure of your product here
  id: string;
  name: string;
  price: number;
  // Add other fields as necessary
}

interface ProductFormProps {
  product: Product; // Use the Product type you defined
  onSubmit: (updatedProduct: Product) => Promise<void>;
  loading: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit, loading }) => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Collect form data and call onSubmit with it
    const updatedProduct = { ...product }; // Modify as needed
    await onSubmit(updatedProduct);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={product.name} onChange={(e) => {/* handle change */}} />
      <input type="number" value={product.price} onChange={(e) => {/* handle change */}} />
      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
};
