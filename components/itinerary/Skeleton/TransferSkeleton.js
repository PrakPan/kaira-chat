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
    <div className=" flex gap-1 mt-2">
      <div className="flex items-start">
        <SkeletonCard width="20px" height="20px" borderRadius="50%" variant="default" />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-2 group hover:cursor-pointer">
          <div className="Body1M_16 group-hover:text-blue ">
            <SkeletonCard width="200px" height="20px" borderRadius="8px" variant="default" />
          </div>
          <div className="">
            <SkeletonCard width="20px" height="20px" borderRadius="50%" variant="default" />
          </div>
        </div>
        <div className="mt-xxs">
          <SkeletonCard width="180px" height="12px" borderRadius="8px" variant="default" />
        </div>
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
