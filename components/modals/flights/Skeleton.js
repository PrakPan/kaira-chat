import styled from "styled-components";
import media from "../../../components/media";
import SkeletonCard from "../../ui/SkeletonCard";
import { FaPlane } from "react-icons/fa";

const POIDetailsSkeleton = (props) => {
  let isPageWide = media("(min-width: 768px)");

  const Container = styled.div`
    width: 95%;
    background-color: white;
    margin: auto;
    height: 100%;
    margin-bottom: 0.5rem;
    @media screen and (min-width: 768px) {
      background: white;
      width: 100%;
      position: relative;
    }
  `;

  const SkeletonContainer = styled.div`
    overflow-x: hidden;
    width: 100%;
  `;

  const SkeletonComponent = (
    <Container>
      <SkeletonContainer>


        <div className="  relative border-sm rounded-lg p-2 space-y-3 overflow-visible">
          <div className="flex flex-row gap-2 justify-between md:items-start items-center">
            <div className="flex flex-row items-center gap-3">
              <div className="rounded-full overflow-hidden flex-shrink-0" >
                <SkeletonCard width="50px" height="50px" borderRadius="50%" variant="default" />
              </div>

              <div className="flex flex-col gap-1">
                <div className="text-sm md:text-md font-semibold flex items-center gap-2 flex-wrap">
                  <SkeletonCard width="100px" height="20px" borderRadius="8px" variant="default" />
                  <SkeletonCard width="120px" height="20px" borderRadius="8px" variant="default" />
                </div>

                <div className="text-xs md:text-sm text-gray-600">
                  <SkeletonCard width="100px" height="12px" borderRadius="8px" variant="default" />
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-md md:text-md font-bold">
                <SkeletonCard width="70px" height="20px" borderRadius="8px" variant="default" />
              </div>

              <div className="text-xs text-gray-500 mt-xxs">
                <SkeletonCard width="70px" height="10px" borderRadius="8px" variant="default" />
              </div>
            </div>
          </div>

          <div className="flex flex-row w-full justify-between items-center">
            <div className="w-full md:w-[75%] flex flex-col gap-2.5">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>
                  <SkeletonCard width="50px" height="12px" borderRadius="8px" variant="default" />
                </span>
                <span className="text-center">
                  <SkeletonCard width="50px" height="12px" borderRadius="8px" variant="default" />
                </span>
                <span className="flex items-start gap-1">
                  <SkeletonCard width="50px" height="12px" borderRadius="8px" variant="default" />
                </span>
              </div>

              <div className="flex justify-center items-center">
                <div className="text-md font-medium text-gray-900">
                  <SkeletonCard width="80px" height="18px" borderRadius="8px" variant="default" />
                </div>

                <div className="flex-1 mx-2 flex items-center">
                  <div className="relative w-full h-2 flex items-center">
                    <div className="FlightDetails__DottedLine-sc-f878005f-0 khLhca"></div>
                    <div className="FlightDetails__PlaneIconWrapper-sc-f878005f-2 bXrnSR">
                      <SkeletonCard width="20px" height="20px" borderRadius="50%" variant="default" />
                    </div>
                  </div>
                </div>

                <div className="text-md font-medium text-gray-900 flex items-start gap-1">
                  <SkeletonCard width="80px" height="18px" borderRadius="8px" variant="default" />
                </div>
              </div>

              <div className="flex justify-between items-center text-sm text-gray-700">
                <div className="flex items-center gap-1.5">
                  <SkeletonCard width="100px" height="12px" borderRadius="8px" variant="default" />
                </div>

                <div className="flex-1 flex justify-center">
                  <div className="text-xs text-gray-500">
                    <SkeletonCard width="70px" height="12px" borderRadius="8px" variant="default" />
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-right">
                  <SkeletonCard width="100px" height="12px" borderRadius="8px" variant="default" />
                </div>
              </div>
            </div>

            <div className="flex ">
              <div className="text-blue underline text-sm font-medium cursor-pointer flex items-end">
                <SkeletonCard width="100px" height="18px" borderRadius="8px" variant="default" />
              </div>
            </div>
          </div>
        </div>
      </SkeletonContainer>
    </Container>
  );

  return (
    <div>
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index}>{SkeletonComponent}</div>
      ))}
    </div>
  );
};

export default POIDetailsSkeleton;