import { Map } from "@vis.gl/react-maplibre";
import { middleOfEU } from "@/globals/constants";
import YouAreHere from "@/components/location/YouAreHere";

export default function MapOverlay() {
  return (
    <Map
      initialViewState={{
        longitude: middleOfEU[0],
        latitude: middleOfEU[1],
        zoom: 2,
      }}
      className="z-10"
      // mapStyle="/styles/dark.json"
      mapStyle="https://tiles.openfreemap.org/styles/dark"
    >
      {/* <YouAreHere /> */}
    </Map>
  );
}
