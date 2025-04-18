import TransitionLink from "@/components/utils/TransitionLink";
import DeleteFavorite from "@/components/deleteFavoritesButton/DeleteFavorites";
import Wrapper from "@/components/pageWrapper/wrapper";
import { getFavoriteCities } from "@/lib/getFavoriteCities";
import getFlagEmoji from "@/lib/getFlagEmoji";
import Image from "next/image";
import type { City } from "@/lib/getFavoriteCities";
import { GiModernCity } from "react-icons/gi";

const Favorites = async (): Promise<React.ReactNode> => {
  const cities: City[] = await getFavoriteCities();

  // Might use later

  // const citiesWithFlag = cities.map((city) => ({
  //   ...city,
  //   flagEmoji: getFlagEmoji(city.countrycode),
  // }));

  return (
    <Wrapper>
      <div className="w-full flex flex-col justify-center items-center relative">
        <h1 className="text-2xl font-semibold mt-16 text-center">
          Your Favorite Cities
          <br />
          <span className="text-sm font-normal opacity-70">
            *loaded from database*
          </span>
        </h1>

        {cities.length === 0 ? (
          <div className="absolute top-0 h-screen-minus-nav flex items-center opacity-60">
            <p>No cities added yet.</p>
          </div>
        ) : (
          <div className="flex flex-col mt-32 w-full max-w-screen-2xl gap-4 justify-center items-center lg:grid lg:grid-cols-2 2xl:grid-cols-3 last:mb-4">
            {cities.map((city, index) => (
              <div
                key={city.name + `-${index}`}
                className="relative w-full h-full  "
              >
                <div className="absolute inset-0 w-full h-full z-10 rounded-[3rem]" />

                <TransitionLink
                  href={`/cities/${city.name}`}
                  className="w-full h-full p-6 border dynamic-border rounded-[3rem] shadow-inner flex flex-col justify-between bg-dynamic bg-dynamic-h hover:shadow-md active:shadow-lg transition-all relative z-30"
                  card={true}
                  key={index}
                >
                  {city.image ? (
                    <Image
                      src={city.image}
                      alt={`${city.name} image`}
                      width={600}
                      height={400}
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                      }}
                      className="rounded-[2rem] max-h-72 w-full mb-4 z-40"
                    />
                  ) : (
                    <div className="h-[288px] w-full flex justify-center items-center  ">
                      <GiModernCity className="w-14 h-14" />
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-auto z-50">
                    <div className="relative">
                      <h2 className="text-5xl font-semibold">{city.name}</h2>
                      <span className="opacity-80">
                        {city.country}, {city.countrycode}
                      </span>
                    </div>
                    <div>
                      <DeleteFavorite label="Remove" city={city} />
                    </div>
                  </div>
                </TransitionLink>
              </div>
            ))}
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default Favorites;
