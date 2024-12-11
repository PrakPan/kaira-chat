import React from "react";
import styled from "styled-components";
import ImageLoader from "../../components/ImageLoader";

const FullImgContent = (props) => {
  return (
    <div className="w-full pl-3 pr-3 pt-5 md:py-[50px] md:px-[200px] flex flex-col md:flex-row md:items-center">
      <div className="text-[27px] md:text-[40px] font-[700] md:leading-[52px]">Trusted by Global brands</div>

      <div className="grid grid-cols-2 gap-10 md:grid-cols-5 w-full">
        <div className="center-div">
          <ImageLoader url="media/website/b2b/PricewaterhouseCoopers_Logo.png" />
        </div>
        <div className="center-div">
          <ImageLoader url="media/website/b2b/icons8-physics-wallah-240.svg" />
        </div>
        <div className="center-div">
          <ImageLoader url="media/website/b2b/TEG Logo.png" />
        </div>
        <div className="center-div">
          <ImageLoader url="media/website/b2b/SAMA Logo.jpeg" />
        </div>
        <div className="center-div">
          <ImageLoader url="media/website/b2b/Goodwind.jpeg" />
        </div>
      </div>
    </div>
  );
};

export default FullImgContent;
