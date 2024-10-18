// components/DashBoard.tsx
'use client';

import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import axios from "axios";
import { useRouter } from "next/navigation";
import ProductCard from "../products/ProductCard"; // Import the ProductCard component

export const DashBoard = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [userDetails, setUserDetails] = useState<any | null>(null); // To store user details
  const { id, role } = useAppSelector((state) => state.auth);
  const router = useRouter();

  // Fetch user details and products for the FARMER role
  useEffect(() => {
    if (role === "FARMER") {
      // Fetch user details
      const getUserDetails = async () => {
        try {
          const { data } = await axios.get(`/api/users/${id}`);
          setUserDetails(data.user);
        } catch (error) {
          console.error('Failed to fetch user details:', error);
        }
      };

      // Fetch user products
      const getProducts = async () => {
        try {
          const { data } = await axios.get('/api/users/products');
          setProducts(data.products);
        } catch (error) {
          console.error('Failed to fetch products:', error);
        }
      };

      getUserDetails();
      getProducts();
    }
  }, [id, role]);

  // Redirect if user is not logged in
  if (!id) {
    router.push('/login');
    return null; // Don't render anything while redirecting
  }

  // Render message if user is not authorized
  if (role !== "FARMER") {
    return <p>You are not authorized to view this page.</p>;
  }

  return (
    <div className="dashboard-container p-8">
      <h1 className="text-2xl font-bold mb-6">Welcome, Farmer!</h1>

      {userDetails && (
        <div className="profile mb-8 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
          <p className="text-md"><strong>Name:</strong> {userDetails.name}</p>
          <p className="text-md"><strong>Email:</strong> {userDetails.email}</p>
          <p className="text-md"><strong>Location:</strong> {userDetails.location}</p>
        </div>
      )}

      {/* Render Products using ProductCard */}
      <div className="products-grid grid grid-cols-1 md:grid-cols-3 gap-6">
        {products && products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} isDashboard={true}/>
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>
    </div>
  );
};
