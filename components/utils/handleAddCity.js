const handleAddCity = (city) => {
  if (!city || !city.properties) {
    return;
  }

  let storedCities = [];

  try {
    storedCities = JSON.parse(localStorage.getItem("cities" || []));
  } catch (error) {
    console.error("Error parsing cities from localStorage:", error);
    storedCities = [];
  }

  const cityExists = storedCities.findIndex(
    (storedCity) => storedCity?.properties?.osm_id === city.properties.osm_id
  );

  if (cityExists !== -1) {
    storedCities[cityExists].addedAt = new Date().toISOString();
  } else {
    const cityWithSelected = {
      ...city,
      properties: { ...city.properties },
      selected: false,
      addedAt: new Date().toISOString(),
    };
    storedCities.push(cityWithSelected);
  }

  localStorage.setItem("cities", JSON.stringify(storedCities));

  window.dispatchEvent(new Event("storage"));
};

export default handleAddCity;
