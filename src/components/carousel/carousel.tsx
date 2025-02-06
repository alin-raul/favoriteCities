import { useMemo } from "react";
import Image from "next/image";
import TransitionLink from "../utils/TransitionLink";
import { Swiper, SwiperSlide } from "swiper/react";
import "@/components/carousel/carousel.css";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { MdArrowForwardIos } from "react-icons/md";
import { FaArrowRightLong } from "react-icons/fa6";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css/autoplay";
import "swiper/css/effect-fade";

type City = {
  country: string;
  name: string;
  lat: number;
  lon: number;
  image?: string;
};

type CarouselProps = {
  cities: City[];
};

import {
  EffectCoverflow,
  Pagination,
  Navigation,
  Autoplay,
} from "swiper/modules";

const Carousel = ({ cities }: CarouselProps) => {
  const slides = useMemo(() => {
    return cities.map((city, index) => (
      <SwiperSlide
        key={index}
        className="max-w-[600px] md:max-w-[700px] mt-0 sm:mt-4 lg:my-[3rem] h-full max-h-10"
      >
        <TransitionLink
          className="block text-4xl md:text-6xl font-semibold"
          href={`/cities/${city.name}`}
        >
          <div className="relative min-w-full group">
            <div className="min-w-full w-full h-[29rem] relative">
              <Image
                src={city.image || ""}
                alt={`${city.name} -image`}
                fill
                className="border brightness-75 rounded-[3rem] object-cover"
              />
            </div>

            <div className="z-50 w-full absolute bottom-0 left-0 top-0 p-8 gradient-slider text-white rounded-[3rem]">
              <div className="flex flex-col justify-end h-full">
                <div className="flex items-center opacity-80 hover:opacity-100 transition-all">
                  <h1 className="">{city.name}</h1>
                  <FaArrowRightLong className="ml-2 group-hover:ml-4 w-10 transition-all" />
                </div>

                <span className="block text-2xl opacity-75">
                  {city.country}
                </span>
              </div>
            </div>
          </div>
        </TransitionLink>
      </SwiperSlide>
    ));
  }, [cities]);

  return (
    <div className="flex w-full">
      <div className="pb-6 w-full rounded-[3.5rem] overflow-hidden mx-auto">
        <Swiper
          effect="coverflow"
          centeredSlides={true}
          loop={true}
          speed={600}
          slidesPerView={"auto"}
          watchSlidesProgress={true}
          onProgress={(swiper) => {
            swiper.slides.forEach((slide) => {
              const slideProgress = (slide as any).progress;
              slide.style.setProperty(
                "--progress",
                String(Math.abs(slideProgress))
              );
            });
          }}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 3,
            slideShadows: false,
          }}
          pagination={{ el: ".swiper-pagination", clickable: true }}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          autoplay={{
            delay: 6000,
            disableOnInteraction: false,
          }}
          modules={[Navigation, Pagination, EffectCoverflow, Autoplay]}
          className="swiper_container  card-shadow"
        >
          {slides}
          <div className="slider-controler max-w-14 mx-auto">
            <div className="slider-arrow swiper-button-prev ">
              <MdOutlineArrowBackIosNew name="arrow-back-outline" />
            </div>
            <div className="slider-arrow swiper-button-next ">
              <MdArrowForwardIos name="arrow-forward-outline" />
            </div>
          </div>
        </Swiper>
      </div>
    </div>
  );
};

export default Carousel;
