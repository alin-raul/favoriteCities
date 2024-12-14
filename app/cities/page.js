import LocalCities from "./_local-cities/localCities";
import Wrapper from "@/components/pageWrapper/wrapper";
import { LuHistory } from "react-icons/lu";

const City = () => {
  return (
    <Wrapper>
      <div className="max-w-screen-2xl w-full m-auto">
        <div className="font-semibold text-xl px-4 py-6 flex items-center gap-2 opacity-50">
          <LuHistory className="w-6 h-6" />{" "}
          <span> Cities searched history</span>
        </div>
        <LocalCities
          className={
            "h-96 p-4 rounded-2xl border shadow-inner flex flex-col justify-between bg-dynamic bg-dynamic-h mb-8 cursor-pointer hover:shadow-md active:shadow-lg transition-all"
          }
        />
      </div>
    </Wrapper>
  );
};

export default City;
