import CustomCard from "../card/CustomCard";

const InfiniteCarousel = () => {
  const items = [
    "React",
    "Next.js",
    "SQLite",
    "TypeORM",
    "Authentication (Auth)",
    "Node.js APIs",
    "Geolocation APIs",
    "Weather APIs",
  ];

  return (
    <div className="carousel">
      <div className="group">
        {[...items].map((item, index) => (
          <CustomCard key={index}>
            <div className="min-w-52 text-center">{item}</div>
          </CustomCard>
        ))}
      </div>

      <div className="group">
        {[...items].map((item, index) => (
          <CustomCard key={index}>
            <div className="min-w-52 text-center">{item}</div>
          </CustomCard>
        ))}
      </div>
    </div>
  );
};

export default InfiniteCarousel;
