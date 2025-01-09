const fetchImageFromFlickr = async (cityName, lat, lon) => {
  const apiKey = process.env.NEXT_PUBLIC_FLICKR_API_KEY;
  const queries = [
    `${cityName} cityscape`,
    `${cityName} skyline`,
    `${cityName}`,
    `${cityName} aerial view`,
  ];
  const radius = 20; // Broader search radius

  for (const query of queries) {
    try {
      const response = await fetch(
        `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&text=${encodeURIComponent(
          query
        )}&tags=cityscape,skyline&lat=${lat}&lon=${lon}&radius=${radius}&sort=relevance&format=json&nojsoncallback=1&per_page=5`
      );
      const data = await response.json();

      if (data.photos && data.photos.photo.length > 0) {
        const photo = data.photos.photo[0];
        return `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`;
      }
    } catch (error) {
      console.error(`Error fetching image for query "${query}":`, error);
    }
  }

  return ""; // Return an empty string if no image is found
};

const handleAddCity = async (city) => {
  if (!city || !city.properties) {
    return;
  }

  let storedCities = [];

  try {
    const citiesFromLocalStorage = localStorage.getItem("cities");
    storedCities = citiesFromLocalStorage
      ? JSON.parse(citiesFromLocalStorage)
      : [];
  } catch (error) {
    console.error("Error parsing cities from localStorage:", error);
    storedCities = [];
  }

  const cityExists = storedCities.findIndex(
    (storedCity) => storedCity?.properties?.osm_id === city.properties.osm_id
  );

  let imageUrl = "";

  try {
    const cityName = city.properties.name;
    const lat = city.geometry.coordinates[1];
    const lon = city.geometry.coordinates[0];

    imageUrl = await fetchImageFromFlickr(cityName, lat, lon);

    if (!imageUrl) {
      console.warn(`No image found for city: ${cityName}`);
    }
  } catch (error) {
    console.error("Error fetching city image:", error);
  }

  if (cityExists !== -1) {
    storedCities[cityExists].addedAt = new Date().toISOString();
  } else {
    const cityWithSelected = {
      ...city,
      properties: { ...city.properties },
      selected: false,
      addedAt: new Date().toISOString(),
      image: imageUrl,
    };
    storedCities.push(cityWithSelected);
  }

  localStorage.setItem("cities", JSON.stringify(storedCities));
  window.dispatchEvent(new Event("storage"));
};

export default handleAddCity;
