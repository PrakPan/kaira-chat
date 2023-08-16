import styled from "styled-components";
import media from "../../../components/media";
import SkeletonCard from "../../ui/SkeletonCard";
import { TbArrowBack } from "react-icons/tb";
import { CgClose } from "react-icons/cg";
const POIDetailsSkeleton = (props) => {
  const Container = styled.div`
    margin-top: 24px;
    height: 368px;

    border: 2px solid #eceaea;
    border-radius: 1rem;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;

    @media screen and (min-width: 768px) {
      flex-direction: row;
      height: 228px;
    }
  `;
  const ImageSkeleton = styled.div`
    width: 100%;
    @media screen and (min-width: 768px) {
      width: 30%;
    }
  `;
  const DetailsSkeleton = styled.div`
  position : relative;
  
  `
  const PriceContainer = styled.div`
    height: 1.5rem;
    display: flex;
    justify-content: space-between;
    @media screen and (min-width: 768px) {
      height: 2rem;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
    }
  `;
  const Title = styled.p`
    font-weight: 800;
    font-size: 20px;
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
           width={"30%"}
           mb="0.35rem"
           height={"0.7rem"}
           borderRadius="3px"
         />
         <SkeletonCard
           width={"40%"}
           mb="0.35rem"
           height={"0.7rem"}
           borderRadius="3px"
         />
         <SkeletonCard
           width={"60%"}
           mb="0.35rem"
           height={"0.7rem"}
           borderRadius="3px"
         />
         <SkeletonCard
           width={"25%"}
           mb="0.35rem"
           height={"0.7rem"}
           borderRadius="3px"
         />

         <PriceContainer>
           <SkeletonCard width={"60%"} height={"100%"} borderRadius="3px" />
           <SkeletonCard width={"30%"} height={"100%"} borderRadius="3px" />
         </PriceContainer>
       </DetailsSkeleton>
     </Container>
   );

  const DesktopSkeleton =  <Container>
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
          width={"30%"}
          mb="0.4rem"
          height={"1.2rem"}
          borderRadius="3px"
        />
        <SkeletonCard
          width={"40%"}
          mb="0.4rem"
          height={"1.2rem"}
          borderRadius="3px"
        />
        <SkeletonCard
          width={"60%"}
          mb="0.4rem"
          height={"1.2rem"}
          borderRadius="3px"
        />
        <SkeletonCard
          width={"25%"}
          mb="0.4rem"
          height={"1.2rem"}
          borderRadius="3px"
        />

        <PriceContainer>
          <SkeletonCard
            width={"40%"}
            height={"100%"}
            borderRadius="3px"
          />
          <SkeletonCard
            width={"20%"}
            height={"100%"}
            borderRadius="3px"
          />
        </PriceContainer>
      </DetailsSkeleton>
    
    </Container>


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
      {/* {} */}
    </>
  );
};

export default POIDetailsSkeleton;
