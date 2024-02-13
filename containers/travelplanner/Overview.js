import React, { useEffect, useRef, useState } from "react";
// import { useRouter } from 'next/router';
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "../../components/ui/button/Index";
import media from "../../components/media";
// import * as ga from '../../services/ga/Index';

import styled from "styled-components";
// import ImageLoader from '../../components/ImageLoader';
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
const Container = styled.div`
  padding: 0 1rem;
  @media screen and (min-width: 768px) {
    padding: 0;
  }
`;

const Text = styled.div`
  font-size: 1rem;
  position: relative;
  font-weight: 300;
  margin: 0;
  text-align: justify;
  overflow: hidden;
  line-height: 1.58;
  text-overflow: ellipsis;
  // ${(props) => `height : ${props.clientHeight}px`};
  // ${(props) => !props.more && "overflow : hidden ; height: 300px"};
  display: -webkit-box;
  -webkit-box-orient: vertical;
  transition: height 0.3s ease;
  @media screen and (min-width: 768px) {
    text-align: justify;
  }
`;

const Heading = styled.h2`
  font-size: 32px;
  font-weight: 700;
  margin: 2.5rem 0 2.5rem 0;
  text-align: center;
  @media screen and (min-width: 768px) {
    text-align: left;
  }
`;
const Overview = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const [more, setMore] = useState(false);
  const [clientHeight, setClientHeight] = useState(false);
  const ref = useRef();

  // useEffect(() => {
  //   setClientHeight(ref.current.offsetHeight);
  // }, [isPageWide]);

  return (
    <Container>
      <div>
        <Heading
          align="center"
          aligndesktop="left"
          margin={!isPageWide ? "2.5rem 0.5rem 1.5rem 0.5rem" : "0 0 3.5rem 0"}
          bold
        >
          {props.overview_heading}
        </Heading>
        <Text className="font-lexend">
          <span ref={ref}>
            {more ? props.overview_text : props.overview_text.slice(0, 750)}
          </span>
          {props.overview_text.length > 750 && (
            <span
              className="hover-pointer text-container font-[600] text-gray-500 ml-1"
              onClick={() => setMore(!more)}
              // style={{
              //   position: "absolute",
              //   right: "0",
              //   bottom: "-3px",
              //   marginBottom: "0px",
              //   backgroundColor: "white",
              //   zIndex: "2",
              //   paddingLeft: "0.25rem",
              //   fontWeight: "600",
              // }}
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
        </Text>
      </div>
    </Container>
  );
};

export default Overview;
