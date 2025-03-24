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
    <DesktopContainer>
      <SkeletonCard
       width={"10vw"}
       height={"4vh"}
       borderRadius={"0.5rem"}
       lottieDimension={"35vh"}
  />
    </DesktopContainer>
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
