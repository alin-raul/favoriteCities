import { Skeleton } from "@/components/ui/skeleton";
import Wrapper from "@/components/pageWrapper/wrapper";

const Loading = () => {
  return (
    <Wrapper>
      <div className="w-full flex flex-col justify-center items-center relative">
        <h1 className="text-2xl font-semibold mt-16 text-center">
          Your Favorite Cities
          <br />
          <span className="text-sm font-normal opacity-70">
            *loading data from the database...*
          </span>
        </h1>
        <div className="mt-32 max-w-screen-2xl gap-2 justify-center items-center w-full grid lg:grid-cols-2 2xl:grid-cols-3">
          {Array.from({ length: 1 }).map((_, index) => (
            <div
              key={index}
              className="p-4 bg-dynamic border rounded-2xl shadow-lg relative transition-all"
            >
              <div className="w-full min-w-[552px] lg:min-w-[200px]">
                <div>
                  <h2 className="text-lg font-semibold mb-2">
                    <Skeleton className="h-5 w-[120px]" />
                  </h2>
                  <div className="mb-2">
                    <Skeleton className="h-4 w-[160px]" />
                  </div>
                  <div className="mb-2">
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
                  <div className="mb-2">
                    <Skeleton className="h-4 w-[250px]" />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Skeleton className="h-10 w-[90px]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Wrapper>
  );
};

export default Loading;
