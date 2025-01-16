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

import {
  EffectCoverflow,
  Pagination,
  Navigation,
  Autoplay,
} from "swiper/modules";

const Carousel = ({ cities }) => {
  const slides = useMemo(() => {
    return cities.map((city, index) => (
      <SwiperSlide key={index} className="max-w-[700px] lg:my-[3rem]">
        <div className="relative flex justify-center items-center ">
          <Image
            src={city.image}
            alt={`${city.name} image`}
            style={{
              objectFit: "cover",
              width: "70rem",
              height: "30rem",
              borderRadius: "2rem",
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
                <div className="flex group items-center opacity-80 hover:opacity-100 transition-all">
                  <h1 className="">{city.name}</h1>

                  <FaArrowRightLong className="ml-2 group-hover:ml-4 w-10 transition-all" />
                </div>
              </TransitionLink>
              <span className="block text-2xl opacity-75">{city.country}</span>
            </div>
          </div>
        </div>
      </SwiperSlide>
    ));
  }, [cities]);

  return (
    <div className="flex border bg-dynamic rounded-[3rem] max-w-screen-2xl">
      <div className="border pb-6 w-full bg-dynamic-minimal xl:max-w-screen-md mx-auto rounded-[2.5rem] overflow-hidden">
        <Swiper
          effect="coverflow"
          centeredSlides={true}
          loop={true}
          speed={600}
          slidesPerView={"auto"}
          watchSlidesProgress={true}
          onProgress={(swiper) => {
            swiper.slides.forEach((slide) => {
              const slideProgress = slide.progress;
              slide.style.setProperty("--progress", Math.abs(slideProgress));
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
          className="swiper_container max-w-screen-2xl card-shadow"
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
      <div className="p-6 max-w-2xl m-auto hidden xl:block">
        <h1 className="text-6xl font-bold mb-8 font-serif">Spin the Globe!</h1>
        <p className="text-2xl font-light opacity-80 text-justify max-w-md">
          Let your wanderlust take the lead! Each spin unveils a handpicked
          selection of exciting cities from around the world, waiting for you to
          explore. Dive into the map, uncover unique destinations, and learn
          what makes each city special. Whether you're planning your next
          adventure or just daydreaming about far-off places, let curiosity
          guide you to discover new horizons and hidden gems.
        </p>
      </div>
    </div>
  );
};

export default Carousel;
