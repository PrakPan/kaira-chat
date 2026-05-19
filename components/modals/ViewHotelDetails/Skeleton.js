import styled, { keyframes } from "styled-components";
import SkeletonCard from "../../ui/SkeletonCard";

// Responsive skeleton for the AccommodationDetailDrawer. Mirrors the real
// content layout (gallery → title → meta → description → room cards) so the
// shape doesn't jump when data lands. Sizing uses fluid units (clamp / %)
// so the loader looks balanced from 320px phones up to wide desktops.

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0.75rem;
  width: 100%;
  box-sizing: border-box;

  @media screen and (min-width: 768px) {
    padding: 0 1.25rem 1.25rem 1.25rem;
    gap: 1.25rem;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding-top: 0.25rem;
`;

const Hero = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  gap: 6px;
  width: 100%;

  @media screen and (min-width: 768px) {
    grid-template-columns: 2fr 1fr 1fr;
    grid-template-rows: 110px 110px;
    gap: 8px;
    /* The lead image spans both rows / full height on desktop, the four
       smaller thumbnails fill the remaining 4 cells. */
    & > :nth-child(1) {
      grid-row: 1 / span 2;
      grid-column: 1;
    }
  }
`;

const HeroLead = styled.div`
  width: 100%;
  /* Mobile keeps a tall hero; desktop hands sizing to the grid. */
  aspect-ratio: 16 / 9;

  @media screen and (min-width: 768px) {
    aspect-ratio: auto;
    height: 100%;
  }
`;

const HeroThumb = styled.div`
  display: none;

  @media screen and (min-width: 768px) {
    display: block;
    height: 100%;
  }
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
`;

const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;

  @media screen and (min-width: 768px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const RoomCard = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid #f0f0f0;
  border-radius: 12px;

  @media screen and (min-width: 640px) {
    grid-template-columns: 140px 1fr;
    grid-template-rows: auto;
    gap: 1rem;
  }
`;

const RoomImage = styled.div`
  width: 100%;
  aspect-ratio: 4 / 3;

  @media screen and (min-width: 640px) {
    aspect-ratio: auto;
    height: 110px;
  }
`;

const RoomBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
`;

const PulseDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #d1d5db;
  animation: ${pulse} 1.4s ease-in-out infinite;
  animation-delay: ${(props) => props.delay || "0s"};
`;

const SrOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

const LiveRegion = styled.div`
  display: flex;
  gap: 0.4rem;
  align-items: center;
  color: #6b7280;
  font-size: 12px;
`;

const HotelDetailsSkeleton = () => {
  return (
    <Container role="status" aria-live="polite" aria-busy="true">
      <SrOnly>Loading hotel details…</SrOnly>

      {/* Back button + close placeholder */}
      <HeaderRow>
        <SkeletonCard width={"28px"} height={"28px"} borderRadius={"8px"} />
        <SkeletonCard width={"28px"} height={"28px"} borderRadius={"8px"} />
      </HeaderRow>

      {/* Hero gallery — single image on mobile, 1 lead + 4 thumbs on desktop */}
      <Hero>
        <HeroLead>
          <SkeletonCard width={"100%"} height={"100%"} borderRadius={"12px"} />
        </HeroLead>
        <HeroThumb>
          <SkeletonCard width={"100%"} height={"100%"} borderRadius={"12px"} />
        </HeroThumb>
        <HeroThumb>
          <SkeletonCard width={"100%"} height={"100%"} borderRadius={"12px"} />
        </HeroThumb>
        <HeroThumb>
          <SkeletonCard width={"100%"} height={"100%"} borderRadius={"12px"} />
        </HeroThumb>
        <HeroThumb>
          <SkeletonCard width={"100%"} height={"100%"} borderRadius={"12px"} />
        </HeroThumb>
      </Hero>

      {/* Title + tag row */}
      <TitleBlock>
        <SkeletonCard width={"min(70%, 320px)"} height={"24px"} borderRadius={"6px"} />
        <Row>
          <SkeletonCard width={"72px"} height={"22px"} borderRadius={"999px"} />
          <SkeletonCard width={"90px"} height={"22px"} borderRadius={"999px"} />
          <SkeletonCard width={"60px"} height={"22px"} borderRadius={"999px"} />
        </Row>
        <SkeletonCard width={"min(55%, 260px)"} height={"14px"} borderRadius={"4px"} />
      </TitleBlock>

      {/* Meta grid: check-in, check-out, guests, nights */}
      <MetaGrid>
        {[0, 1, 2, 3].map((i) => (
          <Section key={i}>
            <SkeletonCard width={"60%"} height={"12px"} borderRadius={"4px"} />
            <SkeletonCard width={"80%"} height={"16px"} borderRadius={"4px"} />
          </Section>
        ))}
      </MetaGrid>

      {/* Description */}
      <Section>
        <SkeletonCard width={"180px"} height={"18px"} borderRadius={"4px"} />
        <SkeletonCard width={"100%"} height={"12px"} borderRadius={"4px"} />
        <SkeletonCard width={"95%"} height={"12px"} borderRadius={"4px"} />
        <SkeletonCard width={"85%"} height={"12px"} borderRadius={"4px"} />
      </Section>

      {/* Tabs / filter pills */}
      <Row>
        <SkeletonCard width={"96px"} height={"34px"} borderRadius={"999px"} />
        <SkeletonCard width={"110px"} height={"34px"} borderRadius={"999px"} />
        <SkeletonCard width={"84px"} height={"34px"} borderRadius={"999px"} />
        <SkeletonCard width={"100px"} height={"34px"} borderRadius={"999px"} />
      </Row>

      {/* Room cards */}
      <Section>
        <SkeletonCard width={"140px"} height={"18px"} borderRadius={"4px"} />
        {[0, 1].map((i) => (
          <RoomCard key={i}>
            <RoomImage>
              <SkeletonCard width={"100%"} height={"100%"} borderRadius={"10px"} />
            </RoomImage>
            <RoomBody>
              <SkeletonCard width={"min(70%, 240px)"} height={"16px"} borderRadius={"4px"} />
              <Row>
                <SkeletonCard width={"60px"} height={"18px"} borderRadius={"999px"} />
                <SkeletonCard width={"72px"} height={"18px"} borderRadius={"999px"} />
                <SkeletonCard width={"54px"} height={"18px"} borderRadius={"999px"} />
              </Row>
              <SkeletonCard width={"min(90%, 280px)"} height={"12px"} borderRadius={"4px"} />
              <Row style={{ justifyContent: "space-between", width: "100%" }}>
                <SkeletonCard width={"96px"} height={"22px"} borderRadius={"4px"} />
                <SkeletonCard width={"108px"} height={"34px"} borderRadius={"10px"} />
              </Row>
            </RoomBody>
          </RoomCard>
        ))}
      </Section>

      <LiveRegion aria-hidden="true">
        <PulseDot />
        <PulseDot delay="0.2s" />
        <PulseDot delay="0.4s" />
        <span>Loading hotel details…</span>
      </LiveRegion>
    </Container>
  );
};

export default HotelDetailsSkeleton;
