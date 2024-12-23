import Wrapper from "@/components/pageWrapper/wrapper";
import RandomCities from "@/components/randomCities/RandomCities";
import FavoriteCities from "@/components/favoriteCitiesCard/FavoriteCities";
import ListCarousel from "@/components/list-carousel/ListCarousel";
import GradientBackground from "@/components/cardinal/GradientBackground";
import SearchBar from "@/components/search/SearchBar";
import Link from "next/link";

export default function Home() {
  return (
    <Wrapper>
      <div className="flex justify-center">
        <GradientBackground />
      </div>
      <div className="max-w-screen-2xl m-auto h-screen-minus-nav relative">
        <div className="flex justify-center h-full px-4 ">
          <div className="flex flex-col m-auto gap-12 max-w-3xl">
            <div className="w-fit">
              <div className="flex items-center text-9xl h-24 font-bold mb-8 font-serif">
                <div className="slider h-36 overflow-hidden">
                  <div className="slider-text1">Search</div>
                  <div className="slider-text2">Plan</div>
                  <div className="slider-text3">Travel</div>
                  <div className="slider-text4">Explore</div>
                </div>
              </div>

              <p className="text-lg font-semibold text-justify opacity-80 max-w-5xl">
                Imagine having every city&apos;s best-kept secrets, scenic
                routes, and essential details at your fingertips. Our platform
                empowers explorers, travelers, and urban adventurers to make the
                most of every city visit. Whether you&apos;re planning a weekend
                getaway, a business trip, or just dreaming about your next
                adventure — we&apos;ve got you covered.
              </p>
            </div>
            <div className="flex flex-col gap-8">
              <SearchBar width="w-full" height="h-28" />
              <div className="flex justify-end">
                <Link href="/search">
                  <button className="bg-dynamic rounded-full p-6 border shadow-md font-medium text-xl hover:brightness-110">
                    Click to Search
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-8 py-4 max-w-screen-2xl m-auto mb-40 md:mt-20 md:flex-row">
        <div className="md:w-1/2 order-2 md:order-1 hidden md:block">
          <FavoriteCities height="h-96" />
        </div>
        <section className="flex flex-col justify-between w-full h-fit order-1 md:w-1/2 md:order-2 md:pr-4 ">
          <div className="mb-4 mb:mb-0">
            <h2 className="text-6xl font-bold mb-4 relative font-serif">
              View your saved destinations!
            </h2>
            <p className="text-lg font-semibold text-justify opacity-80">
              The &quot;Favorite Cities&quot; feature allows you to save cities
              you love or wish to visit. You can create your personal list,
              making it easier to keep track of the cities that interest you the
              most.
            </p>
          </div>
          <div className="my-4 order-2 md:order-1 md:hidden md:w-2/3 ">
            <FavoriteCities height="h-96" />
          </div>
        </section>
      </div>

      <div className="flex flex-col items-center justify-end mt-40 mb-96 mb:mb-0 px-4">
        <div className="max-w-screen-2xl m-auto lg:flex justify-between items-center">
          <div className="flex flex-col py-4 lg:w-1/2 md:py-8 md:mr-8">
            <h1 className="text-6xl font-bold mb-4 font-serif">
              Spin the Globe!
            </h1>
            <p className="text-lg font-semibold text-justify opacity-80 ">
              Ready for a surprise? We&apos;ve spun the globe and landed on
              these exciting cities. Explore them on the map and see where your
              curiosity takes you. Click to zoom in and dive deeper.
            </p>
          </div>
          <div className="lg:w-1/2 w-full">
            <RandomCities />
          </div>
        </div>
      </div>

      <section className="max-w-screen-2xl m-auto py-4 md:mt-40 px-4">
        <div className="mb-8 mb:mb-0">
          <h2 className="text-3xl font-semibold mb-4 opacity-80">
            About This Project
          </h2>
          <p className="text-lg font-semibold text-justify opacity-70">
            This project is the result of my participation in the
            <span className="font-bold"> Digital Nation</span> community and
            course — a nationwide initiative where members collaborate and
            support one another in a journey of continuous learning,
            self-improvement, and professional growth. This is an ongoing
            project where I continue to refine my skills in web development and
            design. Some features and designs are still a work in progress, but
            they reflect my growth and learning journey. Feedback and
            suggestions are always welcome!
          </p>
        </div>

        <div className="">
          <h3 className="text-3xl font-medium mt-4 mb-2 opacity-80">
            Technologies Used
          </h3>
          <ListCarousel />
        </div>
      </section>
    </Wrapper>
  );
}
