import React from "react";
import styled from "styled-components";
import media from "../media";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
const P = styled.div`
  font-weight: 300;
  text-align: left;
  line-height: 25px;
  position: relative;
  ${(props) => `height : ${props.clientHeight}px`};
  // max-height : none;
  ${(props) => !props.more && `overflow : hidden ; height: 130px`};
  ${(props) => props.clientHeight < 130 && "height : auto"};
  transition: height 0.3s ease;

  @media screen and (min-width: 768px) {\
      ${(props) => !props.more && `overflow : hidden ; height: 144px`};
  ${(props) => props.clientHeight < 144 && "height : auto"};
    font-size: 14px;
    font-weight : 400;
  }
`;

const Heading = styled.p`
  font-size: 18px;
  font-weight: 600;
  margin-block: 1rem;
`;
const Text = (props) => {
  const isPageWide = media("(min-width: 768px)");
  const [more, setMore] = useState(false);
  const [clientHeight, setClientHeight] = useState(false);
  const ref = useRef();
  useEffect(() => {
    setClientHeight(ref.current.offsetHeight);
  }, [isPageWide]);
  return (
    <>
      {props.heading && <Heading>{props.heading}</Heading>}
      <P more={more} clientHeight={clientHeight}>
        <p ref={ref}>{props.children}</p>
        {clientHeight > 144 && (
          <p
            className="hover-pointer text-container"
            onClick={() => setMore(!more)}
            style={{
              position: "absolute",
              right: "0",
              bottom: "-8px",
              marginBottom: "0px",
              backgroundColor: "white",
              zIndex: "2",
              paddingLeft: "0.25rem",
              fontWeight: "600",
            }}
          >
            {!more ? (
              <div style={{ dispay: "flex" }}>
                ...more
                <BiChevronDown
                  style={{
                    display: "inline",
                    fontSize: "1.2rem",
                    marginBottom: "0.2rem",
                  }}
                ></BiChevronDown>
              </div>
            ) : (
              <>
                ...less
                <BiChevronUp
                  style={{
                    display: "inline",
                    fontSize: "1.2rem",
                    marginBottom: "0.2rem",
                  }}
                ></BiChevronUp>
              </>
            )}
          </p>
        )}
      </P>
    </>
  );
};

export default Text;
