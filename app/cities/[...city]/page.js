import Wrapper from "@/components/pageWrapper/wrapper";
import Weather from "@/components/weather/Weather";
import Image from "next/image";
import { getWikipediaData } from "@/lib/getWikipediaData";
import { getWeatherData } from "@/lib/getWeather";
import Clock from "@/components/clock/Clock";

const CityPage = async ({ params }) => {
  const resolvedParams = await params;
  const cityName = decodeURIComponent(resolvedParams.city[0]);

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

  const weatherData = await getWeatherData(location);

  const { description, image } = await getWikipediaData(cityName);

  const { country, countrycode, type, osm_value, name } =
    location[0].properties;

  if (location.length === 0) {
    return <div>No locations found for {cityName}.</div>;
  }

  return (
    <Wrapper>
      <div className="grid grid-flow-col justify-between mt-12 max-w-screen-2xl p-4 m-auto">
        <div className="custom-outline w-fit h-fit py-4 px-6 bg-[#0f1a57] text-white rounded-2xl">
          <h3 className="font-bold text-6xl md:text-7xl mb-2">{name}</h3>
          <h3 className="font-normal leading-3 text-sm opacity-80">
            {country}
          </h3>
        </div>
        <Clock weatherData={weatherData} />
      </div>
      <div className="max-w-screen-2xl m-auto justify-around p-4 rounded-xl gap-6 2xl:flex ">
        <div className="w-auto mb-4 md:mb-0">
          <div className="my-8">
            <span className="text-md mt-2 text-justify">{description}</span>
          </div>
        </div>
        <div>
          <div>
            {image && (
              <div className="my-8 w-full min-w-[600px] rounded-3xl shadow-xl">
                <Image
                  src={image}
                  alt={`Image of ${name}`}
                  width={1000}
                  height={1000}
                  className="w-full rounded-3xl shadow-inner"
                />
              </div>
            )}
            <Weather weatherData={weatherData} name={name} country={country} />
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default CityPage;
