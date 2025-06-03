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
    border-bottom: 1px solid #e5e5e5;
    padding: 0.5rem;
    overflow-x: hidden;
    width: 100%;
  `;

  const HeaderSection = styled.div`
    display: flex;
    flex-direction: row;
    gap: 0.25rem;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    
    @media screen and (min-width: 768px) {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  `;

  const AirlineSection = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    justify-content: center;
  `;

  // Flight details section
  const FlightDetailsSection = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 0.25rem;
    
    @media screen and (min-width: 768px) {
      width: 100%;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  `;

  const FlightDetailsContainer = styled.div`
    width: 70%;
    display: grid;
    grid-template-columns: 40px 120px 40px;
    grid-column-gap: 0.5rem;
    grid-row-gap: 0.25rem;
    line-height: 1;
    height: 65px;
    
    @media screen and (min-width: 768px) {
      grid-template-columns: 60px 200px 60px;
    }
  `;

  const DottedLine = styled.div`
    position: relative;
    height: 2px;
    width: 100%;

    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: linear-gradient(to right, #7a7a7a 5px, transparent 5px);
      background-size: 9px 100%;
    }
  `;

  const Plan = styled.div`
    position: absolute;
    left: 50%;
    top: 0%;
    transform: translate(-50%, -45%);
  `;

  const Circle = styled.div`
    border: 1px solid #7a7a7a;
    height: 10px;
    width: 10px;
    border-radius: 100%;
    background: white;
    position: absolute;
    z-index: 1;
    top: 50%;
    transform: translateY(-38%);
  `;

  const PriceContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    min-width: 120px;
  `;

  const SkeletonComponent = (
    <Container>
      <SkeletonContainer>
        <HeaderSection>
          <AirlineSection>
            <SkeletonCard
              width="32px"
              height="32px"
              borderRadius="4px"
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <SkeletonCard
                width={isPageWide ? "180px" : "120px"}
                height="14px"
                borderRadius="3px"
              />
              {isPageWide && (
                <SkeletonCard
                  width="80px"
                  height="12px"
                  borderRadius="3px"
                />
              )}
            </div>
          </AirlineSection>

          <SkeletonCard
            width="80px"
            height="24px"
            borderRadius="3px"
          />
        </HeaderSection>

        <FlightDetailsSection>
          <FlightDetailsContainer>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <SkeletonCard borderRadius="3px" height="20px" width="100%" />
              <SkeletonCard borderRadius="3px" height="14px" width="70%" />
            </div>

            <div style={{ height: "20px", position: "relative" }}>
              <div
                style={{
                  margin: "0",
                  position: "relative",
                  height: "0px",
                  top: "50%",
                }}
              >
                <Circle style={{ left: 0 }} />
                <DottedLine />
                <Circle style={{ right: 0 }} />
                <Plan>
                  <FaPlane style={{ fontSize: "1.25rem", color: "#7a7a7a" }} />
                </Plan>
              </div>
              <div style={{ 
                position: "absolute", 
                top: "25px", 
                left: "50%", 
                transform: "translateX(-50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "2px"
              }}>
                <SkeletonCard borderRadius="3px" width="60px" height="12px" />
                <SkeletonCard borderRadius="3px" width="45px" height="10px" />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <SkeletonCard borderRadius="3px" height="20px" width="100%" />
              <SkeletonCard borderRadius="3px" height="14px" width="70%" />
            </div>
          </FlightDetailsContainer>

          <PriceContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
              <SkeletonCard borderRadius="3px" width="20px" height="20px" />
            </div>
          </PriceContainer>
        </FlightDetailsSection>
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