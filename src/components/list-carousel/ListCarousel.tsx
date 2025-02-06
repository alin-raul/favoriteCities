import { FaReact, FaCloud } from "react-icons/fa";
import {
  SiNextdotjs,
  SiSqlite,
  SiTypescript,
  SiTailwindcss,
  SiTypeorm,
  SiNextdns,
} from "react-icons/si";
import { TbBrandFramerMotion } from "react-icons/tb";
import Link from "next/link";

type CarouselItem = {
  name: string;
  url: string;
  icon: React.ReactNode;
  color: string;
  hoverColor: string;
};

const InfiniteCarousel = () => {
  const items: CarouselItem[] = [
    {
      name: "React",
      url: "https://reactjs.org",
      icon: <FaReact />,
      color: "text-sky-600",
      hoverColor: "group-hover:text-sky-600",
    },
    {
      name: "Next.js",
      url: "https://nextjs.org",
      icon: <SiNextdotjs />,
      color: "text-black",
      hoverColor: "",
    },
    {
      name: "SQLite",
      url: "https://www.sqlite.org",
      icon: <SiSqlite />,
      color: "text-sky-500",
      hoverColor: "group-hover:text-sky-500",
    },
    {
      name: "TypeORM",
      url: "https://typeorm.io",
      icon: <SiTypeorm />,
      color: "text-red-700",
      hoverColor: "group-hover:text-red-700",
    },
    {
      name: "Authentication",
      url: "https://next-auth.js.org/",
      icon: <SiNextdns />,
      color: "text-purple-700",
      hoverColor: "group-hover:text-purple-700",
    },
    {
      name: "Rest API's",
      url: "https://www.restapitutorial.com",
      icon: <FaCloud />,
      color: "text-yellow-600",
      hoverColor: "group-hover:text-yellow-600",
    },
    {
      name: "TypeScript",
      url: "https://www.typescriptlang.org/",
      icon: <SiTypescript />,
      color: "text-sky-600",
      hoverColor: "group-hover:text-sky-600",
    },
    {
      name: "Tailwind CSS",
      url: "https://tailwindcss.com/",
      icon: <SiTailwindcss />,
      color: "text-sky-400",
      hoverColor: "group-hover:text-sky-400",
    },
    {
      name: "Framer Motion",
      url: "https://motion.dev/",
      icon: <TbBrandFramerMotion />,
      color: "text-pink-600",
      hoverColor: "group-hover:text-pink-600",
    },
  ];

  return (
    <div className="max-w-screen-2xl mx-auto relative">
      <div className="carousel overflow-hidden relative ">
        {[...Array(2)].map((_, groupIndex) => (
          <div
            key={groupIndex}
            className="group-carousel-links flex gap-4 animate-scroll"
          >
            {items.map((item, index) => (
              <Link
                key={index}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group carousel-link p-2 border dynamic-border rounded-2xl hover:shadow-sm active:scale-105 transition-all bg-transparent "
              >
                <div className="flex justify-center items-center gap-4 min-h-12 min-w-52 cursor-pointer">
                  <div className={`text-3xl transition-all ${item.hoverColor}`}>
                    {item.icon}
                  </div>
                  <div className="text-lg font-semibold">{item.name}</div>
                </div>
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfiniteCarousel;
