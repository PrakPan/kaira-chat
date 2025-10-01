import { motion, Variants } from "framer-motion";
import styled from "styled-components";
import {
  useLinkWithMarker,
  NavigationMarkerHandlers,
} from "./NavigationMarker";
import { Link } from "react-scroll";

const variants: Variants = {
  initial: { opacity: 0, x: 8 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { ease: "easeIn", duration: 0.2 },
  },
};

const Container = styled(motion.div)<{ isselected?: boolean }>`
  padding: 10px;
  cursor: pointer;
  width: max-content;
  padding: 10px 24px 10px 24px;
  margin-left: 4px;
  background-color: ${({ isselected }) => (isselected ? "#262626" : "none")};
  color: ${({ isselected }) => (isselected ? "#F7E700" : "#7A7A7A")};
  border-radius: ${({ isselected }) =>
    isselected ? "10% 10% 0 0" : "10% 10% 0 0"};
  transition: border-color 0.3s ease;
  font-weight: 600;
  :hover {
    background-color: ${({ isselected }) => (isselected ? "#262626" : "none")};
    color: "#F7E700";
    border-bottom: "2px solid #F7E700";
  }
`;

const Label = styled.div<{ isselected?: boolean }>`
  transition: all ease 0.3s;
  color: ${({ isselected }) => (isselected ? "#F7E700" : "#3d3c3b")};
  white-space: nowrap;

  :hover {
    color: ${({ isselected }) => (isselected ? "#F7E700" : "#010700")};
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
  setSelectedTab,
  ...restProps
}: Props) => {
  const { ref, handleSelect, handleMouseEnter, handleMouseLeave } =
    useLinkWithMarker<HTMLDivElement>({
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
      style={{ textDecoration: "none" }}
      spy={true}
      // duration={500}
      offset={-50}
      onSetActive={() => setSelectedTab(`${item.id}`)}
      {...restProps}
      {...variants}
      // onAnimationComplete={handleSelect}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Container isselected={isSelected} ref={ref}>
        <Label isselected={isSelected}>{children}</Label>
      </Container>
    </Link>
  );
};
