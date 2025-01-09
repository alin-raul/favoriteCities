import Image from "next/image";
import TransitionLink from "../utils/TransitionLink";
import { Swiper, SwiperSlide } from "swiper/react";
import "/components/carousel/carousel.css";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { MdArrowForwardIos } from "react-icons/md";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css/autoplay";
import "swiper/css/effect-fade";

import {
  EffectCoverflow,
  Pagination,
  Navigation,
  Autoplay,
} from "swiper/modules";

const Carousel = ({ cities }) => {
  return (
    <div>
      <Swiper
        effect="coverflow"
        fadeEffect={{
          crossFade: true, // Enable cross-fading between slides
        }}
        centeredSlides={true}
        loop={true}
        speed={600}
        slidesPerView={"auto"}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 3,
          slideShadows: true,
        }}
        pagination={{ el: ".swiper-pagination", clickable: true }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        onSwiper={(swiper) => console.log(swiper)}
        modules={[Navigation, Pagination, EffectCoverflow, Autoplay]}
        className="swiper_container w-full 2xl:max-w-[1738px] card-shadow "
      >
        {cities.map((city, index) => (
          <SwiperSlide key={index} className="max-w-[700px] ">
            <div className="relative flex justify-center items-center ">
              <Image
                src={city.image}
                alt={`${city.name} image`}
                style={{
                  objectFit: "cover",
                  width: "70rem",
                  height: "30rem",
                  borderRadius: "2rem", // Apply the border radius
                }}
                className="border rounded-2xl brightness-75 "
                width={700}
                height={480}
              />
              <div className="z-50 w-full absolute bottom-0 left-0 top-0 p-8 gradient-slider text-white rounded-[32px]">
                <div className="flex flex-col justify-end h-full">
                  <TransitionLink
                    className="block text-6xl font-semibold"
                    href={`/cities/${city.name}`}
                  >
                    {city.name}
                  </TransitionLink>
                  <span className="block text-2xl opacity-75">
                    {city.country}
                  </span>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
        <div className="slider-controler">
          <div className="slider-arrow swiper-button-prev ">
            <MdOutlineArrowBackIosNew name="arrow-back-outline" />
          </div>
          <div className="slider-arrow swiper-button-next ">
            <MdArrowForwardIos name="arrow-forward-outline" />
          </div>
        </div>
      </Swiper>
    </div>
  );
};

export default Carousel;
