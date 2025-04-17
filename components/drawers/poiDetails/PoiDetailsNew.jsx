import styled from "styled-components";
import SkeletonCard from "../../ui/SkeletonCard";
import { IoMdClose } from "react-icons/io";

const GridImage = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(4, 0.4fr);
  grid-column-gap: 6px;
  grid-row-gap: 6px;
  height: 19rem;
`;

const Child = styled.div`
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  height: 100%;
  width: 100%;
  grid-area: ${(props) => props.area};
  ${(props) => props.className && `class="${props.className}"`};
`;
const PoiDetailsNew = () => {
  const isPageWide = typeof window !== "undefined" && window.innerWidth >= 768;

  return (
    <div className="h-[100vh] overflow-y-auto px-4">
      <div className="flex flex-col gap-4 mb-[100px]">
        <div className="sticky top-0 z-1 flex flex-row items-center gap-2 mt-4 bg-white">
          <SkeletonCard width="32px" height="32px" />
        </div>

        <div className="flex justify-between items-center">
          <SkeletonCard width="200px" height="32px" />
          <SkeletonCard width="80px" height="32px" />
        </div>

          <GridImage>
            <Child area="1 / 1 / 5 / 4" className="div1">
              <div
                style={{
                  display: "initial",
                  height: "100%",
                  overflow: "hidden",
                }}
              >
                <SkeletonCard lottieDimension="50rem" />
              </div>
            </Child>

            <Child area="1 / 8 / 5 / 11" className="div2 rounded-lg">
              <div
                style={{
                  display: "initial",
                  height: "100%",
                  overflow: "hidden",
                }}
              >
                <SkeletonCard lottieDimension="50rem" />
              </div>
            </Child>

            <Child area="1 / 4 / 3 / 8" className="div3">
              <div
                style={{
                  display: "initial",
                  height: "100%",
                  overflow: "hidden",
                }}
              >
                <SkeletonCard lottieDimension="50rem" />
              </div>
            </Child>

            <Child area="3 / 4 / 5 / 8" className="div4">
              <div
                style={{
                  display: "initial",
                  height: "100%",
                  overflow: "hidden",
                }}
              >
                <SkeletonCard lottieDimension="50rem" />
              </div>
            </Child>
          </GridImage>

        <div className="flex flex-col gap-3">
          <SkeletonCard width="180px" height="28px" />
          <div className="flex flex-row gap-2">
            {[...Array(3)].map((_, i) => (
              <SkeletonCard key={i} width="60px" height="20px" />
            ))}
          </div>
          <SkeletonCard width="100%" height="40px" />
        </div>

        <SkeletonCard width="220px" height="20px" />

        <SkeletonCard width="160px" height="24px" />

        <SkeletonCard width="120px" height="20px" />
        <SkeletonCard width="100%" height="32px" />

        <SkeletonCard width="120px" height="20px" />
        <div className="flex flex-col gap-2">
          {[...Array(3)].map((_, i) => (
            <SkeletonCard key={i} width="80%" height="16px" />
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <SkeletonCard width="120px" height="20px" />
          <div className="flex flex-row gap-2">
            <SkeletonCard width="60px" height="20px" />
            <SkeletonCard width="60px" height="20px" />
          </div>
          <div className="flex flex-row gap-2">
            {[...Array(2)].map((_, i) => (
              <SkeletonCard key={i} width="289px" height="60px" />
            ))}
          </div>
        </div>

        <SkeletonCard width="120px" height="20px" />
        <SkeletonCard width="100%" height="32px" />

        <div className="flex gap-2 items-center">
          <SkeletonCard width="24px" height="24px" />
          <SkeletonCard width="100px" height="20px" />
        </div>
        <div className="flex justify-between items-center">
          <SkeletonCard width="140px" height="24px" />
          <SkeletonCard width="160px" height="36px" />
        </div>
      </div>
    </div>
  );
};

export default PoiDetailsNew;
