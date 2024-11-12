import styled from "styled-components";
import media from "../../../components/media";
import SkeletonCard from "../../ui/SkeletonCard";
import { TbArrowBack } from "react-icons/tb";
import { IoMdClose } from "react-icons/io";

const POIDetailsSkeleton = (props) => {
  const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 16px;
    width: 100vw;
    @media screen and (min-width: 768px) {
      width: 50vw;
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
  let isPageWide = media("(min-width: 768px)");

  return (
    <Container>
      {!props.itineraryDrawer ? (
        <div onClick={props.handleCloseDrawer}>
          <TbArrowBack
            style={{ height: "32px", width: "32px" }}
            cursor={"pointer"}
          />
        </div>
      ) : (
        <BackContainer className=" font-lexend">
          <IoMdClose
            className="hover-pointer"
            onClick={(e) => {
              props.handleCloseDrawer(e);
            }}
            style={{ fontSize: "2rem" }}
          ></IoMdClose>
          <BackText>Back to Itinerary</BackText>
        </BackContainer>
      )}

      <SkeletonCard width={isPageWide ? "100%" : "100%"} height={"188px"} />
      <Title>{props.name}</Title>
      <SkeletonCard height={"100px"} width={"325px"} />

      <div>
        <SkeletonCard width={"140px"} height={"20px"} mb={"10px"} />
        <SkeletonCard width={isPageWide ? "100%" : "100%"} height={"84px"} />
      </div>

      <div>
        <SkeletonCard width={"200px"} height={"20px"} mb={"10px"} />
        <SkeletonCard width={isPageWide ? "100%" : "100%"} height={"120px"} />
      </div>

      <div>
        <SkeletonCard width={"140px"} height={"20px"} mb={"10px"} />
        <SkeletonCard width={isPageWide ? "100%" : "100%"} height={"100px"} />
      </div>

      <SkeletonCard width={isPageWide ? "100%" : "100%"} height={"150px"} />
    </Container>
  );
};

export default POIDetailsSkeleton;
