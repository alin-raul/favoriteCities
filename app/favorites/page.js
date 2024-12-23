import TransitionLink from "@/components/utils/TransitionLink";
import DeleteFavorite from "@/components/deleteFavoritesButton/DeleteFavorites";
import Wrapper from "@/components/pageWrapper/wrapper";
import { getFavoriteCities } from "@/lib/getFavoriteCities";
import getFlagEmoji from "@/lib/getFlagEmoji";

const Favorites = async () => {
  const citiesData = await getFavoriteCities();

  const cities = citiesData.data;

  const citiesWithFlag = cities.map((city) => ({
    ...city,
    flagEmoji: getFlagEmoji(city.countrycode),
  }));

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
          <div className="mt-32 w-full max-w-screen-2xl gap-2 justify-center items-center lg:grid lg:grid-cols-2 2xl:grid-cols-3">
            {citiesWithFlag.map((city, index) => (
              <TransitionLink
                href={`/cities/${city.name}`}
                className="w-full h-full p-6 border rounded-xl shadow-inner mb-2 flex flex-col justify-between bg-dynamic bg-dynamic-h hover:shadow-md active:scale-105 active:shadow-lg transition-all"
                card={true}
                key={index}
              >
                <div className="flex justify-between">
                  <div className="relative">
                    <h2 className="text-lg font-semibold">{city.name}</h2>
                    <span>
                      {city.country}, {city.countrycode}{" "}
                    </span>
                  </div>
                  <span className="text-6xl">{city.flagEmoji}</span>
                </div>

                <div className="flex justify-end mt-4">
                  <DeleteFavorite label="Remove" city={city} />
                </div>
              </TransitionLink>
            ))}
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default Favorites;
