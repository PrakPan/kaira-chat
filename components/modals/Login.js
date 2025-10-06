import React, { useRef, useEffect, useState } from "react";
import Modal from "../ui/Modal";
import Login from "../userauth/LogInModal";
import styled from "styled-components";
import { connect, useDispatch } from "react-redux";
import ImageLoader from "../ImageLoader";
import media from "../media";
import Image from "next/image";
import { useRouter } from "next/router";
import { authCloseLogin } from "../../store/actions/auth";

const ImgContainer = styled.div`
  height: 100%;
  position: relative;
`;

const ImgTagsContainer = styled.div`
  position: absolute;
  bottom: -30px;
  transform: translateY(-43%);
  left: 10%;
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
  const [modalWidth, setModalWidth] = useState(isPageWide ? "848px" : "90%");
  const [showImage, setShowImage] = useState(false);
  let myref = useRef(null);
  const dispatch = useDispatch();
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
      else if (window.innerWidth >= 768) setModalWidth("90%");
      else if (window.innerWidth >= 600) setModalWidth("60%");
      else if (window.innerWidth >= 400) setModalWidth("80%");
      else setModalWidth("90%");
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
              height="560px"
              width="100%"
              onload={() => setShowImage(true)}
              borderRadius="20px"
            ></ImageLoader>

            <ImgTagsContainer>
              <div className="text-[32px] font-[700] leading-[40px] text-white mb-4 max-w-[334px]">
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
        onHide={props.onhide}
        width={modalWidth + "%"}
        borderRadius={"12px"}
        token={props.token}
        itinary_id={props.itinary_id}
        zIndex={props?.zIndex}
      >
        <div style={{ padding: "20px" }}>
          <Login onhide={props.onhide} itinary_id={props.itinary_id} onSuccess={props?.onSuccess}></Login>
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
