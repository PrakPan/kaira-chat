import React from "react";
import styled from "styled-components";
import media from "../../media";
import { useState } from "react";
// import ImageLoader from "../../UpdatedBackgroundImageLoader";
import ImageLoader from "../../ImageLoader";


const Container = styled.div`
  width: 100%;
  margin-bottom: 1rem;
  height: 60vh;
  @media screen and (min-width: 768px) {
    margin: 0;
    max-width: 100%;
    height: 30vh;
  }
  &:hover {
    cursor: pointer;
  }
`;

const Name = styled.p`
  padding: 0rem 0;
  color: black;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
  line-height: 1;

  width: 100%;

  @media screen and (min-width: 768px) {
  }
`;


const Subtext = styled.p`
  font-weight: 400;
  font-size: 12px;
  margin: 0;
`;

const Experiences = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const [ImageLoaded, setImageLoaded] = useState(false);
  console.log('ImageLoaded: ', ImageLoaded);
  let filters_to_show = "";
  try {
    for (var i = 0; i < props.filters.length; i++) {
      if (i === props.filters.length - 1)
        filters_to_show = filters_to_show + props.filters[i];
      else filters_to_show = filters_to_show + props.filters[i] + ", ";
    }
  } catch {}
  return (
    <>
      <div
        className="hover-pointer"
        onClick={() => {
          props.path ? props._handleCityRedirect(props.path) : console.log("");
        }}
      >
        <div>
          <div>
            <ImageLoader
              hoverpointer
              url={props.img}
              dimensions={{ width: 800, height: 800 }}
              borderRadius="10px"
              dimensionsMobile={{ width: 800, height: 800 }}
              onload={() => setImageLoaded(true)}
              // style={{paddingTop : '100%' , borderRadius : '10px'}}
            >
              <div></div>
            </ImageLoader>
          </div>
        </div>
        <div style={{ padding: "0.5rem 0" }} className="hover-pointer">
          <>
            <Name className="font-lexend">{props.location}</Name>
            <Subtext className="font-lexend">{filters_to_show}</Subtext>
          </>
       
        </div>
      </div>
    </>
  );
};

export default Experiences;
