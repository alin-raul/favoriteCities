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
          <div
            key={index}
            className="p-4 bg-dynamic border rounded-2xl shadow-inner relative hover:shadow-md hover:brightness-110 active:scale-105 transition-all"
          >
            <div className="min-w-52 text-center cursor-pointer ">{item}</div>
          </div>
        ))}
      </div>

      <div className="group">
        {[...items].map((item, index) => (
          <div
            key={index}
            className="p-4 bg-dynamic border rounded-2xl shadow-inner relative hover:shadow-md hover:brightness-110 active:scale-105 transition-all"
          >
            <div className="min-w-52 text-center cursor-pointer">{item}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfiniteCarousel;
