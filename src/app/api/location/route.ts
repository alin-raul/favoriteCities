import { NextResponse } from "next/server"; // <--- Ensure this is imported

export async function GET() {
  try {
    const ipApiResponse = await fetch("http://ip-api.com/json/");

    if (!ipApiResponse.ok) {
      throw new Error(
        `Failed to fetch from ip-api.com: ${ipApiResponse.statusText}`
      );
    }

    const ipApiData = await ipApiResponse.json();

    if (
      typeof ipApiData.lat === "number" &&
      typeof ipApiData.lon === "number"
    ) {
      // *** FIX 1: Use NextResponse.json() ***
      return NextResponse.json(
        { lon: ipApiData.lon, lat: ipApiData.lat },
        { status: 200 }
      );
    } else {
      throw new Error("Invalid response from ip-api.com");
    }
  } catch (error) {
    console.error("Error fetching from ip-api.com, trying ipinfo.io:", error);

    try {
      const ipInfoResponse = await fetch(
        `https://ipinfo.io/json?token=${process.env.IPINFO_TOKEN}`
      );

      if (!ipInfoResponse.ok) {
        throw new Error(
          `Failed to fetch from ipinfo.io: ${ipInfoResponse.statusText}`
        );
      }

      const ipInfoData = await ipInfoResponse.json();

      if (ipInfoData.loc) {
        const [lat, lon] = ipInfoData.loc.split(","); // Note: ipinfo.io returns lat,lon order
        console.log("Fetched location from ipinfo.io:", {
          lon: parseFloat(lon),
          lat: parseFloat(lat),
        });
        // *** FIX 2: Use NextResponse.json() ***
        return NextResponse.json(
          { lon: parseFloat(lon), lat: parseFloat(lat) }, // Ensure lon/lat order matches your component/schema
          { status: 200 }
        );
      } else {
        throw new Error("Invalid response from ipinfo.io");
      }
    } catch (ipInfoError) {
      console.error("Error fetching from ipinfo.io:", ipInfoError);
      // *** FIX 3: Use NextResponse.json() for the 500 error ***
      return NextResponse.json(
        { success: false, error: "Failed to fetch location from both APIs" }, // Provide a success: false flag too
        { status: 500 }
      );
    }
  }
}
