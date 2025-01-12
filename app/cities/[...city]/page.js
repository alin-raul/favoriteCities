import Wrapper from "@/components/pageWrapper/wrapper";
import searchCity from "@/lib/searchCity";
import Weather from "@/components/weather/Weather";
import Image from "next/image";
import Link from "next/link";
import { getWikipediaData } from "@/lib/getWikipediaData";
import { getWeatherData } from "@/lib/getWeather";
import Clock from "@/components/clock/Clock";

const CityPage = async ({ params }) => {
  const resolvedParams = await params;
  const cityName = decodeURIComponent(resolvedParams.city[0]);

  const location = await searchCity(cityName);

  const weatherData = await getWeatherData(location[0]);

  const { description, image, link } = await getWikipediaData(cityName);

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
      <div className="max-w-screen-2xl m-auto justify-around p-4 rounded-2xl gap-6 2xl:flex ">
        <div className="w-auto mb-8 bg-dynamic rounded-3xl shadow-lg p-4 2xl:mb-0">
          <div className="flex flex-col">
            <span className="text-md mt-2 text-justify">{description}</span>
            <div className="w-full text-end">
              <Link
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-end text-blue-700 hover:text-blue-500 hover:underline visited:text-violet-700"
              >
                Wikipedia
              </Link>
            </div>
          </div>
        </div>
        <div>
          <div>
            {image && (
              <div className="mb-8 w-full  rounded-3xl shadow-xl">
                <Image
                  src={image}
                  alt={`Image of ${name}`}
                  width={600}
                  height={600}
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
