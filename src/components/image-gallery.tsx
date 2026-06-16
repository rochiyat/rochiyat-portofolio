"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { XIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "./ui/button";

interface ImageGalleryProps {
  images: { asset?: { url?: string } }[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const validImages = images.filter((img) => img.asset?.url);

  if (validImages.length === 0) return null;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % validImages.length);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImage !== null) {
      setSelectedImage(
        (selectedImage - 1 + validImages.length) % validImages.length
      );
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-8">
        {validImages.map((image, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="cursor-pointer relative aspect-video rounded-xl overflow-hidden border shadow-sm"
            onClick={() => setSelectedImage(index)}
          >
            <Image
              src={image.asset?.url!}
              alt={`Gallery image ${index + 1}`}
              fill
              className="object-cover"
            />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20 z-50"
              onClick={() => setSelectedImage(null)}
            >
              <XIcon className="size-6" />
            </Button>

            {validImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 text-white hover:bg-white/20 z-50"
                  onClick={handlePrev}
                >
                  <ChevronLeftIcon className="size-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 text-white hover:bg-white/20 z-50"
                  onClick={handleNext}
                >
                  <ChevronRightIcon className="size-8" />
                </Button>
              </>
            )}

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-5xl aspect-video mx-12"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <Image
                src={validImages[selectedImage].asset?.url!}
                alt={`Gallery image ${selectedImage + 1}`}
                fill
                className="object-contain"
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
