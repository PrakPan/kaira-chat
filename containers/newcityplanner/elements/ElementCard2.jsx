import { useState } from "react";
import Image from "next/image";
import ImageLoader from "../../../components/ImageLoader";
import Drawer from "../../../components/ui/Drawer";

import SkeletonCard from "../../../components/ui/SkeletonCard";
import { imgUrlEndPoint } from "../../../components/theme/ThemeConstants";
import { PlanYourTripButton } from "../../travelplanner/ThemePage";

export default function ElementCard2(props) {
  const [hover, setHover] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFail, setImageFail] = useState(false);

  const handleCardClick = (e) => {
    props._handleOpen(props.index);
  };

  const handleCloseDrawer = (e) => {
    props.handleCloseDrawer(e);
  };

  const placeholderImage = `${imgUrlEndPoint}/media/icons/bookings/notfounds/noroom.png`;
  const shouldShowImageSection = true;

  return (
    <>
      <div
        onClick={handleCardClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="group relative cursor-pointer p-3 gap-3 flex flex-col mx-1 w-full "
      >
        <div
          className={`absolute transition w-fit flex place-self-center bottom-[60%] z-50 bg-[#0b1220] text-white px-3 py-2 rounded-md drop-shadow-2xl ttw-type-small ${
            hover ? "opacity-100" : "opacity-0"
          }`}
        >
          {props?.data?.name}
        </div>

        <div className="relative  w-full overflow-hidden rounded-[24px]  aspect-[8/5]">
          <ImageLoader
            url={props?.data?.image || placeholderImage}
            dimensions={null}
            dimensionsMobile={null}
            width="100%"
            height="100%"
            borderRadius="24px"
            noLazy
            hoverpointer
            className="w-full"
          />
          {props?.data?.tag && (
            <span className="absolute z-[30] top-2 right-2 ttw-type-small bg-[#eef2fb] text-[#1a2436] px-2 py-0.5 rounded-full">
              {props?.data?.tag}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full h-[40%]">
          <div>
            <p
              className="ttw-type-body font-600 text-[#0b1220]"
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {props?.data?.name}
            </p>
          </div>

          <div className="ttw-type-small text-[#445069] line-clamp-2"
                dangerouslySetInnerHTML={{ __html: props.data.description }}
                >
          </div>
        </div>
      </div>

      <Drawer
        show={props.isOpen}
        anchor="right"
        backdrop
        width="50%"
        mobileWidth="100%"
        bgColor="#fafaf5"
        style={{ zIndex: 1501 }}
        className="!overflow-y-hidden"
        onHide={handleCloseDrawer}
      >
        <div className="overflow-y-scroll h-screen px-6 max-ph:px-4">
          <div className="py-4 bg-[#fafaf5] z-[900] flex flex-col gap-3 pb-2 sticky top-0">
            <Image
              src="/backarrow.svg"
              alt="back"
              className="cursor-pointer"
              width={22}
              height={2}
              onClick={handleCloseDrawer}
            />
          </div>

          {shouldShowImageSection && (
            <div className="relative flex-shrink-0 overflow-hidden rounded-xl" style={{ height: "200px", maxHeight: "200px" }}>
              <div style={{ height: "200px", overflow: "hidden" }}>
                <div
                  style={{
                    display: imageLoaded ? "block" : "none",
                    height: "200px",
                    overflow: "hidden",
                  }}
                >
                  <ImageLoader
                    borderRadius="12px"
                    widthMobile="100%"
                    width="100%"
                    height="200px"
                    style={{ objectFit: "cover", maxHeight: "200px" }}
                    url={
                      props.data.image && !imageFail
                        ? props.data.image
                        : placeholderImage
                    }
                    dimensionsMobile={{ width: 500, height: 200 }}
                    dimensions={{ width: 468, height: 200 }}
                    onload={() => {
                      setTimeout(() => {
                        setImageLoaded(true);
                      }, 500);
                    }}
                    onfail={() => {
                      setImageFail(true);
                      setImageLoaded(true);
                    }}
                    noLazy
                  />
                </div>

                <div
                  style={{
                    display: !imageLoaded ? "initial" : "none",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "200px",
                      overflow: "hidden",
                      borderRadius: "12px",
                    }}
                  >
                    <SkeletonCard />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4">
            <p className="ttw-type-h3 font-600 text-[#0b1220]">{props?.data?.name}</p>
          </div>

          {props.data?.description && (
            <div className="mt-4">
              <p className="ttw-type-body font-600 text-[#0b1220]">About</p>
              <p
                className="ttw-type-body text-[#445069]"
                dangerouslySetInnerHTML={{ __html: props.data.description }}
              />
            </div>
          )}

          {props.data?.text && (
            <div className="mt-4">
              <p className="ttw-type-body text-[#445069]" style={{ fontStyle: "italic" }}>
                {props.data.text}
              </p>
            </div>
          )}
          <PlanYourTripButton className="w-full bg-[#f7e700] text-black font-500 ttw-type-body py-3 rounded-xl flex items-center justify-center gap-2 mt-4 mb-6" />
        </div>
      </Drawer>
    </>
  );
}
