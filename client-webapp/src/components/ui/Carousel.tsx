import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface CarouselProps {
  items: {
    id: string;
    image: string;
    title: string;
    description?: string;
  }[];
}

export default function Carousel({ items }: CarouselProps) {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={0}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 5000 }}
      className="w-full h-[400px] rounded-lg overflow-hidden"
    >
      {items.map((item) => (
        <SwiperSlide key={item.id}>
          <div className="relative w-full h-full">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-8">
              <h3 className="text-white text-2xl font-bold">{item.title}</h3>
              {item.description && (
                <p className="text-white mt-2">{item.description}</p>
              )}
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}