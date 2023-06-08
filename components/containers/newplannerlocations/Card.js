import React from "react";
import styled from "styled-components";
import media from "../../media";
import ImageLoader from "../../ImageLoader";
import { useState } from "react";
import SkeletonCard from "../../ui/SkeletonCard";

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
// const ImageFade = styled.div`
// width: 100%;
// height: auto;
// border-radius: 10px;
// transition: 0.2s all ease-in-out;
// `;
//  const ImageContainer = styled.div`
//     position: relative;
//     overflow: hidden;
//     border-radius: 10px;

//     &:hover{
//         ${ImageFade}{
//           transition: 0.2s all ease-in-out;
//           transform: scale(1.1);
//          }
//     }
//     @media screen and (min-width: 768px){

//     }

//  `;

const Subtext = styled.p`
  font-weight: 400;
  font-size: 12px;
  margin: 0;
`;

const Experiences = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const [ImageLoaded, setImageLoaded] = useState(false);
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
          <ImageLoader
            hoverpointer
            url={props.img}
            dimensions={{ width: 800, height: 800 }}
            borderRadius="10px"
            dimensionsMobile={{ width: 800, height: 800 }}
            onload={() => setImageLoaded(true)}
          ></ImageLoader>
        </div>
        {!ImageLoaded && <SkeletonCard />}

        <div style={{ padding: "0.5rem 0" }} className="hover-pointer">
          {/* {ImageLoaded ? ( */}
            <>
              <Name className="font-lexend">{props.location}</Name>
              <Subtext className="font-lexend">{filters_to_show}</Subtext>
            </>
          {/* // ) : (
          //   <>
          //     <Name className="font-lexend">
          //       <SkeletonCard
          //         width={"60%"}
          //         height="15px"
          //         borderRadius={"3px"}
          //       />
          //     </Name>
          //     <Subtext className="font-lexend">
          //       <SkeletonCard
          //         width={"85%"}
          //         height="35px"
          //         borderRadius={"3px"}
          //       />
          //     </Subtext>
          //   </>
          // )} */}
        </div>
      </div>
    </>
  );
};

export default Experiences;
