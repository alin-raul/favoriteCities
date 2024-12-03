import Wrapper from "@/components/pageWrapper/wrapper";
import Weather from "@/components/weather/Weather";
import ReactHtmlParser from "html-react-parser";
import { citiesTranslations } from "@/globals/constants";
import Image from "next/image";

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

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,precipitation,windspeed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;

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

  const fetchWikipediaData = async (cityName) => {
    try {
      const translatedCityName = translateCityName(cityName);

      const searchResponse = await fetch(
        `https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=${encodeURIComponent(
          translatedCityName
        )}`
      );
      const searchData = await searchResponse.json();

      if (searchData[1].length === 0) {
        return {
          description: "No Wikipedia data available for this city.",
          image: null,
        };
      }

      for (let i = 0; i < searchData[1].length; i++) {
        const firstResult = searchData[1][i];
        const pageUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts|pageimages&exintro&titles=${encodeURIComponent(
          firstResult
        )}&redirects=true`;

        const pageResponse = await fetch(pageUrl);
        const pageData = await pageResponse.json();
        const page = pageData.query.pages;
        const pageId = Object.keys(page)[0];

        if (pageId && page[pageId].extract) {
          const extractText = page[pageId].extract;
          if (extractText.includes("may refer to")) {
            continue;
          }

          const imageUrl = page[pageId].thumbnail
            ? getHighestResolutionImage(page[pageId].thumbnail.source)
            : null;

          return {
            description: ReactHtmlParser(extractText),
            image: imageUrl,
          };
        }
      }

      return {
        description: "No valid Wikipedia extract data found for this city.",
        image: null,
      };
    } catch (error) {
      console.error("Failed to fetch Wikipedia data:", error);
      return { description: "Failed to fetch Wikipedia data.", image: null };
    }
  };

  const getHighestResolutionImage = (url) => {
    return url.replace(/(\d+)px/, "2000px"); // Replace any resolution with 1000px
  };

  const translateCityName = (cityName) => {
    return citiesTranslations[cityName] || cityName;
  };

  const weatherData = await fetchWeatherData(location);
  const { description, image } = await fetchWikipediaData(cityName);

  const { country, countrycode, type, osm_value, name } =
    location[0].properties;

  if (location.length === 0) {
    return <div>No locations found for {cityName}.</div>;
  }

  return (
    <Wrapper>
      <div className="max-w-screen-2xl m-auto justify-around p-4 rounded-xl mt-8 gap-6 2xl:flex ">
        <div className="w-auto mb-4 md:mb-0">
          <div className="custom-outline w-fit py-4 px-6 bg-[#0f1a57] text-white rounded-2xl mb-16">
            <h3 className="font-bold text-7xl mb-2">{name}</h3>
            <h3 className="font-normal leading-3 text-sm">{country}</h3>
          </div>
          <div className="my-8">
            <span className="text-md mt-2">{description}</span>
          </div>
          {image && (
            <div className="my-8">
              <Image
                src={image}
                alt={`Image of ${name}`}
                width={1000}
                height={1000}
                className="w-full rounded-xl"
              />
            </div>
          )}
        </div>
        <Weather weatherData={weatherData} name={name} country={country} />
      </div>
    </Wrapper>
  );
};

export default CityPage;
