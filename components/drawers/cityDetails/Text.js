import React from "react";
import styled from "styled-components";
import media from "../../media";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";

const P = styled.div`
  font-weight: 400;
  text-align: left;
  line-height: 25px;
  position: relative;
  ${(props) => `height : ${props.clientHeight}px`};
  ${(props) => !props.more && "overflow : hidden ; height: 221px"};
  ${(props) => props.clientHeight < 221 && "height : auto"};
  transition: height 0.3s ease;

  @media screen and (min-width: 768px) {
    font-size: 14px;
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
        <p ref={ref}>{props.text}</p>
        {clientHeight > 221 && (
          <p
            className="hover-pointer text-container"
            onClick={() => setMore(!more)}
            style={{
              position: "absolute",
              right: "0",
              bottom: "-5px",
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
