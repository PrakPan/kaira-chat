import styled from "styled-components";
import media from "../../../components/media";
import SkeletonCard from "../../ui/SkeletonCard";
import { TbArrowBack } from "react-icons/tb";
import { CgClose } from "react-icons/cg";
const POIDetailsSkeleton = (props) => {
  const Container = styled.div`
    @media screen and (max-width: 768px) {
    //   width: 95%;
    //   margin: auto;
    }
  `;
  const Title = styled.p`
    font-weight: 800;
    font-size: 20px;
  `;
  let isPageWide = media("(min-width: 768px)");

  return (
    <Container>
      <div
        style={{
          border: "1px solid red",
          marginTop: "24px",
          height: isPageWide ? "228px" : "368px",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <SkeletonCard
            width={"100rem"}
            // height={'100rem'}
        //   lottieDimension={{height : '100rem' , width : '100vw'}}
        />
      </div>
      <SkeletonCard
        width={"100%"}
        height={isPageWide ? "228px" : "368px"}
        mt="24px"
      />
      <SkeletonCard
        width={"100%"}
        height={isPageWide ? "228px" : "368px"}
        mt="24px"
      />
      <SkeletonCard
        width={"100%"}
        height={isPageWide ? "228px" : "368px"}
        mt="24px"
      />

      <SkeletonCard
        width={"100%"}
        height={isPageWide ? "228px" : "368px"}
        mt="24px"
      />
      <SkeletonCard
        width={"100%"}
        height={isPageWide ? "228px" : "368px"}
        mt="24px"
      />
      <SkeletonCard
        width={"100%"}
        height={isPageWide ? "228px" : "368px"}
        mt="24px"
      />
    </Container>
  );
};

export default POIDetailsSkeleton;
