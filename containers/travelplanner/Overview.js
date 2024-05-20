import React, { useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import media from "../../components/media";
import styled from "styled-components";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import H3 from "../../components/heading/H3";
import H9 from "../../components/heading/H9";

const Container = styled.div`
  padding: 0 1rem;
  @media screen and (min-width: 768px) {
    padding: 0;
  }
`;

const Overview = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const [more, setMore] = useState(false);
  const ref = useRef();

  return (
    <Container>
      <div>
        <H3
          style={{
            textAlign: isPageWide ? "left" : "center",
            margin: isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "0 0 3.5rem 0",
          }}
        >
          {props.overview_heading}
        </H3>
        <H9
          style={{
            lineHeight: 1.58,
          }}
          className="font-lexend"
        >
          <span ref={ref}>
            {more ? props.overview_text : props.overview_text.slice(0, 750)}
          </span>
          {props.overview_text.length > 750 && (
            <span
              className="hover-pointer text-container font-[600] text-gray-500 ml-1"
              onClick={() => setMore(!more)}
            >
              {!more ? (
                <>
                  ...more
                  <BiChevronDown
                    style={{
                      display: "inline",
                      fontSize: "1.2rem",
                      marginBottom: "0.2rem",
                    }}
                  ></BiChevronDown>
                </>
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
            </span>
          )}
        </H9>
      </div>
    </Container>
  );
};

export default Overview;
