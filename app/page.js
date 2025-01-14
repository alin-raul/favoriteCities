import Wrapper from "@/components/pageWrapper/wrapper";
import RandomCities from "@/components/randomCities/RandomCities";
import FavoriteCities from "@/components/favoriteCitiesCard/FavoriteCities";
import ListCarousel from "@/components/list-carousel/ListCarousel";
import GradientBackground from "@/components/cardinal/GradientBackground";
import SearchBar from "@/components/search/SearchBar";

export default function Home() {
  return (
    <div>
      <div className="pointer-events-none z-0">
        <div className="noise bg-[url('/images/other/noise.webp')] bg-repeat h-screen w-screen fixed top-0 left-0"></div>
        <div className="flex justify-center ">
          <GradientBackground />
        </div>
      </div>

      <div className="max-w-3xl m-auto h-screen-minus-nav relative">
        <div className="flex h-full px-4">
          <div className="flex flex-col m-auto gap-12">
            <div className="w-fit">
              <div className="flex items-center text-9xl h-24 font-bold mb-8 font-serif ">
                <div className="slider-container h-36 overflow-hidden">
                  <div className="slider-text1">Search</div>
                  <div className="slider-text2">Plan</div>
                  <div className="slider-text3">Travel</div>
                  <div className="slider-text4">Explore</div>
                </div>
              </div>

              <p className="text-xl text-justify font-light opacity-80 max-w-5xl">
                Imagine having every city&apos;s best-kept secrets, scenic
                routes, and essential details at your fingertips. Our platform
                empowers explorers, travelers, and urban adventurers to make the
                most of every city visit. Whether you&apos;re planning a weekend
                getaway, a business trip, or just dreaming about your next
                adventure — we&apos;ve got you covered.
              </p>
            </div>
            <div className="flex flex-col items-end gap-8">
              <SearchBar width="w-full" height="h-28" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center h-[1200px] gradient-bg-cities">
        <RandomCities />
      </div>

      <Wrapper>
        <section className="flex flex-col justify-center pb-4 mb-10 xl:max-w-[1900px] h-[1200px] m-auto">
          <div className="flex flex-col items-center justify-center xl:max-w-screen-lg text-center mb-8 lg:hidden">
            <h2 className="text-6xl font-bold mb-4 relative font-serif">
              View your saved destinations!
            </h2>
            <p className="text-xl font-light opacity-80 max-w-2xl">
              The &quot;Favorite Cities&quot; feature allows you to save cities
              you love or wish to visit. You can create your personal list,
              making it easier to keep track of the cities that interest you the
              most.
            </p>
          </div>

          <FavoriteCities />
        </section>
      </Wrapper>

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
    </div>
  );
}
