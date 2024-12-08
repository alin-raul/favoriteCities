import TransitionLink from "@/components/utils/TransitionLink";
import DeleteFavorite from "@/components/deleteFavoritesButton/DeleteFavorites";
import Wrapper from "@/components/pageWrapper/wrapper";
import { getFavoriteCities } from "@/lib/getFavoriteCities";

const Favorites = async () => {
  const citiesData = await getFavoriteCities();

  const cities = citiesData.data;

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
          <div className="mt-32 w-full max-w-screen-2xl gap-2 justify-center items-center grid lg:grid-cols-2 2xl:grid-cols-3">
            {cities.map((city, index) => (
              <div
                key={index}
                className="p-4 bg-dynamic border rounded-2xl shadow-inner relative transition-all hover:shadow-md"
              >
                <TransitionLink href={`/cities/${city.name}`} card={true}>
                  <div className="relative">
                    <h2 className="text-lg font-semibold">{city.name}</h2>
                    <p>Country: {city.country}</p>
                    <p>Type: {city.osm_value}</p>
                  </div>
                  <div className="flex justify-end mt-4">
                    <DeleteFavorite label="Remove" city={city} />
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
