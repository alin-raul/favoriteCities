import React from "react";
import CityPage from "@/components/CityPage/CityPage";

const page = async ({ params }) => {
  const resolvedParams = await params;
  return (
    <>
      <CityPage params={resolvedParams} />
    </>
  );
};

export default page;
