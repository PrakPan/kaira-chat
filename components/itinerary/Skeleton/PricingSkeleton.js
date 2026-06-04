import React from "react";
import styled from "styled-components";
import SkeletonCard from "../../ui/SkeletonCard";

const DesktopContainer = styled.div`
display: flex;
flex-direction: column;
gap: 1rem;
padding:4px;
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

const PricingSkeleton = (props) => {
  return (
    <div className=" border-sm border-primary-grey p-sm rounded-sm text-xs font-medium w-100">
      <div className="flex items-center gap-2xl">
        <div className="flex flex-col items-center gap-1">
          <span >
            <SkeletonCard width="24px" height="24px" borderRadius="8px" variant="default" />
          </span>
          <span >
            <SkeletonCard width="35px" height="12px" borderRadius="8px" variant="default" />
          </span>
        </div>
        <span >
          <SkeletonCard width="10px" height="20px" borderRadius="8px" variant="default" />
        </span>
        <div className="flex flex-col items-center gap-1">
          <span >
            <SkeletonCard width="24px" height="24px" borderRadius="8px" variant="default" />
          </span>
          <span >
            <SkeletonCard width="35px" height="12px" borderRadius="8px" variant="default" />
          </span>
        </div>
        <span >
          <SkeletonCard width="10px" height="20px" borderRadius="8px" variant="default" />
        </span>
        <div className="flex flex-col items-center gap-1">
          <span >
            <SkeletonCard width="24px" height="24px" borderRadius="8px" variant="default" />
          </span>
          <span >
            <SkeletonCard width="35px" height="12px" borderRadius="8px" variant="default" />
          </span>
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

export default PricingSkeleton;
