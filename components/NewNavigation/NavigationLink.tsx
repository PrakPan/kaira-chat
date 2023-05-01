import styled from '@emotion/styled';
import { motion, Variants } from 'framer-motion';
import {
  useLinkWithMarker,
  NavigationMarkerHandlers,
} from './NavigationMarker';
import { Link } from 'react-scroll';

const variants: Variants = {
  initial: { opacity: 0, x: 8 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { ease: 'easeIn', duration: 0.2 },
  },
};

const Container = styled(motion.div)<{ isSelected?: boolean }>`
  padding: 10px;
  cursor: pointer;
  width: max-content;
  padding: 10px 24px 10px 24px;
  margin-left: 4px;
  background-color: ${({ isSelected }) => (isSelected ? '#262626' : 'none')};
  color: ${({ isSelected }) => (isSelected ? '#F7E700' : '#7A7A7A')};

  border-radius: ${({ isSelected }) =>
    isSelected ? '10% 10% 0 0' : '10% 10% 0 0'};
  transition: border-color 0.3s ease;
  font-weight: 600;
  /* border-bottom: ${({ isSelected }) =>
    isSelected ? '4px solid #F7E700' : '4px solid transparent'}; */
  :hover {
    background-color: ${({ isSelected }) => (isSelected ? '#262626' : 'none')};
    color: '#F7E700';
    border-bottom: '2px solid #F7E700';
  }
`;

const Label = styled.div<{ isSelected?: boolean }>`
  transition: all ease 0.3s;
  color: ${({ isSelected }) => (isSelected ? '#fff' : '#3d3c3b')};
  white-space: nowrap;

  :hover {
    color: ${({ isSelected }) => (isSelected ? '#fff' : '#010700')};
  }
`;

interface Props extends NavigationMarkerHandlers {
  isSelected?: boolean;
  children?: React.ReactNode | React.ReactNode[];
  onClick: () => void;
  className?: string;
}

export const NavigationLink = ({
  isSelected = false,
  item,
  BarName,
  children,
  onMouseLeave,
  onMouseEnter,
  onSelect,
  ...restProps
}: Props) => {
  const {
    ref,
    handleSelect,
    handleMouseEnter,
    handleMouseLeave,
  } = useLinkWithMarker<HTMLDivElement>({
    isSelected,
    onSelect,
    onMouseEnter,
    onMouseLeave,
  });

  return (
    <Link
      key={item.id}
      to={item.link}
      id={`${BarName} ${item.id}`}
      style={{ textDecoration: 'none' }}
      spy={true}
      // duration={500}
      offset={-150}
      onSetActive={() => onSelect(item.id)}
      {...restProps}
      {...variants}
      onAnimationComplete={handleSelect}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Container isSelected={isSelected} ref={ref}>
        <Label isSelected={isSelected}>{children}</Label>
      </Container>
    </Link>
  );
};
