import styled from "styled-components";
import media from "../../../components/media";
import SkeletonCard from "../../ui/SkeletonCard";
import { TbArrowBack } from "react-icons/tb";
import { CgClose } from "react-icons/cg";
import { IoMdClose } from "react-icons/io";
  const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.25rem;
    width: 100%;
    @media screen and (min-width: 768px) {
      width: 100%;
    }
    padding: 0.75rem;
    @media screen and (min-width: 768px) {
      padding: 1.25rem;
    }
  `;
  const Title = styled.p`
    font-weight: 800;
    font-size: 20px;
  `;
  const BackContainer = styled.div`
    margin: 0;
    display: flex;
    gap: 0.5rem;
    @media screen and (min-width: 768px) {
    }
  `;
  const BackText = styled.div`
    font-size: 1.5rem;
    line-height: 2rem;
  `;
const POIDetailsSkeleton = (props) => {

  let isPageWide = media("(min-width: 768px)");

  return (
    <Container>
      <BackContainer className=" font-lexend">
        <IoMdClose
          className="hover-pointer"
          onClick={props.onHide}
          style={{ fontSize: "2rem" }}
        ></IoMdClose>
        <BackText>Back to Itinerary</BackText>
      </BackContainer>

      <SkeletonCard width={"50%"} height={"60px"} />
      <SkeletonCard height={"19rem"} width={"100%"} />

      <div>
        <SkeletonCard width={"200px"} height={"25px"} mb={"10px"} />
        <SkeletonCard width={isPageWide ? "100%" : "100%"} height={"150px"} />
      </div>

      <div>
        <SkeletonCard width={"70%"} height={"20px"} mb={"10px"} />
        <SkeletonCard width={isPageWide ? "100%" : "100%"} height={"120px"} />
      </div>

      <div>
        <SkeletonCard width={"50%"} height={"20px"} mb={"10px"} />
        <SkeletonCard width={isPageWide ? "100%" : "100%"} height={"100px"} />
      </div>

      <SkeletonCard width={isPageWide ? "100%" : "100%"} height={"150px"} />
    </Container>
  );
};

export default POIDetailsSkeleton;
