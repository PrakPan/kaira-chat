import styled from "styled-components";
import media from "../../../components/media";
import SkeletonCard from "../../ui/SkeletonCard";
import { FaPlane } from "react-icons/fa";

const POIDetailsSkeleton = (props) => {
  let isPageWide = media("(min-width: 768px)");

  const Container = styled.div`
    @media screen and (max-width: 768px) {
      width: 95%;
      margin: auto;
    }
  `;

  const SkeletonContainer = styled.div`
    margin-bottom: 0.5rem;
    width: 100%;
    height: 223px;
    border-radius: 10px;
    padding: 0.75rem;
    @media screen and (min-width: 768px) {
      height: 140px;
      padding: 0rem;
      display: grid;
      grid-template-columns: 1fr 8.5rem;
    }
  `;

  const DetailsContainer = styled.div`
    @media screen and (min-width: 768px) {
      display: grid;
      grid-template-columns: auto 6fr;
      gap: 1.2rem;
      padding: 1rem 0rem 1rem 0.5rem;
    }
  `;

  const LogoContainer = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: 50px auto;
    gap: 1rem;
    align-items: center;
    margin-bottom: 1rem;
    @media screen and (min-width: 768px) {
      width: 80px;
      margin-bottom: 1rem;
      display: initial;
    }
  `;

  const DetailsGridContainer = styled.div`
    display: grid;
    grid-template-columns: 105px auto 105px;
    grid-column-gap: 0.5rem;
    grid-row-gap: 0.25rem;
    line-height: 1;
    margin-block: auto;
    height: 65px;
    @media screen and (min-width: 768px) {
      grid-template-columns: 140px auto 140px;
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
      background-size: 9px 100%; /* Adjust this value to change the spacing between the dots */
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
    justify-content: space-between;
    margin: 2.5rem 0 0 0;

    @media screen and (min-width: 768px) {
      flex-direction: column;
      margin: 0.5rem 0.5rem 0 0.5rem;
      padding: 0.75rem;
      justify-content: initial;
      align-items: center;
    }
  `;

  const DesktopSkeleton = (
    <SkeletonContainer className="border">
      <DetailsContainer>
        <LogoContainer>
          <SkeletonCard
            width={isPageWide ? "80px" : "50px"}
            height={isPageWide ? "80px" : "50px"}
            mb="0.5rem"
            borderRadius={"50%"}
          />
          <SkeletonCard
            width={isPageWide ? "80px" : "50px"}
            height={"15px"}
            mb="0.5rem"
            borderRadius={"3px"}
            mt="0.25rem"
          />
        </LogoContainer>
        <DetailsGridContainer>
          <SkeletonCard borderRadius={"3px"} height="24px" />

          <div style={{ height: "20px" }}>
            <div
              style={{
                margin: "0",
                position: "relative",
                height: "0px",
                top: "50%",
              }}
            >
              <Circle style={{ left: 0 }} />
              <DottedLine></DottedLine>
              <Circle style={{ right: 0 }} />
              <Plan>
                <FaPlane style={{ fontSize: "1.25rem" }} />
              </Plan>
            </div>
          </div>
          <SkeletonCard borderRadius={"3px"} height="24px" />
          <div
            style={{
              height: "32px",
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "column",
            }}
          >
            <SkeletonCard borderRadius={"3px"} width={"70%"} height="14px" />
            <SkeletonCard borderRadius={"3px"} width={"50%"} height="14px" />
          </div>
          <div style={{ height: "40px" }}></div>
          <div
            style={{
              height: "32px",
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "column",
            }}
          >
            <SkeletonCard borderRadius={"3px"} width={"70%"} height="14px" />
            <SkeletonCard borderRadius={"3px"} width={"50%"} height="14px" />
          </div>
        </DetailsGridContainer>
      </DetailsContainer>
      <PriceContainer>
        <SkeletonCard borderRadius={"3px"} width={"100%"} height="30px" />
        <SkeletonCard
          borderRadius={"3px"}
          mt="0.35rem"
          width={"90%"}
          height="20px"
        />
        <SkeletonCard
          borderRadius={"3px"}
          mt="0.65rem"
          width={"85%"}
          height="24px"
        />
      </PriceContainer>
    </SkeletonContainer>
  );

  const MobileSkeleton = (
    <SkeletonContainer className="border">
      <DetailsContainer>
        <LogoContainer>
          <SkeletonCard width={"50px"} height={"50px"} borderRadius={"50%"} />
          <div>
            <SkeletonCard width={"30%"} height={"15px"} borderRadius={"3px"} />
            <SkeletonCard
              width={"50%"}
              height={"15px"}
              borderRadius={"3px"}
              mt="0.25rem"
            />
          </div>
        </LogoContainer>
        <DetailsGridContainer>
          <SkeletonCard borderRadius={"3px"} height="24px" />

          <div style={{ height: "20px" }}>
            <div
              style={{
                margin: "0",
                position: "relative",
                height: "0px",
                top: "50%",
              }}
            >
              <Circle style={{ left: 0 }} />
              <DottedLine></DottedLine>
              <Circle style={{ right: 0 }} />
              <Plan>
                <FaPlane style={{ fontSize: "1.25rem" }} />
              </Plan>
            </div>
          </div>
          <SkeletonCard borderRadius={"3px"} height="24px" />
          <div
            style={{
              height: "32px",
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "column",
            }}
          >
            <SkeletonCard borderRadius={"3px"} width={"70%"} height="14px" />
            <SkeletonCard borderRadius={"3px"} width={"50%"} height="14px" />
          </div>
          <div style={{ height: "40px" }}></div>
          <div
            style={{
              height: "32px",
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "column",
            }}
          >
            <SkeletonCard borderRadius={"3px"} width={"70%"} height="14px" />
            <SkeletonCard borderRadius={"3px"} width={"50%"} height="14px" />
          </div>
        </DetailsGridContainer>
      </DetailsContainer>
      <PriceContainer>
        <SkeletonCard borderRadius={"3px"} width={"50%"} height="24px" />
        <SkeletonCard borderRadius={"3px"} width={"30%"} height="24px" />
      </PriceContainer>
    </SkeletonContainer>
  );

  return (
    <Container>
      {isPageWide
        ? [
            DesktopSkeleton,
            DesktopSkeleton,
            DesktopSkeleton,
            DesktopSkeleton,
            DesktopSkeleton,
          ]
        : [
            MobileSkeleton,
            MobileSkeleton,
            MobileSkeleton,
            MobileSkeleton,
            MobileSkeleton,
          ]}
    </Container>
  );
};

export default POIDetailsSkeleton;
