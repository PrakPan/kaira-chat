import styled from "styled-components";
import media from "../../../components/media";
import SkeletonCard from "../../../components/ui/SkeletonCard";

const POIDetailsSkeleton = (props) => {
  const Container = styled.div`
    height: 368px;
    margin-inline: 1rem;
    border: 2px solid #eceaea;
    border-radius: 1rem;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    position: relative;
    margin-bottom: 1rem;
    width:100%;

    @media screen and (min-width: 768px) {
      flex-direction: row;
      height: 228px;
      padding: 1rem;
    }
  `;
  const ImageSkeleton = styled.div`
    width: 100%;
    @media screen and (min-width: 768px) {
      width: 30%;
    }
  `;
  const DetailsSkeleton = styled.div`
    width: 90%;
    @media screen and (min-width: 768px) {
      width: 70%;
    }
  `;
  const PriceContainer = styled.div`
    height: 1.2rem;
    display: flex;
    justify-content: space-between;
    position: absolute;
    bottom: 0.5rem;
    @media screen and (min-width: 768px) {
      height: 1.5rem;
      position: absolute;
      width: 100%;
      right: 1rem;
      justify-content: flex-end;
    }
  `;
  let isPageWide = media("(min-width: 768px)");

  const MobileSkeleton = (
    <Container>
      <ImageSkeleton>
        <SkeletonCard width={"100%"} height={"12rem"} borderRadius="1rem" />
      </ImageSkeleton>
      <DetailsSkeleton>
        <SkeletonCard
          width={"60%"}
          mb="0.5rem"
          height={"1.2rem"}
          borderRadius="3px"
        />

        <SkeletonCard
          width={"90%"}
          mb="0.35rem"
          height={"0.5rem"}
          borderRadius="3px"
        />
        <SkeletonCard
          width={"80%"}
          mb="0.35rem"
          height={"0.5rem"}
          borderRadius="3px"
        />
        <SkeletonCard
          width={"100%"}
          mb="0.35rem"
          height={"0.5rem"}
          borderRadius="3px"
        />
        <SkeletonCard
          width={"65%"}
          mb="0.35rem"
          height={"0.5rem"}
          borderRadius="3px"
        />
        <SkeletonCard
          width={"55%"}
          mb="0.35rem"
          height={"0.5rem"}
          borderRadius="3px"
        />

        <PriceContainer>
          <SkeletonCard width={"30%"} height={"100%"} borderRadius="3px" />
        </PriceContainer>
      </DetailsSkeleton>
    </Container>
  );

  const DesktopSkeleton = (
    <Container>
      <ImageSkeleton>
        <SkeletonCard width={"100%"} height={"100%"} borderRadius="1rem" />
      </ImageSkeleton>
      <DetailsSkeleton>
        <SkeletonCard
          width={"50%"}
          mb="0.75rem"
          height={"1.5rem"}
          borderRadius="3px"
        />

        <SkeletonCard
          width={"70%"}
          mb="0.4rem"
          height={"0.8rem"}
          borderRadius="3px"
        />
        <SkeletonCard
          width={"80%"}
          mb="0.4rem"
          height={"0.8rem"}
          borderRadius="3px"
        />
        <SkeletonCard
          width={"60%"}
          mb="0.4rem"
          height={"0.8rem"}
          borderRadius="3px"
        />
        <SkeletonCard
          width={"35%"}
          mb="0.4rem"
          height={"0.8rem"}
          borderRadius="3px"
        />
        <SkeletonCard
          width={"50%"}
          mb="0.4rem"
          height={"0.8rem"}
          borderRadius="3px"
        />
        <SkeletonCard
          width={"45%"}
          mb="0.4rem"
          height={"0.8rem"}
          borderRadius="3px"
        />

        <PriceContainer>
          <SkeletonCard width={"15%"} height={"100%"} borderRadius="3px" />
        </PriceContainer>
      </DetailsSkeleton>
    </Container>
  );

  return (
    <>
      {isPageWide
        ? [
            DesktopSkeleton,
            DesktopSkeleton,
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
    </>
  );
};

export default POIDetailsSkeleton;
