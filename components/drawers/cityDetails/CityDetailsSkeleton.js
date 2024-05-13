import styled from "styled-components";
import media from "../../../components/media";
import SkeletonCard from "../../ui/SkeletonCard";

const CityDetailsSkeleton = (props) => {
  const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 16px;
    width: 100vw;
    @media screen and (min-width: 768px) {
      width: 500px;
    }
  `;
  const Title = styled.p`
    font-weight: 800;
    font-size: 20px;
  `;
  let isPageWide = media("(min-width: 768px)");

  return (
    <Container>
      <SkeletonCard width={isPageWide ? "468px" : "100%"} height={"188px"} />
      <Title>{props.name}</Title>
      <SkeletonCard height={"100px"} width={"325px"} />

      <div>
        <SkeletonCard width={"140px"} height={"20px"} mb={"10px"} />
        <SkeletonCard width={isPageWide ? "468px" : "100%"} height={"84px"} />
      </div>

      <div>
        <SkeletonCard width={"200px"} height={"20px"} mb={"10px"} />
        <SkeletonCard width={isPageWide ? "468px" : "100%"} height={"120px"} />
      </div>

      <div>
        <SkeletonCard width={"140px"} height={"20px"} mb={"10px"} />
        <SkeletonCard width={isPageWide ? "468px" : "100%"} height={"100px"} />
      </div>

      <SkeletonCard width={isPageWide ? "468px" : "100%"} height={"150px"} />
    </Container>
  );
};

export default CityDetailsSkeleton;
