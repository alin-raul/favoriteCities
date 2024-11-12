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
  const { country, countrycode, type, county, name } = location[0].properties;

  if (location.length === 0) {
    return <div>No locations found for {cityName}.</div>;
  }

  return (
    <div className="p-4 bg-dynamic rounded-xl">
      <h1>{`${name}, ${countrycode}`}</h1>
      <ul>
        <li>{country}</li>
      </ul>
    </div>
  );
};

export default CityPage;
