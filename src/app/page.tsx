"use client"
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { ProductPage } from "@/components/products/ProductsComponent";
import withAuth from '@/lib/withAuth';
import { useAppSelector } from "@/lib/hooks";

export default function Home() {
  const state = useAppSelector((state) => state.auth);
  return (
    <div>
      <Hero />
      <section className="mb-10">
        { state.username ? (<ProductPage />) : (null)}
      </section>
      <Footer />
    </div>
  );
}
