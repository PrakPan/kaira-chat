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
  // Chat: mirror the transfer-chip shape (full-width rounded card, icon + two
  // text lines). The pin-rail layout below uses fixed 200px bars + a floating
  // circle, which overflow/overlap in the narrower chat column.
  if (props.fromChat) {
    // Plain, explicit-height blocks in a flex row/column — no SkeletonCard
    // (its warm base is nearly the chip color and its layout overlapped in the
    // narrow column). A visible tone + fixed heights + gap can't overlap.
    return (
      <div className="flex items-center gap-3 max-ph:gap-[10px] w-full px-[15px] max-ph:px-[12px] py-[11px] max-ph:py-[9px] rounded-[12px] max-ph:rounded-[11px] bg-[#F6F5F1] border-[1px] border-[#ECECEC] mt-2 mb-3 animate-pulse">
        <div className="w-[18px] h-[18px] rounded-full bg-[#C4C1B4] shrink-0" />
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <div className="h-[12px] w-[55%] rounded-[6px] bg-[#C4C1B4]" />
          <div className="h-[10px] w-[32%] rounded-[6px] bg-[#CFCCC1]" />
        </div>
      </div>
    );
  }
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
