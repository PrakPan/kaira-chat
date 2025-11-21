import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { BsCaretDownFill } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";

const Container = styled.div`
  width: ${(props) => props.width || "100%"};
  ${(props) =>
    props.border &&
    "box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;"}

  height: ${(props) => props.ContainerHeight + "px"};
  transition: all 0.25s;
  overflow: clip;
`;

const DropDownIcon = styled.div`
  position: absolute;
  right: 5px;
  top: 50%;
  translate: 0 -50%;
  transform: rotate(0deg);
  transition: all 0.3s ease-out;
  transform: ${(props) => (props.rotate ? `rotate(180deg) ; ` : "")};
  opacity: 0.8;
`;

const Summary = styled.div`
  position: relative;
`;

export default function Accordion(props) {
  const DetailsRef = useRef();
  const SummaryRef = useRef();
  const [height, setHeight] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (props.open) setOpen(true);
    else setOpen(false);
  }, [props.open]);

  useEffect(() => {
    if (props.initialOpen) {
      setOpen(true);
      if (props.setOpen) props.setOpen(true);
    }
  }, []);

  useEffect(() => {
    if (open)
      setHeight(
        DetailsRef.current.clientHeight + SummaryRef.current.clientHeight
      );
    else setHeight(SummaryRef.current.clientHeight);
  }, [open, props.children]);

  return (
    <Container border={props.border} ContainerHeight={height} {...props}>
      <Summary
        ref={SummaryRef}
        onClick={() => {
          setOpen(!open);
          if (props.setOpen) props.setOpen(!open);
        }}
      >
        {props.children[0]}
        <DropDownIcon rotate={open} style={props.iconStyle}>
          <IoIosArrowDown className="text-blue"/>
          {/* <BsCaretDownFill /> */}
        </DropDownIcon>
      </Summary>
      {<div ref={DetailsRef}>{props.children[1]}</div>}
    </Container>
  );
}

export const AccordionSummary = (props) => (
  <div {...props}>{props.children}</div>
);

export const AccordionDetails = (props) => (
  <div {...props} className="append">
    {props.children}
  </div>
);
