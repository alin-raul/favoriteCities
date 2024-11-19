import TransitionLink from "@/components/utils/TransitionLink";
import { getFavoriteCities } from "@/globals/fetchDb";
import DeleteFavorite from "@/components/deleteFavoritesButton/DeleteFavorites";

const Favorites = async () => {
  const citiesData = await getFavoriteCities();
  const cities = citiesData.data;

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <h1 className="text-2xl font-semibold mt-16 text-center">
        Your Favorite Cities
        <br />
        <span className="text-sm font-normal opacity-70">
          *loaded from database*
        </span>
      </h1>
      {cities.length === 0 ? (
        <div className="absolute top-0 h-screen flex items-center opacity-60">
          <p>No cities added yet.</p>
        </div>
      ) : (
        <div className="mt-32 max-w-screen-2xl gap-2 justify-center items-center sm:grid lg:grid-cols-2 2xl:grid-cols-3">
          {cities.map((city, index) => (
            <TransitionLink
              href={`/cities/${city.name}`}
              className="w-full h-full p-4 rounded-xl shadow-lg mb-4 md:mb-0 flex flex-col justify-between bg-dynamic bg-dynamic-h"
              key={index}
            >
              <div className="relative">
                <h2 className="text-lg font-semibold">{city.name}</h2>
                <p>Country: {city.country}</p>
                <p>Type: {city.osm_value}</p>
                <p>
                  Coordinates: ({city.geometry.coordinates[1].toFixed(4)},{" "}
                  {city.geometry.coordinates[0].toFixed(4)})
                </p>
                <p>Bounding Box: [{city.extent.join(", ")}]</p>
              </div>
              <div className="flex justify-end mt-4">
                <DeleteFavorite label="Remove" city={city} />
              </div>
            </TransitionLink>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
