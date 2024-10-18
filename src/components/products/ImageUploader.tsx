'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";  // Shadcn Button
import { Input } from "@/components/ui/input";    // Shadcn Input
import { storage } from "@/lib/firebase";  // Import your Firebase storage
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

type ImageUploaderProps = {
  onImagesChange: (images: string[]) => void;
};

const ImageUploader = ({ onImagesChange }: ImageUploaderProps) => {
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);

    try {
      const uploadedImageUrls: string[] = [];
      for (const file of Array.from(files)) {
        const imageRef = ref(storage, `images/${Date.now()}-${file.name}`);
        const snapshot = await uploadBytes(imageRef, file);
        const downloadUrl = await getDownloadURL(snapshot.ref);
        uploadedImageUrls.push(downloadUrl);
      }

      setPreviewImages(uploadedImageUrls);
      onImagesChange(uploadedImageUrls);  // Pass the image URLs to the form

    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <Input type="file" accept="image/*" multiple onChange={handleImageChange} disabled={uploading} className="text-lg"/>
      <div className="grid grid-cols-3 gap-4 mt-4 text-xl">
        {previewImages.map((src, index) => (
          <img key={index} src={src} alt="preview" className="w-full h-32 object-cover" />
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
