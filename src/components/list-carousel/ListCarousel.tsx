import { FaReact, FaDatabase, FaLock, FaCloud } from "react-icons/fa";
import {
  SiNextdotjs,
  SiSqlite,
  SiTypescript,
  SiTailwindcss,
} from "react-icons/si";
import Link from "next/link";

type CarouselItem = {
  name: string;
  url: string;
  icon: React.ReactNode;
};

const InfiniteCarousel = () => {
  const items: CarouselItem[] = [
    { name: "React", url: "https://reactjs.org", icon: <FaReact /> },
    { name: "Next.js", url: "https://nextjs.org", icon: <SiNextdotjs /> },
    { name: "SQLite", url: "https://www.sqlite.org", icon: <SiSqlite /> },
    { name: "TypeORM", url: "https://typeorm.io", icon: <FaDatabase /> },
    {
      name: "Authentication",
      url: "https://next-auth.js.org/",
      icon: <FaLock />,
    },
    {
      name: "Rest API's",
      url: "https://www.restapitutorial.com",
      icon: <FaCloud />,
    },
    {
      name: "TypeScript",
      url: "https://www.typescriptlang.org/",
      icon: <SiTypescript />,
    },
    {
      name: "Tailwind CSS",
      url: "https://tailwindcss.com/",
      icon: <SiTailwindcss />,
    },
  ];

  return (
    <div className="carousel">
      <div className="group-carousel-links">
        {[...items].map((item, index) => (
          <Link
            key={index}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-dynamic bg-dynamic-h border rounded-2xl shadow-inner hover:shadow-md active:scale-105 transition-all"
          >
            <div className="flex justify-center items-center gap-4 min-h-12 min-w-52 cursor-pointer">
              <div className="text-3xl">{item.icon}</div>
              <div>{item.name}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="group-carousel-links">
        {[...items].map((item, index) => (
          <Link
            key={index}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-dynamic bg-dynamic-h border rounded-2xl shadow-inner hover:shadow-md active:scale-105 transition-all"
          >
            <div className="flex justify-center items-center gap-4 min-h-12 min-w-52 cursor-pointer">
              <div className="text-3xl">{item.icon}</div>
              <div>{item.name}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default InfiniteCarousel;
