// app/product/page.tsx

'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '@/components/products/ProductCard';
import withAuth from '@/lib/withAuth';

export const ProductPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products'); // Replace with your actual API endpoint
        setProducts(data);
        console.log(products);
      } catch (err) {
        console.error('Failed to load products:', err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto">
      <h1 className="text-6xl font-bold text-center mb-10">Available Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length ? (
          products.map((product) => (
            <ProductCard key={(product as any).id} product={product} isDashboard={false} />
          ))
        ) : (
          <p>No products available.</p>
        )}
      </div>
    </div>
  );
};

