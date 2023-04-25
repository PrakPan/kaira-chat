import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { BiChevronDown } from "react-icons/bi";
const Container = styled.div`
  width: ${(props) => props.width || "100%"};
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  border-radius: 8px;
  height: ${(props) => props.ContainerHeight + "px"};
  transition: all 0.25s;
  overflow: clip;
`;
const DownIcon = styled.div`
  position: absolute;
  top: 50%;
  font-size: 2rem;
  right : 0.5rem;
  color: gray;
  transform : translateY(-90%);
  transform: ${(props) => (props.rotate ? `rotate(180deg)` : "")};
  transition: all 0.3s ease-out;
  height : 30%;
`;
const Summary= styled.div`
position : relative;
`
export default function Accordion(props) {
  const DetailsRef = useRef();
  const SummaryRef = useRef();
  const [height, setHeight] = useState(0);
  const [expanded, setExpanded] = useState(false);
  useEffect(()=>{
    if(props.initialOpen) setExpanded(true)
  },[])
  useEffect(() => {
    if (expanded)
      setHeight(
        DetailsRef.current.clientHeight + SummaryRef.current.clientHeight
      );
    else setHeight(SummaryRef.current.clientHeight);
  }, [expanded,props.children]);
  return (
    <Container ContainerHeight={height} {...props}>
      <Summary ref={SummaryRef} onClick={() => setExpanded(!expanded)}>
        {props.children[0]}
        <DownIcon rotate={expanded}>
        <BiChevronDown   />
      </DownIcon>
      </Summary>
      {<div ref={DetailsRef}>{props.children[1]}</div>}
       </Container>
  );
}

export const AccordionSummary = (props) => (
  <div {...props}>{props.children}
  
  </div>
);
export const AccordionDetails = (props) => (
  <div {...props} className="append">
    {props.children}
  </div>
);
