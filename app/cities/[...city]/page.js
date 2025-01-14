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
    <Wrapper className="h-screen-minus-nav w-screen flex justify-center">
      <div className="max-w-screen-lg m-auto border rounded-[2rem] gap-6 p-4 shadow-lg">
        <div className="flex flex-col">
          {image && (
            <div className="mb-8 w-full">
              <div className="relative w-full max-h-2xl rounded-[1.2rem] overflow-hidden">
                <Image
                  src={image}
                  alt={`Image of ${name}`}
                  width={1000}
                  height={640}
                  style={{
                    objectFit: "cover",
                    height: "40rem",
                  }}
                  className="w-full max-h-2xl rounded-[1.2rem] brightness-75"
                />
                <div
                  className="absolute inset-0 z-10"
                  style={{
                    maskImage:
                      "linear-gradient(to top, rgba(0,0,0,1) 10%, transparent)",
                    WebkitMaskImage:
                      "linear-gradient(to top, rgba(0,0,0,1) 20%, transparent)",
                    backdropFilter: "blur(20px)",
                  }}
                >
                  <div className="absolute bottom-0 px-4 py-2">
                    <span className="text-md mt-2 text-justify line-clamp-5 text-white">
                      {description}
                    </span>
                    <div className="w-full text-end">
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-end text-blue-300 hover:text-blue-100 hover:underline visited:text-violet-300"
                      >
                        Wikipedia
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center p-4">
                <div>
                  <h3 className="text-5xl mb-2">{name}</h3>
                  <h3 className="font-normal leading-3 text-sm opacity-80">
                    {country}
                  </h3>
                </div>
                <div className="">
                  <Weather
                    weatherData={weatherData}
                    name={name}
                    country={country}
                  />
                  <Clock weatherData={weatherData} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export default CityPage;
