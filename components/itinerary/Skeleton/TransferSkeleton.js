import React from "react";
import styled from "styled-components";
import SkeletonCard from "../../ui/SkeletonCard";

const DesktopContainer = styled.div`
margin:2.5rem;
`;

const MobileContainer = styled.div`

`;

const DesktopCard = Array(6).fill(
  <SkeletonCard
    width={"auto"}
    height={"35vh"}
    borderRadius={"0.5rem"}
    lottieDimension={"35vh"}
  />
);

const MobileCard = Array(4).fill(
  <SkeletonCard
    width={"auto"}
    height={"35vh"}
    borderRadius={"0.5rem"}
    lottieDimension={"35vh"}
  />
);

const TransferSkeleton = (props) => {
  return (
    <div className="flex flex-col space-y-4 animate-pulse mt-4 mb-4 p-2">
    <div className="flex items-center space-x-4">
      <div className="w-10 h-10 bg-gray-300 rounded-full"></div> {/* Icon circle */}
      <div className="h-4 bg-gray-300 rounded w-[6rem]"></div> {/* Text block */}
    </div>
  </div>
  );
};

export const MobileSkeleton = (props) => {
  return (
    <MobileContainer>
      {MobileCard.map((e, i) => (
        <div key={i}>{e}</div>
      ))}
    </MobileContainer>
  );
};

export default TransferSkeleton;
