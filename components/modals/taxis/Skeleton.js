import React from "react";
import styled from "styled-components";
import SkeletonCard from "../../ui/SkeletonCard";
import media from "../../media";

const Container = styled.div`
  overflow-x: hidden;
  position: relative;
  margin: auto;
  width: 97%;
  
  @media screen and (min-width: 768px) {
    width: 97%;
  }
`;

const SkeletonContainer = styled.div`
  border-radius: 10px;
  margin-bottom: 0.5rem;
  display: grid;
  grid-template-columns: 100%;
  
  @media screen and (min-width: 768px) {
    grid-template-columns: 100%;
  }
`;

const DetailsContainer = styled.div`
  padding: 0.75rem 0.5rem;
  width:100%;
`;


function Skeleton() {
  let isPageWide = media("(min-width: 768px)");
  
  
  const SkeletonItem = (
    <SkeletonContainer >
      {isPageWide ? (
        <DetailsContainer>
          <div className="flex justify-between">
          <SkeletonCard
            height="15px"
            borderRadius="0.25rem"
            width="11rem"
            mb="0.2rem"
          />
          <SkeletonCard
            height="15px"
            borderRadius="0.25rem"
            width="5rem"
            mb="0.2rem"
          />
          </div>
          <SkeletonCard height="12px" borderRadius="0.25rem" width="7rem" />
          

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
              marginTop:"20px"
            }}
          >
            <div className="flex gap-2">
            <SkeletonCard height="20px" borderRadius="0.25rem" width="5rem" />
            <SkeletonCard
            height="20px"
            borderRadius="0.25rem"
            width="5rem"
            />
            </div>
            <SkeletonCard height="24px" borderRadius="0.25rem" width="24px" />
          </div>
        </DetailsContainer>
      ) : (
        <DetailsContainer>
          <div className="flex justify-between w-full">
          <SkeletonCard
            height="15px"
            borderRadius="0.25rem"
            width="6rem"
            mb="0.2rem"
          />
          <SkeletonCard
            height="15px"
            borderRadius="0.25rem"
            width="4rem"
            mb="0.2rem"
          />
          </div>
          <SkeletonCard height="20px" borderRadius="0.25rem" width="8rem" />
           <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className="flex gap-2">
          <SkeletonCard
            height="20px"
            borderRadius="0.25rem"
            width="5rem"
            mt="0.5rem"
            mb="0.5rem"
          />
          <SkeletonCard height="20px"
            borderRadius="0.25rem"
            width="5rem"
            mt="0.5rem"
            mb="0.5rem"/>
          </div>
          <SkeletonCard height="24px" borderRadius="0.25rem" width="24px"  mb="0.5rem" />
          </div>
          
            
        </DetailsContainer>
      )}
    </SkeletonContainer>
  );
  
  return (
    <Container>
      {[SkeletonItem, SkeletonItem, SkeletonItem, SkeletonItem, SkeletonItem]}
    </Container>
  );
}

export default Skeleton;