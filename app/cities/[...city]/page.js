import { weatherCodeDescriptions } from "@/globals/constants";

const CityPage = async ({ params }) => {
  const resolvedParams = await params;
  const cityName = decodeURIComponent(resolvedParams.city[0]);
  console.log(cityName);

  const fetchLocations = async (searchQuery) => {
    try {
      const response = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(searchQuery)}`
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      return data.features || [];
    } catch (error) {
      console.error("Failed to fetch locations:", error);
      return [];
    }
  };

  const location = await fetchLocations(cityName);

  const fetchWeatherData = async (location) => {
    if (
      !location ||
      !location[0] ||
      !location[0].geometry ||
      !location[0].geometry.coordinates
    ) {
      console.error("Invalid location data");
      return null;
    }

    const latitude = location[0].geometry.coordinates[1];
    const longitude = location[0].geometry.coordinates[0];

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data || {};
    } catch (error) {
      console.error("Error fetching weather data:", error.message);
      return null;
    }
  };

  const weatherData = await fetchWeatherData(location);

  const getWeatherDescription = (weatherCode) => {
    return weatherCodeDescriptions[weatherCode] || "Unknown weather condition";
  };

  const { country, countrycode, type, osm_value, name } =
    location[0].properties;

  if (location.length === 0) {
    return <div>No locations found for {cityName}.</div>;
  }

  return (
    <div className="max-w-screen-2xl m-auto justify-around p-4 rounded-xl mt-8 gap-6 md:flex ">
      <div className="p-6 bg-dynamic rounded-xl shadow-lg w-full mb-4 md:mb-0 md:w-1/2 lg:w-2/3">
        <h1 className="text-2xl font-bold mb-2">
          {`This is ${name}'s main page.`}
        </h1>
        <ul className="list-disc pl-6 mt-4">
          <li>Country Code: {countrycode}</li>
          <li>Country: {country}</li>
          <li>Type: {type}</li>
        </ul>
      </div>
      <div className="p-6 bg-dynamic rounded-xl shadow-lg w-full md:w-1/2 lg:w-1/3 ">
        <h2 className="text-xl font-bold mb-4">Current Weather</h2>
        <div className="flex flex-col items-center">
          <div className="text-4xl font-extrabold mb-2">
            {weatherData.current_weather.temperature}
            {weatherData.current_weather_units.temperature}
          </div>
          <p className="text-lg capitalize">
            {getWeatherDescription(weatherData.current_weather.weathercode)}
          </p>
          <p className="text-sm mt-2">
            Wind: {weatherData.current_weather.windspeed}{" "}
            {weatherData.current_weather_units.windspeed}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CityPage;
