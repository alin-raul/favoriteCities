import { Calendar, Home, Inbox, Search } from "lucide-react";

const navigationLinks = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Search",
    url: "/search",
    icon: Search,
  },

  {
    title: "Favorites",
    url: "/favorites",
    icon: Calendar,
  },
  // {
  //   title: "Plan",
  //   url: "/",
  //   icon: Calendar,
  // },
  {
    title: "Cities",
    url: "/cities",
    icon: Inbox,
  },
];

export default navigationLinks;
