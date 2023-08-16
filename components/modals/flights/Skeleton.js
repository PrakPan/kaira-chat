import styled from "styled-components";
import media from "../../../components/media";
import SkeletonCard from "../../ui/SkeletonCard";
import { TbArrowBack } from "react-icons/tb";
import { CgClose } from "react-icons/cg";
const POIDetailsSkeleton = (props) => {
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
    @media screen and (min-width: 768px) {
      height: 140px;
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
    width: 50px;

    @media screen and (min-width: 768px) {
      width: 80px;
    }
  `;
  const Title = styled.p`
    font-weight: 800;
    font-size: 20px;
  `;
  let isPageWide = media("(min-width: 768px)");

  return (
    <Container>
      {/* <SkeletonContainer className="border">
        <DetailsContainer style={{ border: "1px solid red" }}>
          <LogoContainer style={{ border: "1px solid green" }}></LogoContainer>
          <div style={{ border: "1px solid blue" }}></div>
        </DetailsContainer>
        <div></div>
      </SkeletonContainer> */}
      <SkeletonCard width={"100%"} height={isPageWide ? "140px" : '223px'} mb="0.5rem" />
      <SkeletonCard width={"100%"} height={isPageWide ? "140px" : '223px'} mb="0.5rem" />
      <SkeletonCard width={"100%"} height={isPageWide ? "140px" : '223px'} mb="0.5rem" />
      <SkeletonCard width={"100%"} height={isPageWide ? "140px" : '223px'} mb="0.5rem" />
      <SkeletonCard width={"100%"} height={isPageWide ? "140px" : '223px'} mb="0.5rem" />
      <SkeletonCard width={"100%"} height={isPageWide ? "140px" : '223px'} mb="0.5rem" />
      <SkeletonCard width={"100%"} height={isPageWide ? "140px" : '223px'} mb="0.5rem" />
    </Container>
  );
};

export default POIDetailsSkeleton;
