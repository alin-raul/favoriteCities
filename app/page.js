import Wrapper from "@/components/pageWrapper/wrapper";
import RandomCities from "@/components/randomCities/RandomCities";
import FavoriteCities from "@/components/favoriteCitiesCard/FavoriteCities";
import ListCarousel from "@/components/list-carousel/ListCarousel";

export default function Home() {
  return (
    <Wrapper>
      <div className=""></div>
      <div className="max-w-screen-2xl m-auto mt-20 md:flex">
        <div className="flex flex-col justify-around py-8 px-4">
          <h1 className="text-6xl font-bold mb-4">
            Hi, this is my personal Favorite Cities project.
          </h1>
          <p className="text-lg opacity-70">
            This project is the result of my participation in the{" "}
            <span className="font-bold">Digital Nation</span> community and
            course — a nationwide initiative where members collaborate and
            support one another in a journey of continuous learning,
            self-improvement, and professional growth.
          </p>
        </div>
        <RandomCities />
      </div>

      <section className="max-w-screen-2xl m-auto mt-20">
        <h2 className="text-4xl font-semibold mb-4">About This Project</h2>
        <p className="text-lg mb-4">
          This is an ongoing project where I continue to refine my skills in web
          development and design. Some features and designs are still a work in
          progress, but they reflect my growth and learning journey. Feedback
          and suggestions are always welcome!
        </p>
        <h3 className="text-3xl font-medium mb-2">Technologies Used</h3>
        <ListCarousel />
      </section>

      <section className="flex flex-col md:flex-row justify-center items-center gap-4 py-4 md:h-screen-minus-nav">
        <FavoriteCities />
      </section>
    </Wrapper>
  );
}
