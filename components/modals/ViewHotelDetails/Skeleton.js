import styled from "styled-components";
import media from "../../../components/media";
import SkeletonCard from "../../ui/SkeletonCard";
import { TbArrowBack } from "react-icons/tb";
import { IoMdClose } from "react-icons/io";
import BackArrow from "../../ui/BackArrow";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0 0.75rem 0.75rem 0.75rem;
  width: 100%;
  padding: 0.75rem;
  @media screen and (min-width: 768px) {
    padding: 0 1.25rem 1.25rem 1.25rem;
    width: 100%;
  }
`;

const FloatingView = styled.div`
  position: sticky;
  bottom: 10px;
  background: black;
  color: white;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 90%;
  z-index: 2;
  cursor: pointer;
`;

const BackContainer = styled.div`
  margin: 0;
  display: flex;
  gap: 0.5rem;
  position: sticky;
  z-index: 1;
  background: white;
  top: 0;
  padding-block: 0.75rem;

  @media screen and (min-width: 768px) {
    padding-block: 1rem;
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
        <BackArrow handleClick={props.onHide}/>
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
      <FloatingView>
        <TbArrowBack
          style={{ height: "28px", width: "28px" }}
          cursor={"pointer"}
          onClick={props.onHide}
        />
      </FloatingView>
    </Container>
  );
};

export default POIDetailsSkeleton;
