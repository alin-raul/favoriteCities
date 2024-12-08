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
            className="p-4 bg-dynamic border rounded-2xl shadow-inner relative hover:scale-110 hover:shadow-md transition-all"
          >
            <div className="min-w-52 text-center cursor-pointer ">{item}</div>
          </div>
        ))}
      </div>

      <div className="group">
        {[...items].map((item, index) => (
          <div
            key={index}
            className="p-4 bg-dynamic border rounded-2xl shadow-inner relative hover:scale-110 hover:shadow-md transition-all"
          >
            <div className="min-w-52 text-center cursor-pointer">{item}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfiniteCarousel;
