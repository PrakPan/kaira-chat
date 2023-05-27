import styled from 'styled-components';
import media from '../../../components/media';

import { TbArrowBack } from 'react-icons/tb';
import SkeletonCard from '../../../components/ui/SkeletonCard';
const PoiListSkeleton = (props) => {
  const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 16px;
    width: 360px;
    @media screen and (min-width: 768px) {
      width: 50vw;
    }
  `;
  const Title = styled.p`
    font-weight: 800;
    font-size: 20px;
  `;
  let isPageWide = media('(min-width: 768px)');

  return (
    <Container>
      <Title>{props.name}</Title>
      <SkeletonCard width={isPageWide ? '468px' : '100%'} height={'188px'} />

      <SkeletonCard width={isPageWide ? '468px' : '100%'} height={'188px'} />
      <SkeletonCard width={isPageWide ? '468px' : '100%'} height={'188px'} />
      <SkeletonCard width={isPageWide ? '468px' : '100%'} height={'188px'} />

      <SkeletonCard width={isPageWide ? '468px' : '100%'} height={'150px'} />
    </Container>
  );
};

export default PoiListSkeleton;
