import React, { useRef, useEffect, useState } from "react";
import Modal from "../ui/Modal";
import Login from "../userauth/LogInModal";
import styled from "styled-components";
import { connect } from "react-redux";
import ImageLoader from "../ImageLoader";
import media from "../media";
import Image from "next/image";
import { useRouter } from "next/router";

const ImgContainer = styled.div`
  height: 100%;
  position: relative;
  img {
    filter: brightness(0.5);
  }
`;

const ImgTagsContainer = styled.div`
  position: absolute;
  bottom: -30px;
  transform: translateY(-43%);
  left: 10%;
  img {
    filter: brightness(1);
  }
`;

const tags = [
  {
    src: "/facebook.svg",
    url: ""
  },
  {
    src: "/instagram.svg",
    url: ""
  },
  {
    src: "/x.svg",
    url: ""
  },
  {
    src: "/linkedin.svg",
    url: ""
  },
  {
    src: "/pintrest.svg",
    url: ""
  },
]

const Enquiry = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const [modalWidth, setModalWidth] = useState(!isPageWide ? 90 : 50);
  const [showImage, setShowImage] = useState(false);
  let myref = useRef(null);
  const router=useRouter();

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
      else if (window.innerWidth >= 1400) setModalWidth(60);
      else if (window.innerWidth >= 1100) setModalWidth(70);
      else if (window.innerWidth >= 768) setModalWidth(90);
      else if (window.innerWidth >= 600) setModalWidth(60);
      else if (window.innerWidth >= 400) setModalWidth(80);
      else setModalWidth(90);
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
        onHide={props.hideloginclose ? null : props.onhide}
        borderRadius="20px"
        width={modalWidth + "%"}
        zIndex={props?.zIndex}
      >
        <div style={{ display: "grid", gridTemplateColumns: "50% 50%" }}>
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
              url={"media/website/login-background.png"}
              height="100%"
              width="100%"
              onload={() => setShowImage(true)}
              borderRadius="20px"
            ></ImageLoader>

            <ImgTagsContainer>
              <div className="text-[32px] font-[700] leading-[40px] text-white mb-4">
                Your Personalized Travel Journey Starts with a Tap
              </div>
              <div className="flex gap-4">
                {tags?.map((item, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 flex items-center justify-center rounded-[60px] border border-white/40 bg-[rgba(255,255,255,0.36)] backdrop-blur-[4px] cursor-pointer"
                    onClick={()=>router.push(item.url)}
                  >
                    <Image src={item?.src} width={20} height={20} alt="social" />
                  </div>
                ))}
              </div>
            </ImgTagsContainer>

          </ImgContainer>

          <div style={{ padding: "20px" }}>
            <Login
              ref={myref}
              onhide={props.onhide}
              itinary_id={props.itinary_id}
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
        onHide={props.hideloginclose ? null : props.onhide}
        width={modalWidth + "%"}
        borderRadius={"12px"}
        token={props.token}
        itinary_id={props.itinary_id}
        zIndex={props?.zIndex}
      >
        <div style={{ padding: "20px" }}>
          <Login onhide={props.onhide} itinary_id={props.itinary_id}></Login>
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
