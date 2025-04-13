// CityPage.tsx (incorporating selectBestLocation)

import React from "react";
import Wrapper from "@/components/pageWrapper/wrapper";
import searchCity from "@/lib/searchCity";
import Weather from "@/components/weather/Weather";
import Image from "next/image";
import { getWikipediaData } from "@/lib/getWikipediaData";
import { getWeatherData } from "@/lib/getWeather";
import Clock from "@/components/clock/Clock";
import ReactHtmlParser from "html-react-parser";
import type { WeatherData } from "@/lib/getWeather";
import type { CitiesQuery } from "@/lib/searchCity"; // Ensure this type matches what searchCity returns

const selectBestLocation = (
  locations: CitiesQuery[],
  searchedCityName: string
): CitiesQuery | null => {
  if (!locations || locations.length === 0) {
    return null;
  }

  if (locations.length === 1) {
    return locations[0];
  }

  const lowerCaseSearchedName = searchedCityName.toLowerCase();
  const preferredOsmValues = [
    "city",
    "town",
    "administrative",
    "municipality",
    "village",
  ];

  let bestMatch: CitiesQuery | null = null;

  // 1. Exact name + Preferred Type
  for (const preferredValue of preferredOsmValues) {
    const exactMatch = locations.find(
      (loc) =>
        loc.properties.osm_value?.toLowerCase() === preferredValue &&
        loc.properties.name?.toLowerCase() === lowerCaseSearchedName
    );
    if (exactMatch) {
      console.log(
        `Selected location via: Exact Name Match + Preferred Type (${preferredValue})`
      );
      return exactMatch; // Return immediately once found
    }
  }

  // 2. Preferred Type (any name)
  for (const preferredValue of preferredOsmValues) {
    const typeMatch = locations.find(
      (loc) => loc.properties.osm_value?.toLowerCase() === preferredValue
    );
    if (typeMatch) {
      console.log(
        `Selected location via: Preferred Type Match (${preferredValue})`
      );
      return typeMatch; // Return immediately
    }
  }

  // 3. Fallback: Type 'city'
  const cityTypeMatch = locations.find(
    (loc) => loc.properties.type?.toLowerCase() === "city"
  );
  if (cityTypeMatch) {
    console.log(`Selected location via: Fallback Type Match ('city')`);
    return cityTypeMatch;
  }

  // 4. Final Fallback: First result
  console.warn(
    `Could not find a preferred match for "${searchedCityName}". Defaulting to the first result.`
  );
  return locations[0];
};
//++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+ END HELPER FUNCTION                               +
//++++++++++++++++++++++++++++++++++++++++++++++++++++++

const CityPage = async ({ params }: { params: { city: string[] } }) => {
  // Extract city name from URL params
  const cityName = decodeURIComponent(params.city[0]);

  // Fetch all potential locations using the search function
  const allLocations: CitiesQuery[] = await searchCity(cityName);
  console.log(
    `Found ${allLocations.length} potential locations for "${cityName}"`
  );

  // ***** APPLY THE FILTERING LOGIC *****
  const selectedLocation = selectBestLocation(allLocations, cityName);

  // Handle case where no location is found or selected
  if (!selectedLocation) {
    return (
      <Wrapper className="h-screen-minus-nav w-screen flex justify-center items-center">
        <div className="text-center p-4">
          <h2 className="text-2xl font-semibold mb-4">Location Not Found</h2>
          <p>
            Sorry, we couldn&apos;t find specific data for &ldquo;{cityName}
            &ldquo;.
          </p>
          <p>Please check the spelling or try a different search term.</p>
        </div>
      </Wrapper>
    );
  }

  console.log("Selected location for page:", selectedLocation);

  // --- Proceed using the selectedLocation ---

  // Fetch weather data for the *selected* location
  // Wrap in try-catch as external APIs can fail
  let weatherData: WeatherData | null = null;
  try {
    weatherData = await getWeatherData(selectedLocation);
  } catch (error) {
    console.error(`Failed to fetch weather data for ${cityName}:`, error);
    // Decide how to handle weather fetch failure (e.g., show message, skip section)
  }

  // Use the name from the *selected* location for Wikipedia search
  const locationName = selectedLocation.properties.name || cityName;
  let wikiData = { description: null, image: null, link: null };
  try {
    wikiData = await getWikipediaData(locationName);
  } catch (error) {
    console.error(`Failed to fetch Wikipedia data for ${locationName}:`, error);
    // Handle Wikipedia fetch failure
  }
  const { description, image, link } = wikiData;

  // Extract properties from the *selected* location with defaults
  const {
    country = "N/A",
    countrycode = "N/A",
    type = "N/A",
    osm_value = "N/A",
    name = "N/A",
  } = selectedLocation.properties;

  // Determine the best name to display
  const displayName = name !== "N/A" ? name : cityName;

  return (
    <Wrapper className="h-screen-minus-nav w-screen flex justify-center">
      <div className="max-w-screen-lg w-full m-auto border rounded-[2rem] gap-6 p-4 shadow-lg my-4">
        {" "}
        {/* Added w-full */}
        <div className="flex flex-col">
          {image ? (
            // Image and Description Section (similar to previous answer)
            <div className="mb-4 w-full">
              <div className="relative w-full max-h-2xl rounded-[1.2rem] overflow-hidden">
                {/* ... Image component ... */}
                <Image
                  src={image}
                  alt={`Image of ${displayName}`}
                  width={1000}
                  height={640}
                  priority
                  style={{
                    objectFit: "cover",
                    height: "auto",
                    maxHeight: "40rem",
                    width: "100%",
                  }}
                  className="rounded-[1.2rem] brightness-75"
                />
                {/* ... Description overlay ... */}
                <div
                  className="absolute inset-0 z-10"
                  style={{
                    maskImage:
                      "linear-gradient(to top, rgba(0,0,0,1) 10%, transparent)",
                    WebkitMaskImage:
                      "linear-gradient(to top, rgba(0,0,0,1) 20%, transparent)",
                  }}
                >
                  {description && (
                    <div className="absolute bottom-0 px-4 py-2 w-full bg-gradient-to-t from-black/70 to-transparent">
                      <span className="text-md mt-2 text-justify line-clamp-5 text-white ">
                        {ReactHtmlParser(description)}
                      </span>
                      {link && (
                        <div className="w-full text-end mt-1">
                          {" "}
                          {/* Check link exists */}
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-400 hover:text-blue-100 hover:underline visited:text-violet-400 "
                          >
                            Wikipedia
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-16"></div> // Placeholder if no image
          )}

          {/* Info Header Section (Name, Country, Weather, Clock) */}
          <div className="flex justify-between items-start p-4 flex-wrap gap-4">
            <div className="flex-grow min-w-[200px]">
              <h3 className="text-4xl sm:text-5xl mb-1">{displayName}</h3>
              {country !== "N/A" && (
                <h3 className="font-normal leading-3 text-sm opacity-80">
                  {country} ({countrycode})
                </h3>
              )}
              <p className="text-xs opacity-60 mt-1">
                Type: {type}, OSM: {osm_value}
              </p>
            </div>
            {/* Only render Weather/Clock if weatherData is available */}
            {weatherData && (
              <div className="flex-shrink-0">
                <Weather
                  weatherData={weatherData}
                  name={displayName}
                  country={country}
                />
                <Clock weatherData={weatherData} />
              </div>
            )}
            {!weatherData && (
              <div className="flex-shrink-0 text-sm opacity-70">
                Weather data unavailable.
              </div>
            )}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default CityPage;
