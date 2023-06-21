import styled from "styled-components";
import media from "../../../components/media";
import SkeletonCard from "../../ui/SkeletonCard";
import { TbArrowBack } from "react-icons/tb";
import { CgClose } from "react-icons/cg";
const POIDetailsSkeleton = (props) => {
    const Container = styled.div`
@media screen and (max-width: 768px) {
  
  width : 95%;
  margin : auto;
}
  `;
  const Title = styled.p`
    font-weight: 800;
    font-size: 20px;
  `;
  let isPageWide = media("(min-width: 768px)");

  return (
    <Container>
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
