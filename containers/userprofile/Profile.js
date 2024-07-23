import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { MdDone, MdEdit } from "react-icons/md";
import { MdVerified } from "react-icons/md";
import ImageLoader from "../../components/ImageLoader";
import media from "../../components/media";
import { EditInput, ImageInput } from "./EditProfile";
import * as authaction from "../../store/actions/auth";

const Container = styled.div`
  padding: 0.5rem;
  width: 90%;
  margin: auto;
  border-radius: 5px;
  @media screen and (min-width: 768px) {
    width: 100%;
  }
`;

const OverviewContainer = styled.div`
  @media screen and (min-width: 768px) {
    display: grid;
    grid-template-columns: 50% 50%;
    width: 100%;
  }
`;

const ImageNameContainer = styled.div`
  padding: 2rem 0;
  @media screen and (min-width: 768px) {
    padding: 0;
  }
`;

const Profile = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const [editImage, setEditImage] = useState(false);
  const [editName, setEditName] = useState(false);
  const [editPhone, setEditPhone] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [whatsapp, setWhatsapp] = useState(props.whatsapp_opt_in);
  const [emailVerifyHover, setEmailVerifyHover] = useState(false);
  const [phoneVerifyHover, setPhoneVerifyHover] = useState(false);

  useEffect(() => {
    handleSave();
  }, [whatsapp]);

  const handleSave = () => {
    props.changeUserDetails({ whatsapp_opt_in: whatsapp });
  };

  const Name = styled.p`
    font-size: ${(props) => props.theme.fontsizes.mobile.text.two};
    margin: 0 0 0 0;
    font-weight: 700;
    @media screen and (min-width: 768px) {
      font-size: ${(props) => props.theme.fontsizes.desktop.text.two};
      margin: 1rem;
    }
  `;

  const DetailsContainer = styled.div`
    text-align: center;
    padding: 2rem 0;
    @media screen and (min-width: 768px) {
      text-align: left;
    }
  `;

  const SectionHeading = styled.p`
    font-size: ${(props) => props.theme.fontsizes.mobile.text.two};
    @media screen and (min-width: 768px) {
      font-size: ${(props) => props.theme.fontsizes.desktop.text.one};
    }
  `;

  const DetailHeading = styled.p`
    font-size: ${(props) => props.theme.fontsizes.mobile.text.two};
    font-weight: 500;
    margin-bottom: 0.5rem;
    @media screen and (min-width: 768px) {
      font-size: ${(props) => props.theme.fontsizes.desktop.text.three};
      text-align: left;
      margin-bottom: 0.5rem;
    }
  `;

  const DetailText = styled.p`
    font-size: ${(props) => props.theme.fontsizes.mobile.text.three};
    font-weight: 300;
    color: #a0a0a0;
    @media screen and (min-width: 768px) {
      font-size: ${(props) => props.theme.fontsizes.desktop.text.three};
      float: left;
      display: inline;
    }
  `;

  return (
    <Container className="border-thin">
      <OverviewContainer>
        <ImageNameContainer className="center-div flex flex-col gap-4 items-center">
          {editImage ? (
            <ImageInput setEditImage={setEditImage}>
              <ImageLoader
                dimesions={{ width: 1600, height: 1600 }}
                dimensionsMobile={{ width: 1600, height: 1600 }}
                url={
                  props.image !== "null" && props.image !== null
                    ? props.image
                    : "media/website/user.svg"
                }
                width="100%"
                borderRadius="50%"
                widthmobile="95%"
              ></ImageLoader>
            </ImageInput>
          ) : (
            <div
              onClick={() => setEditImage(true)}
              className="w-[45%] cursor-pointer rounded-full"
            >
              <ImageLoader
                dimesions={{ width: 1600, height: 1600 }}
                dimensionsMobile={{ width: 1600, height: 1600 }}
                url={
                  props.image !== "null" && props.image !== null
                    ? props.image
                    : "media/website/user.svg"
                }
                width="100%"
                borderRadius="50%"
                widthmobile="95%"
              ></ImageLoader>
            </div>
          )}

          {editName ? (
            <div className="w-full flex items-center justify-center py-[12px]">
              <EditInput
                name="name"
                type="text"
                text={props.name}
                closeEdit={setEditName}
              />
            </div>
          ) : (
            <div className="flex flex-row gap-2 items-center">
              <Name className="font-lexend">{props.name}</Name>
              <MdEdit
                onClick={(e) => {
                  e.stopPropagation();
                  setEditName(true);
                }}
                className="text-xl cursor-pointer"
              />
            </div>
          )}
        </ImageNameContainer>

        {!isPageWide ? <hr style={{ margin: "0" }} /> : null}

        <DetailsContainer>
          {isPageWide ? (
            <SectionHeading
              className="font-lexend"
              style={{ fontWeight: "700", marginBottom: "2rem" }}
            >
              Your Profile
            </SectionHeading>
          ) : null}

          <DetailHeading className="font-lexend">
            <div>Contact Number</div>
          </DetailHeading>

          {editPhone ? (
            <div className="w-full flex flex-row justify-center items-center gap-3 mb-4">
              <EditInput
                name="phone"
                type="text"
                text={props.phone}
                closeEdit={setEditPhone}
              />
            </div>
          ) : (
            <div className="flex flex-row justify-center items-center md:justify-start gap-3 mb-4">
              <DetailText style={{ marginBottom: "0" }}>
                {props.phone}
              </DetailText>

              <MdEdit
                onClick={(e) => {
                  e.stopPropagation();
                  setEditPhone(true);
                }}
                className="text-xl cursor-pointer"
              />

              {props.is_phone_verified ? (
                <div
                  onMouseOver={() => setPhoneVerifyHover(true)}
                  onMouseOut={() => setPhoneVerifyHover(false)}
                  className="relative group"
                >
                  {phoneVerifyHover && (
                    <div className="absolute text-xs text-gray-600 right-[50%] translate-x-[50%] -top-4 transition-all">
                      Verified
                    </div>
                  )}

                  <MdVerified className="text-2xl text-green-500" />
                </div>
              ) : (
                <div
                  onClick={() => setEditPhone(true)}
                  className="text-sm text-white cursor-pointer bg-red-500 px-2 py-1 rounded-md"
                >
                  Verify Now
                </div>
              )}
            </div>
          )}

          <div className="flex flex-row items-center justify-center md:justify-start gap-2 mb-4">
            <div
              onClick={() => setWhatsapp((prev) => !prev)}
              className={`w-5 h-5 flex items-center justify-center rounded-md border-2 border-black cursor-pointer ${
                whatsapp && "bg-black"
              }`}
            >
              {whatsapp && <MdDone className="text-lg text-white" />}
            </div>

            <DetailHeading
              className="text-xs w-fit"
              style={{ marginBottom: "0", fontSize: "15px" }}
            >
              Receive booking updates on WhatsApp?
            </DetailHeading>
          </div>

          <DetailHeading className="font-lexend" style={{ clear: "both" }}>
            <div>Email</div>
          </DetailHeading>

          {editEmail ? (
            <div className="w-full flex items-center justify-center">
              <EditInput
                name="email"
                type="email"
                text={props.email}
                closeEdit={setEditEmail}
              />
            </div>
          ) : (
            <div className="flex flex-row gap-3 justify-center md:justify-start items-center">
              <DetailText style={{ marginBottom: "0" }}>
                {props.email}
              </DetailText>

              <MdEdit
                onClick={(e) => {
                  e.stopPropagation();
                  setEditEmail(true);
                }}
                className="text-xl cursor-pointer"
              />

              {props.is_email_verified ? (
                <div
                  onMouseOver={() => setEmailVerifyHover(true)}
                  onMouseOut={() => setEmailVerifyHover(false)}
                  className="relative group"
                >
                  {emailVerifyHover && (
                    <div className="absolute text-xs text-gray-600 right-[50%] translate-x-[50%] -top-4 transition-all">
                      Verified
                    </div>
                  )}

                  <MdVerified className="text-2xl text-green-500" />
                </div>
              ) : (
                <div
                  onClick={() => setEditEmail(true)}
                  className="text-sm text-white cursor-pointer bg-red-500 px-2 py-1 rounded-md"
                >
                  Verify Now
                </div>
              )}
            </div>
          )}
        </DetailsContainer>
      </OverviewContainer>
    </Container>
  );
};

const mapStateToPros = (state) => {
  return {
    otpFail: state.auth.otpFail,
    name: state.auth.name,
    phone: state.auth.phone,
    is_phone_verified: state.auth.is_phone_verified,
    email: state.auth.email,
    is_email_verified: state.auth.is_email_verified,
    image: state.auth.image,
    token: state.auth.token,
    whatsapp_opt_in: state.auth.whatsapp_opt_in,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSetProfilePic: (image) => dispatch(authaction.uploadProfilePic(image)),
    changeUserDetails: (payload) =>
      dispatch(authaction.changeUserDetails(payload)),
  };
};

export default connect(mapStateToPros, mapDispatchToProps)(Profile);
