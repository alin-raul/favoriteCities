export async function GET() {
  try {
    const ipApiResponse = await fetch("http://ip-api.com/json/");
    console.log(ipApiResponse);

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
      return new Response(
        JSON.stringify({ lon: ipApiData.lon, lat: ipApiData.lat }),
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
        const [lon, lat] = ipInfoData.loc.split(",");
        return new Response(
          JSON.stringify({ lon: parseFloat(lon), lat: parseFloat(lat) }),
          { status: 200 }
        );
      } else {
        throw new Error("Invalid response from ipinfo.io");
      }
    } catch (ipInfoError) {
      console.error("Error fetching from ipinfo.io:", ipInfoError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch location from both APIs" }),
        { status: 500 }
      );
    }
  }
}
