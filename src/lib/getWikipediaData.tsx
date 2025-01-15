"use server";

import { citiesTranslations } from "@/globals/constants";

// Define the type for the Wikipedia response
type WikipediaSearchData = {
  description: string;
  image: string | null;
  link: string | null;
};

type WikipediaPageData = {
  extract: string;
  thumbnail: { source: string } | null;
};

const getHighestResolutionImage = (url: string): string => {
  return url.replace(/(\d+)px/, "2000px");
};

const translateCityName = (cityName: string): string => {
  return citiesTranslations[cityName] || cityName;
};

export const getWikipediaData = async (
  cityName: string
): Promise<WikipediaSearchData> => {
  try {
    const translatedCityName = translateCityName(cityName);

    const searchResponse = await fetch(
      `https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=${encodeURIComponent(
        translatedCityName
      )}`
    );
    const searchData: string[] = await searchResponse.json();

    if (searchData[1].length === 0) {
      return {
        description: "No Wikipedia data available for this city.",
        image: null,
        link: null,
      };
    }

    for (let i = 0; i < searchData[1].length; i++) {
      const firstResult = searchData[1][i];
      const pageUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts|pageimages&exintro&titles=${encodeURIComponent(
        firstResult
      )}&redirects=true`;

      const pageResponse = await fetch(pageUrl);
      const pageData: {
        query: { pages: { [key: string]: WikipediaPageData } };
      } = await pageResponse.json();
      const page = pageData.query.pages;
      const pageId = Object.keys(page)[0];

      if (pageId && page[pageId].extract) {
        const extractText = page[pageId].extract;
        if (extractText.includes("may refer to:")) {
          continue;
        }

        const imageUrl = page[pageId].thumbnail
          ? getHighestResolutionImage(page[pageId].thumbnail.source)
          : null;

        const pageLink = `https://en.wikipedia.org/wiki/${encodeURIComponent(
          firstResult
        )}`;

        return {
          description: extractText,
          image: imageUrl,
          link: pageLink,
        };
      }
    }

    return {
      description: "No valid Wikipedia extract data found for this city.",
      image: null,
      link: null,
    };
  } catch (error) {
    console.error("Failed to fetch Wikipedia data:", error);
    return {
      description: "Failed to fetch Wikipedia data.",
      image: null,
      link: null,
    };
  }
};
