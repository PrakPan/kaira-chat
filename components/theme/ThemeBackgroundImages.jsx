import PrimaryHeading from "../heading/PrimaryHeading";
import media from "../media";
import { imgUrlEndPoint } from "./ThemeConstants";
import Image from "next/image.js";

const ThemeBackground = (props) =>{

    console.log("Priority",props?.component?.priority,props?.slug);
    let isPageWide = media("(min-width: 768px)");
    return (
        <>
          {props.slug === "perfect-proposals-2025" &&  (
            <>
              {props?.component?.priority === 1  && (
                <div className="relative w-full flex items-center justify-between mt-5">
                  {isPageWide &&<div className="w-[9%] h-[5rem]">
                    <Image
                      src={`${imgUrlEndPoint}media/themes/proposal-filter.png`}
                      layout="responsive"
                      width={100} 
                      height={50} 
                      className="object-fill"
                    />
                  </div>}
    

                  <div className="flex-1 text-center">
                    <PrimaryHeading className="mx-auto">{props.component.heading}</PrimaryHeading>
                  </div>
    
                  {isPageWide && <div className="w-[9%] h-[5rem]">
                    <Image
                      src={`${imgUrlEndPoint}media/themes/proposal-filter.png`}
                      layout="responsive"
                      width={100} 
                      height={50} 
                      className="object-fill"
                    />
                  </div>}
                </div>
              )}
    
              {props?.component?.priority === 9 && (
                <div className="relative w-full flex items-center justify-between mt-5">
                  {isPageWide && <div className="w-[9%] h-[5rem]">
                    <Image
                      src={`${imgUrlEndPoint}media/themes/proposal-itinerary.png`}
                      layout="responsive"
                      width={100} 
                      height={50} 
                      className="object-fill"
                    />
                  </div>}
    
                  <div className="flex-1 text-center">
                    <PrimaryHeading className="mx-auto">{props.component.heading}</PrimaryHeading>
                  </div>
    
                  {isPageWide && <div className="w-[9%] h-[5rem]">
                    <Image
                      src={`${imgUrlEndPoint}media/themes/proposal-itinerary.png`}
                      layout="responsive"
                      width={100} 
                      height={50}
                      className="object-fill"
                    />
                  </div>}
                </div>
              )}
    
              {props?.component?.priority === 13 && (
                <div className="relative w-full flex items-center justify-between mt-5">
                  {isPageWide && <div className="w-[9%] h-[5rem]">
                    <Image
                      src={`${imgUrlEndPoint}media/themes/proposal-review.png`}
                      layout="responsive"
                      width={100} 
                      height={50} 
                      className="object-fill"
                    />
                  </div>}
    
              
                  <div className="flex-1 text-center">
                    <PrimaryHeading className="mx-auto">{props.component.heading}</PrimaryHeading>
                  </div>
    
                  {isPageWide && <div className="w-[9%] h-[5rem]">
                    <Image
                      src={`${imgUrlEndPoint}media/themes/proposal-review.png`}
                      layout="responsive"
                      width={100} 
                      height={50} 
                      className="object-fill"
                    />
                  </div>}
                </div>
              )}
            </>
          )}
        </>
      );
}

export default ThemeBackground;
