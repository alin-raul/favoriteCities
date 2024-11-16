import TransitionLink from "@/components/utils/TransitionLink";

const Favorites = async () => {
  const getFavoriteCities = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/cities", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Cities fetched");
        return data;
      } else {
        console.error("Error loading cities:", data.message);
      }
    } catch (error) {
      console.error("Failed to load cities:", error);
    }
  };

  const citiesData = await getFavoriteCities();
  const cities = citiesData.data;
  // console.log(cities);

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <h1 className="text-2xl font-semibold mt-16">
        Cities loaded from database
      </h1>
      {cities.length === 0 ? (
        <p>No cities added yet.</p>
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
            </TransitionLink>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
