import TransitionLink from "../utils/TransitionLink";
import navigationLinks from "@/globals/NavLinks";
import BurgerMenu from "./BurgerMenu";
import { RxHamburgerMenu } from "react-icons/rx";
import { Logo } from "./NavBar";

type NavLinksProps = {
  pathname: string;
};

const NavLinks: React.FC<NavLinksProps> = ({ pathname }) => {
  return (
    <div className="flex items-center gap-6">
      <BurgerMenu icon={<RxHamburgerMenu className="w-6 h-6 opacity-75" />} />
      <div className="hidden items-center gap-6 md:flex">
        <ul className="flex">
          <div className="flex items-center gap-1 ">
            <TransitionLink href="/" isActive={pathname === "/"} ignore={true}>
              <div className="cardinal flex items-center gap-1 mr-2 transition-all">
                <Logo height="24px" width="24px" />
                <span className="font-bold pr-2 text-lg">Cardinal</span>
              </div>
            </TransitionLink>
          </div>
          {navigationLinks.slice(1).map((item) => (
            <li key={item.title} className={`p-2`}>
              <TransitionLink href={item.url} isActive={pathname === item.url}>
                {" "}
                <span>{item.title}</span>
              </TransitionLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NavLinks;
