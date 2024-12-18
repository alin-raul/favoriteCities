import Wrapper from "@/components/pageWrapper/wrapper";
import RandomCities from "@/components/randomCities/RandomCities";
import FavoriteCities from "@/components/favoriteCitiesCard/FavoriteCities";
import ListCarousel from "@/components/list-carousel/ListCarousel";
import Search from "@/components/search/Search";
import GradientBackground from "@/components/cardinal/GradientBackground";
import LazyLoad from "@/components/utils/LazyLoad";

export default function Home() {
  return (
    <Wrapper>
      <div className="flex justify-center">
        <GradientBackground />
      </div>

      <div className="max-w-screen-2xl m-auto h-screen-minus-nav relative">
        <div className="flex flex-col translate-y-96 h-full px-4">
          <h1 className="text-6xl font-bold mb-4">
            Discover,
            <br /> Plan,
            <br /> and Experience like a Pro
          </h1>
          <p className="text-lg text-justify opacity-70">
            Imagine having every city's best-kept secrets, scenic routes, and
            essential details at your fingertips. Our platform empowers
            explorers, travelers, and urban adventurers to make the most of
            every city visit. Whether you’re planning a weekend getaway, a
            business trip, or just dreaming about your next adventure — we’ve
            got you covered.
          </p>
        </div>
      </div>

      <div className=" my-10 max-w-screen-2xl  m-auto">
        <div className="py-2 md:py-8 px-4">
          <h2 className="text-4xl font-bold mb-4">
            Search Destinations & Plan Your Route
          </h2>
          <p className="text-lg text-justify opacity-70">
            Easily search for your favorite destinations and cities, then plan
            the perfect route for your journey. Whether you're exploring new
            places or revisiting old favorites, our intuitive search and routing
            tools make trip planning simple and stress-free.
          </p>
        </div>
        <div className="order-3 md:order-2 max-w-screen-2xl m-auto rounded-2xl border shadow-lg">
          <LazyLoad>
            <Search height="h-[600px]" noFetch={true} />
          </LazyLoad>
        </div>
        <div className="flex flex-col gap-8 py-4 max-w-screen-xl m-auto md:mt-20 md:flex-row">
          <div className="md:w-2/3 order-2 md:order-1 hidden md:block">
            <FavoriteCities height="h-96" />
          </div>

          <section className="flex flex-col justify-between w-full md:max-w-1/2 order-1 md:order-2 md:px-4">
            <div className="">
              <h2 className="text-6xl font-bold mb-4 relative">
                View your saved destinations!
              </h2>
              <p className="text-lg text-justify opacity-70 mb-4">
                The "Favorite Cities" feature allows you to save cities you love
                or wish to visit. You can create your personal list, making it
                easier to keep track of the cities that interest you the most.
              </p>
            </div>
            <div className="my-4 order-2 md:order-1 md:hidden md:w-2/3 ">
              <FavoriteCities height="h-96" />
            </div>
          </section>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center m-auto">
        <div className="max-w-screen-xl m-auto lg:mt-20 lg:flex">
          <div className="flex flex-col py-4 md:py-8 px-4">
            <h1 className="text-6xl font-bold mb-4">Spin the Globe!</h1>
            <p className="text-lg text-justify opacity-70">
              Ready for a surprise? We've spun the globe and landed on these
              exciting cities. Explore them on the map and see where your
              curiosity takes you. Click to zoom in and dive deeper.
            </p>
          </div>
          <RandomCities />
        </div>
      </div>

      <section className="max-w-screen-2xl m-auto py-4 md:mt-40">
        <h2 className="text-4xl font-semibold mb-4">About This Project</h2>
        <p className="text-lg text-justify opacity-70">
          This project is the result of my participation in the
          <span className="font-bold"> Digital Nation</span> community and
          course — a nationwide initiative where members collaborate and support
          one another in a journey of continuous learning, self-improvement, and
          professional growth. This is an ongoing project where I continue to
          refine my skills in web development and design. Some features and
          designs are still a work in progress, but they reflect my growth and
          learning journey. Feedback and suggestions are always welcome!
        </p>
        <h3 className="text-3xl font-medium mt-4 mb-2">Technologies Used</h3>
        <ListCarousel />
      </section>
    </Wrapper>
  );
}
