import React from "react";
import styled from "styled-components";
import SkeletonCard from "../../ui/SkeletonCard";
import media from "../../media";

const Container = styled.div`
  overflow-x: hidden;
  position: relative;
  margin: auto;
  width: 100%;
`;




function Skeleton() {
  let isPageWide = media("(min-width: 768px)");


  const SkeletonItem = (
    <div >
      <div className="flex flex-col rounded-3xl border-sm border-solid border-text-disabled p-md relative mt-md">
        <div className="flex justify-between max-ph:flex-col">
          <div>
            <div className="flex justify-between w-100">
              <div className="text-md font-600 leading-xl ">
                <SkeletonCard width="300px" height="25px" borderRadius="8px" variant="default"  />
              </div>
            </div>
            <div className="text-sm font-400 leading-lg-md text-text-spacegrey mt-xxs"> 
              <SkeletonCard width="70px" height="12px" borderRadius="8px" variant="default"  />
              </div>
            <div className="flex flex-row justify-between">
              <div className="flex flex-col ">
                <div className="font-600 text-md-lg leading-xl-sm mt-sm">
                  <SkeletonCard width="150px" height="30px" borderRadius="8px" variant="default"  />
                  </div>
                <div className="mt-sm">
                  <SkeletonCard width="120px" height="30px" borderRadius="8px" variant="default"  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between items-end max-ph:flex-row max-ph:items-center">
            <div>
              <span className="text-lg font-700 2xl-md">
                <SkeletonCard width="100px" height="30px" borderRadius="8px" variant="default"  />
                </span>
            </div>
            <div className="flex items-end justify-center">
              <div className="flex items-center gap-1 cursor-pointer">
                     <SkeletonCard width="120px" height="40px" borderRadius="8px" variant="default"  />
              </div>
            </div>
          </div>
        </div>
      </div>
    
    </div>
  );

  return (
    <Container>
      {[SkeletonItem, SkeletonItem, SkeletonItem, SkeletonItem, SkeletonItem]}
    </Container>
  );
}

export default Skeleton;