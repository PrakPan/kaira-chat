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

const Container = styled(motion.div) <{ isselected?: boolean }>`
  padding: 10px;
  cursor: pointer;
  width: max-content;
  padding: 10px 24px 10px 24px;
  margin-left: 4px;
  transition: border-color 0.3s ease;
  opacity : ${({ isselected }) => (isselected ? "" : "0.4")};

  :hover {
    color: #01202B;
    opacity:1;
    border-bottom: "1px solid #F7E700";
  };
`;

const Label = styled.div<{ isselected?: boolean }>`
  transition: all ease 0.3s;
  color: #01202B;
  white-space: nowrap;
  font-weight: 500;
  font-size:16px;
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
      <Container className="font-montserrat" isselected={isSelected} ref={ref}>
        <Label isselected={isSelected}>{children}</Label>
      </Container>
    </Link>
  );
};
