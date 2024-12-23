import React from "react";
import ImageLoader from "../../components/ImageLoader";
import media from "../../components/media";


const FullImgContent = (props) => {
  let isPageWide = media("(min-width: 768px)");

  return (
    <div 
    style={{padding: isPageWide ? "80px 200px" : "40px 10px"}}
    className="w-full bg-[#F9F9F9] flex flex-col items-center gap-5">
      <div className="text-[27px] md:text-[40px] font-[700] md:leading-[52px]">Trusted by Global brands</div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <div className="center-div h-fit px-10 py-3 rounded-lg border-1 bg-white">
          <ImageLoader style={{width: !isPageWide && "50px"}} width={70 } url="media/website/b2b/PricewaterhouseCoopers_Logo.png" />
        </div>
        <div className="center-div h-fit px-10 py-3 rounded-lg border-1 bg-white">
          <ImageLoader style={{width: !isPageWide && "180px"}} width={200} url="media/website/b2b/pw.png" />
        </div>
        <div className="center-div h-fit px-10 py-1 rounded-lg border-1 bg-white">
          <ImageLoader style={{width: !isPageWide && "60px"}} width={80} url="media/website/b2b/csei.png" />
        </div>
        <div className="center-div h-fit px-10 py-1 rounded-lg border-1 bg-white">
          <ImageLoader style={{width: !isPageWide && "130px"}} width={150} url="media/website/b2b/teg.png" />
        </div>
        <div className="center-div h-fit px-10 py-[30px] rounded-lg border-1 bg-white">
          <ImageLoader style={{width: !isPageWide && "280px"}} width={300} url="media/website/b2b/botlab.png" />
        </div>

        <div className="center-div h-fit px-12 py-3 rounded-lg border-1 bg-white">
          <ImageLoader style={{width: !isPageWide && "30px"}} width={50} url="media/website/b2b/met.png" />
        </div>
        <div className="center-div h-fit px-10 py-3 rounded-lg border-1 bg-white">
          <ImageLoader style={{width: !isPageWide && "100px"}} width={120} url="media/website/b2b/your.png" />
        </div>
        <div className="center-div h-fit px-12 py-3 rounded-lg border-1 bg-white">
          <ImageLoader style={{width: !isPageWide && "80px"}} width={100} url="media/website/b2b/tssc.png" />
        </div>
      </div>
    </div>
  );
};

export default FullImgContent;
