import React, { useRef, useEffect, useState } from "react";
import Modal from "../ui/Modal";
import Login from "../userauth/LogInModal";
import styled from "styled-components";
import { connect, useDispatch } from "react-redux";
import ImageLoader from "../ImageLoader";
import media from "../media";
import Image from "next/image";

const ImgContainer = styled.div`
min-height: 100%;
  position: relative;
`;

const ImgTagsContainer = styled.div`
  position: absolute;
  bottom: -30px;
  transform: translateY(-43%);
  left: 10%;
`;

const ImgTagsMobContainer = styled.div`
  position: absolute;
  bottom: -30px;
  text-align:center;
  transform: translateY(-43%);
  display:flex;
  flex-direction:column;
  justify-content: center;
`;

const tags = [
  {
    src: "/facebook.svg",
    url: "https://www.facebook.com/thetarzanway/"
  },
  {
    src: "/instagram.svg",
    url: "https://www.instagram.com/thetarzanway/"
  },
  {
    src: "/x.svg",
    url: "https://x.com/TheTarzanWay"
  },
  {
    src: "/linkedin.svg",
    url: "https://www.linkedin.com/company/thetarzanway"
  },
  {
    src: "/pintrest.svg",
    url: "https://in.pinterest.com/thetarzanway/"
  },
]

const Enquiry = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const [modalWidth, setModalWidth] = useState(isPageWide ? "848px" : "100%");
  const [showImage, setShowImage] = useState(false);
  let myref = useRef(null);
  useEffect(() => {
    if (myref.current) {
      height = myref.current.offsetHeight;
    }
  }, [myref]);

  useEffect(() => {
    if (props.token && props.phone && props.onhide) props.onhide();
  }, [props.token, props.onhide, props.phone]);

  useEffect(() => {
    function findModalWidth() {
      if (window.innerWidth >= 1600) setModalWidth(50);
      else if (window.innerWidth >= 1400) setModalWidth("848px");
      else if (window.innerWidth >= 1100) setModalWidth("848px");
      else if (window.innerWidth >= 768) setModalWidth("100%");
      else if (window.innerWidth >= 600) setModalWidth("100%");
      else if (window.innerWidth >= 400) setModalWidth("100%");
      else setModalWidth("100%");
    }
    window.addEventListener("resize", findModalWidth);
    findModalWidth();
    return () => window.removeEventListener("resize", findModalWidth);
  }, []);

  if (isPageWide)
    return (
      <Modal
        centered
        closeIcon
        backdrop={props.hideloginclose ? "static" : true}
        show={props.show}
        onHide={props.onhide}
        borderRadius="20px"
        width={modalWidth}
        zIndex={props?.zIndex}
      >
        <div id="login-modal" style={{ display: "grid", gridTemplateColumns: "50% 50%" }}>
          <div
            style={{
              backgroundColor: "#2C2C2C",
              height: "100%",
              width: "100%",
              borderRadius: "20px 0 0 20px",
              display: showImage ? "none" : "block",
            }}
          ></div>

          <ImgContainer style={{ display: showImage ? "block" : "none" }}>
            <ImageLoader
              noLazy
              url={"media/themes/auth.png"}
              height="100%" 
              width="100%"
              onload={() => setShowImage(true)}
              borderRadius="20px"
            ></ImageLoader>

            <ImgTagsContainer>
              <div className={`text-[24px] sm:text-[32px] font-[700] leading-[40px] text-white mb-4 ${isPageWide ? "max-w-[334px]" : "max-w-[100%]"}`}>
                Your Personalized Travel Journey Starts with a Tap
              </div>
              <div className="flex gap-4">
                {tags?.map((item, index) => (
                  <a
                    key={index}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 flex items-center justify-center rounded-[60px] border border-white/40 bg-[rgba(255,255,255,0.36)] backdrop-blur-[4px] cursor-pointer"
                  >
                    <Image src={item?.src} width={20} height={20} alt="social" />
                  </a>
                ))}
              </div>
            </ImgTagsContainer>

          </ImgContainer>

          <div style={{ paddingTop: "20px" }}>
            <Login
              ref={myref}
              onhide={props.onhide}
              itinary_id={props.itinary_id}
              onSuccess={props?.onSuccess}
              message={props.message}
              isTailored={props?.isTailored}
              onSkipLogin={props?.onSkipLogin}
            ></Login>
          </div>
        </div>
      </Modal>
    );
  else
    return (
      <Modal
        centered
        backdrop={props.hideloginclose ? "static" : true}
        show={props.show}
        height={!isPageWide ? "100%" : "auto"}
        onHide={props.onhide}
        width={modalWidth}
        borderRadius={"12px"}
        token={props.token}
        itinary_id={props.itinary_id}
        zIndex={props?.zIndex}
        // className="overflow-y-auto"
        overflow="hidden"
        style={{ overflowY: "scroll" }}
      >
          <ImgContainer style={{
            display: showImage ? "block" : "none",
            height: "calc(100vh - 502px)",
            overflow: "hidden"
          }}>
            <ImageLoader
              noLazy
              url={"media/themes/auth.png"}
              height="560px"
              width="100%"
              
              onload={() => setShowImage(true)}
            ></ImageLoader>

            <ImgTagsMobContainer>
              <div className={`text-[24px] sm:text-[32px] font-[700] leading-[40px] text-white text-center mb-4 ${isPageWide? "max-w-[334px]" : "max-w-[100%]"}`}>
                Your Personalized Travel Journey Starts with a Tap
              </div>
              <div className="flex gap-4 items-center justify-center">
                {tags?.map((item, index) => (
                  <a
                    key={index}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 flex items-center justify-center rounded-[60px] border border-white/40 bg-[rgba(255,255,255,0.36)] backdrop-blur-[4px] cursor-pointer"
                  >
                    <Image src={item?.src} width={20} height={20} alt="social" />
                  </a>
                ))}
              </div>
            </ImgTagsMobContainer>

          </ImgContainer>
        <div className={`${isPageWide?"p-[20px]":"h-[570px]"}`} >
          <Login onhide={props.onhide} itinary_id={props.itinary_id} onSuccess={props?.onSuccess} isMobile={true} message={props.message} isTailored={props?.isTailored} onSkipLogin={props?.onSkipLogin}></Login>
        </div>
      </Modal>
    );
};

const mapStateToPros = (state) => {
  return {
    hideloginclose: state.auth.hideloginclose,
    token: state.auth.token,
    phone: state.auth.phone,
  };
};

export default connect(mapStateToPros)(Enquiry);
