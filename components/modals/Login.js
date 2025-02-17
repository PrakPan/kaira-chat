import React, { useRef, useEffect, useState } from "react";
import Modal from "../ui/Modal";
import Login from "../userauth/LogInModal";
import styled from "styled-components";
import { connect } from "react-redux";
import ImageLoader from "../ImageLoader";
import media from "../media";

const ImgContainer = styled.div`
  height: 100%;
  position: relative;
  img {
    filter: brightness(0.5);
  }
`;

const ImgTagsContainer = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-43%);
  left: 10%;
  img {
    filter: brightness(1);
  }
`;

const TagItem = styled.div`
  display: grid;
  grid-template-columns: 40px 2fr;
  gap: 1rem;
  margin-bottom: 2rem;
  p {
    color: white;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    margin-block: auto;
  }
`;

const TagsContent = [
  {
    icon: "media/icons/login/free-travel.png",
    text: "Unlimited travel plans for free!",
  },
  {
    icon: "media/icons/login/discount.png",
    text: "Exclusive deals: Upto 70% off!",
  },
  { icon: "media/icons/login/officer.png", text: "Expert support, 24x7!" },
  {
    icon: "media/icons/login/night-stay.png",
    text: "Free night stay on selected properties!",
  },
];

const Enquiry = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const [modalWidth, setModalWidth] = useState(!isPageWide ? 90 : 50);
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
              borderRadius="20px 0 0 20px"
            ></ImageLoader>

            <ImgTagsContainer>
              {TagsContent.map((e, i) => (
                <TagItem key={i}>
                  <ImageLoader
                    noLazy
                    borderRadius={"0.4rem 0 0 0.4rem"}
                    url={e.icon}
                    dimensions={{ width: 200, height: 200 }}
                    noPlaceholder={true}
                  />
                  <p className="font-lexend">{e.text}</p>
                </TagItem>
              ))}
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
