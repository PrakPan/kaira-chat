import { useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import ImageLoader from "../../../components/ImageLoader";
import Drawer from "../../../components/ui/Drawer";

import H8 from "../../../components/heading/H8";
import SkeletonCard from "../../../components/ui/SkeletonCard";
import { imgUrlEndPoint } from "../../../components/theme/ThemeConstants";
import { PlanYourTripButton } from "../../travelplanner/ThemePage";
import { DestinationCard } from "../../../components/revamp/common/components/card";

const ImageContainer = styled.div`
  position: relative;
  flex-shrink: 0;
  overflow: hidden;
`;

export default function ElementCard(props) {
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
      <DestinationCard
        placesBragSection={false}
        title={props?.data?.name}
        description={props?.data?.text}
        image={props?.data?.image}
        onClick={() => {
          handleCardClick();
        }}
      />

      <Drawer
        show={props.isOpen}
        anchor="right"
        backdrop
        width="50%"
        mobileWidth="100%"
        bgColor="#fafaf5"
        style={{ zIndex: props.zIndex || 1700 }}
        className="!overflow-y-hidden"
        onHide={handleCloseDrawer}
      >
        <div className="overflow-y-scroll h-screen px-6 max-ph:px-4 flex flex-col gap-4">
          <div className="py-4 bg-[#fafaf5] z-[900] flex items-center gap-2 sticky top-0">
            <Image
              src="/backarrow.svg"
              className="cursor-pointer"
              width={22}
              height={2}
              alt="Back"
              onClick={handleCloseDrawer}
            />
          </div>


          {shouldShowImageSection && (
            <ImageContainer style={{ height: "200px", maxHeight: "200px" }}>
              <div style={{ height: "200px", overflow: "hidden" }}>
                <div style={{ display: imageLoaded ? "block" : "none", height: "200px", overflow: "hidden" }}>
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
            </ImageContainer>
          )}

          <div>
            <p className="ttw-type-h3 font-600 text-[#0b1220]">
              {props?.data?.name}
            </p>
          </div>

          {props.data?.description && (
            <div className="flex flex-col gap-2 mb-4">
              <p className="ttw-type-body font-600 text-[#0b1220]">About</p>
              <div
                className="ttw-type-body text-[#0b1220]"
                dangerouslySetInnerHTML={{ __html: props.data.description }}
              />
            </div>
          )}

          {props.data?.text && (
            <div>
              <p className="ttw-type-body italic text-[#445069]">
                {props.data.text}
              </p>
            </div>
          )}
          <PlanYourTripButton className="w-full bg-[#f7e700] text-black font-500 ttw-type-body py-3 rounded-xl flex items-center justify-center gap-2" />
        </div>
      </Drawer>
    </>
  );
}