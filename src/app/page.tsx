import Wrapper from "@/components/pageWrapper/wrapper";
import RandomCities from "@/components/randomCities/RandomCities";
import FavoriteCities from "@/components/favoriteCitiesCard/FavoriteCities";
import ListCarousel from "@/components/list-carousel/ListCarousel";
import SlidingTitle from "@/components/slidingTitle/SlidingTitle";
import CardinalRotating from "@/components/cardinal/CardinalRotating";
import Minimap from "@/components/minimap/minimap";
import LavaLampCanvas from "@/components/cardinal/LavaLampCanvas";

const Home: React.FC = () => {
  return (
    <div className="relative z-20">
      <div className="noise bg-[url('/images/other/noise.webp')] bg-repeat h-screen w-screen fixed top-0 left-0"></div>

      <div className="m-auto h-screen relative">
        <div className="flex justify-start absolute w-full z-[-1] ">
          <CardinalRotating
            invert={false}
            position={"translate-x-[10%] scale-[8]"}
          />
        </div>
        <SlidingTitle />
      </div>

      {/* <Wrapper>
        <div className="box p-8 w-[36rem] h-[26rem] m-auto relative">
          <Minimap />
        </div>
      </Wrapper> */}

      <div className=" flex flex-col justify-center h-[1200px] gradient-bg-cities">
        <div className="flex flex-col py-4 mx-auto text-center">
          <h1 className="font-bold text-6xl md:text-8xl mx-auto mb-4 font-serif">
            Spin the Globe!
          </h1>
          <p className="text-lg md:max-w-3xl xl:max-w-5xl lg:text-xl xl:text-2xl font-light opacity-80 mb-8 max-w-xl ">
            Spun the globe and landed on these exciting cities. Explore them on
            the map and see where your curiosity takes you.
          </p>
        </div>
        <div>
          <RandomCities />
        </div>
      </div>

      <Wrapper>
        <section className="flex flex-col justify-center pb-4 xl:max-w-[1900px] m-auto">
          <div className="flex flex-col items-center justify-center xl:max-w-screen-lg text-center mb-8 lg:hidden">
            <h2 className="font-bold text-5xl xl:text-7xl 2xl:text-9xl mx-auto mb-4 font-serif">
              View your saved destinations!
            </h2>
            <p className="text-lg md:max-w-3xl xl:max-w-5xl lg:text-xl xl:text-2xl font-light opacity-80">
              The &quot;Favorite Cities&quot; feature allows you to save cities
              you love or wish to visit. You can create your personal list,
              making it easier to keep track of the cities that interest you the
              most.
            </p>
          </div>
          <FavoriteCities />
        </section>
      </Wrapper>

      <Wrapper>
        <section className="max-w-screen-2xl m-auto py-4 md:mt-40">
          <div className="mb-8 mb:mb-0">
            <h2 className="text-4xl font-semibold mb-4 opacity-90">
              About This Project
            </h2>
            <p className="text-lg font-semibold text-justify opacity-70">
              This project is the result of my participation in the
              <span className="font-bold"> Digital Nation</span> community and
              course — a nationwide initiative where members collaborate and
              support one another in a journey of continuous learning,
              self-improvement, and professional growth. This is an ongoing
              project where I continue to refine my skills in web development
              and design. Some features and designs are still a work in
              progress, but they reflect my growth and learning journey.
              Feedback and suggestions are always welcome!
            </p>
          </div>

          <h3 className="text-3xl font-medium mt-4 mb-2 opacity-90">
            Technologies Used
          </h3>
        </section>
      </Wrapper>
      <ListCarousel />

      <div className="hero"></div>
    </div>
  );
};

export default Home;
