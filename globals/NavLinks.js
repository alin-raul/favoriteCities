import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

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
    title: "Cities",
    url: "/cities",
    icon: Inbox,
  },
  {
    title: "Favorites",
    url: "/favorites",
    icon: Calendar,
  },
];

export default navigationLinks;
