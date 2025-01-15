export function getSearchLocation(lat = null, lon = null) {
  if (!lat && !lon) {
    console.warn("Incomplete coordinates.");
  }

  return [lon, lat];
}
