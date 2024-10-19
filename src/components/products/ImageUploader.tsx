'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";  // Shadcn Button
import { Input } from "@/components/ui/input";    // Shadcn Input
import { storage } from "@/lib/firebase";  // Firebase storage setup
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

type ImageUploaderProps = {
  onImagesChange: (images: string[]) => void;
  initialImages?: string[];  // For update mode, this contains already uploaded images
  is_update?: boolean;  // To determine if it's an update or create mode
};

const ImageUploader = ({ onImagesChange, initialImages = [], is_update = false }: ImageUploaderProps) => {
  const [previewImages, setPreviewImages] = useState<string[]>(initialImages);
  const [uploading, setUploading] = useState(false);

  // Handle uploading new images
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

      setPreviewImages((prev) => [...prev, ...uploadedImageUrls]);  // Add new images to preview
      onImagesChange([...previewImages, ...uploadedImageUrls]);  // Update parent with all images

    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setUploading(false);
    }
  };

  // Handle removing an image
  const handleRemoveImage = (url: string) => {
    const updatedImages = previewImages.filter((img) => img !== url);
    setPreviewImages(updatedImages);
    onImagesChange(updatedImages);  // Update parent with the new list of images
  };

  return (
    <div>
      {/* Image Input */}
      <Input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
        disabled={uploading}
        className="text-lg"
      />

      {/* Image Previews */}
      <div className="grid grid-cols-3 gap-4 mt-4 text-xl">
        {previewImages.map((src, index) => (
          <div key={index} className="relative">
            <img src={src} alt="preview" className="w-full h-32 object-cover" />
            <Button
              variant="destructive"
              onClick={() => handleRemoveImage(src)}
              className="absolute top-0 right-0"
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
