import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { startLocation, endLocation } = await req.json();

    const apiKey = process.env.OPENROUTESERVICE_SECRET;

    const coordinates = [
      [startLocation.lon, startLocation.lat],
      [endLocation.lon, endLocation.lat],
    ];

    const apiUrl = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&units=km`;

    const response = await axios.post(
      apiUrl,
      {
        coordinates: coordinates,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error(
      "Error fetching route:",
      error.response?.data || error.message
    );

    return NextResponse.json(
      { error: "Error fetching route" },
      { status: 500 }
    );
  }
}
