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
    width: 90%;
  }
`;

const SkeletonContainer = styled.div`
  border-radius: 10px;
  margin-bottom: 0.5rem;
  display: grid;
  grid-template-columns: 15rem;
  
  @media screen and (min-width: 768px) {
    grid-template-columns: 18rem;
  }
`;

const DetailsContainer = styled.div`
  padding: 0.75rem 0.5rem;
  width:100%;
`;

const HeaderSection = styled.div`
  padding: 1rem;
  margin-bottom: 1rem;
  
  .header-flex {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    
    @media screen and (min-width: 640px) {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }
  
  .time-section {
    width: 100%;
    
    @media screen and (min-width: 640px) {
      width: auto;
    }
  }
`;

function Skeleton() {
  let isPageWide = media("(min-width: 768px)");
  
  
  const SkeletonItem = (
    <SkeletonContainer className="border">
      {/* <div
        className="center-dv"
        style={{
          padding: "0.75rem 0rem",
          borderColor: "rgba(238, 238, 238, 1)",
          borderWidth: "1px",
          borderStyle: "none solid none none",
        }}
      >
        <div style={{ padding: "0 0.5rem" }}>
          <SkeletonCard />
        </div>
      </div> */}
      {isPageWide ? (
        <DetailsContainer>
          <SkeletonCard
            height="16px"
            borderRadius="0.25rem"
            width="35%"
            mb="0.5rem"
          />
          <SkeletonCard height="12px" borderRadius="0.25rem" width="50%" />
          <SkeletonCard
            height="20px"
            borderRadius="0.25rem"
            width="25%"
            mt="10px"
          />
          <SkeletonCard
            height="45px"
            borderRadius="0.25rem"
            width="30%"
            mt="0.5rem"
            mb="0.5rem"
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <SkeletonCard height="24px" borderRadius="0.25rem" width="20%" />
            <SkeletonCard height="24px" borderRadius="0.25rem" width="30%" />
          </div>
        </DetailsContainer>
      ) : (
        <DetailsContainer>
          <SkeletonCard
            height="15px"
            borderRadius="0.25rem"
            width="6rem"
            mb="0.2rem"
          />
          <SkeletonCard height="20px" borderRadius="0.25rem" width="8rem" />
          <SkeletonCard
            height="40px"
            borderRadius="0.25rem"
            width="12rem"
            mt="0.5rem"
            mb="0.5rem"
          />
          <SkeletonCard
            height="28px"
            borderRadius="0.25rem"
            width="8rem"
            mb="4px"
          />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <SkeletonCard height="24px" borderRadius="0.25rem" width="5.5rem" />
            <SkeletonCard height="24px" borderRadius="0.25rem" width="5.5rem" />
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