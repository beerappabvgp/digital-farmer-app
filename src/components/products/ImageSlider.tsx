'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; // Import core Swiper styles
import 'swiper/css/navigation'; // Import Navigation styles
import 'swiper/css/pagination'; // Import Pagination styles

// Import Navigation and Pagination modules
import { Navigation, Pagination } from 'swiper/modules';

interface ImageSliderProps {
  images: string[];
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images }) => {
  return (
    <Swiper
      spaceBetween={10}
      slidesPerView={1}
      navigation={true}  // Activate navigation
      pagination={{ clickable: true }}  // Activate pagination
      modules={[Navigation, Pagination]}  // Use the required modules
      className="w-full h-48"
    >
      {images.map((image, index) => (
        <SwiperSlide key={index}>
          <img src={image} alt={`Slide ${index}`} className="w-full h-48 object-cover rounded-lg" />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ImageSlider;
