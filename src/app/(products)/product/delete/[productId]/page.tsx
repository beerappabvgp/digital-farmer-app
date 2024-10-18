'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import axios from 'axios';

const DeleteProductPage = ({ params }: { params: { productId: string } }) => {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/products/${params.productId}`);
      router.push('/products');
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  return (
    <div className="container mx-auto mt-10 text-center">
      <h1 className="text-2xl font-bold mb-6">Are you sure you want to delete this product?</h1>
      <Button variant="destructive" onClick={handleDelete}>Delete</Button>
      <Button variant="secondary" onClick={() => router.back()}>Cancel</Button>
    </div>
  );
};

export default DeleteProductPage;
