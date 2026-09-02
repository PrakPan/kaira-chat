import styled from "styled-components";
import SkeletonCard from "../../ui/SkeletonCard";

// Same fluid rule as CityDetails' own Container: match the drawer rather than a
// fixed 500px / 100vw, so the loading state doesn't sit narrow on a wide
// desktop drawer or overflow a phone sideways before the data lands.
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0.5rem 0;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
`;

const Title = styled.p`
  font-weight: 800;
  font-size: 20px;
`;

const CityDetailsSkeleton = (props) => {
  return (
    <Container>
      <SkeletonCard width={"100%"} height={"188px"} />
      <Title>{props.name}</Title>
      {/* Deliberately short blocks stay short, but never wider than the drawer
          — 325px overflows a 320px phone once the gutters are taken off. */}
      <SkeletonCard height={"100px"} width={"min(325px, 100%)"} />

      <div>
        <SkeletonCard width={"min(140px, 100%)"} height={"20px"} mb={"10px"} />
        <SkeletonCard width={"100%"} height={"84px"} />
      </div>

      <div>
        <SkeletonCard width={"min(200px, 100%)"} height={"20px"} mb={"10px"} />
        <SkeletonCard width={"100%"} height={"120px"} />
      </div>

      <div>
        <SkeletonCard width={"min(140px, 100%)"} height={"20px"} mb={"10px"} />
        <SkeletonCard width={"100%"} height={"100px"} />
      </div>

      <SkeletonCard width={"100%"} height={"150px"} />
    </Container>
  );
};

export default CityDetailsSkeleton;
