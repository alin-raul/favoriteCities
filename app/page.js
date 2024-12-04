import Wrapper from "@/components/pageWrapper/wrapper";
import RandomCities from "@/components/randomCities/RandomCities";
import FavoriteCities from "@/components/favoriteCitiesCard/FavoriteCities";
import ListCarousel from "@/components/list-carousel/ListCarousel";

export default function Home() {
  return (
    <Wrapper>
      <div className=""></div>
      <div className="max-w-screen-2xl m-auto lg:mt-20 lg:flex">
        <div className="flex flex-col justify-around py-4 md:py-8 px-4">
          <h1 className="text-6xl font-bold mb-4">
            Hi, this is my personal Favorite Cities project.
          </h1>
          <p className="text-lg text-justify opacity-70 lg:mr-6">
            This project is the result of my participation in the{" "}
            <span className="font-bold">Digital Nation</span> community and
            course — a nationwide initiative where members collaborate and
            support one another in a journey of continuous learning,
            self-improvement, and professional growth.
          </p>
        </div>
        <RandomCities />
      </div>
      <div className="max-w-screen-2xl m-auto px-4"></div>

      <div className="flex flex-col gap-8 py-4 max-w-screen-2xl m-auto mt-20 md:flex-row">
        <div className="md:w-2/3 order-2 md:order-1">
          <FavoriteCities />
        </div>

        <section className="w-full md:max-w-1/2 order-1 md:order-2 py-4 md:px-4">
          <h2 className="text-6xl font-bold mb-4 ">
            From here you can view your saved cities!
          </h2>
          <p className="text-lg text-justify opacity-70 mb-4">
            The "Favorite Cities" feature allows you to save cities you love or
            wish to visit. You can create your personal list, making it easier
            to keep track of the cities that interest you the most.
          </p>
        </section>
      </div>

      <section className="max-w-screen-2xl m-auto mt-20">
        <h2 className="text-4xl font-semibold mb-4">About This Project</h2>
        <p className="text-lg text-justify mb-4 opacity-70">
          This is an ongoing project where I continue to refine my skills in web
          development and design. Some features and designs are still a work in
          progress, but they reflect my growth and learning journey. Feedback
          and suggestions are always welcome!
        </p>
        <h3 className="text-3xl font-medium mb-2">Technologies Used</h3>
        <ListCarousel />
      </section>
    </Wrapper>
  );
}
