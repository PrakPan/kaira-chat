import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { MdDone, MdEdit } from "react-icons/md";
import { MdVerified } from "react-icons/md";
import ImageLoader from "../../components/ImageLoader";
import media from "../../components/media";
import { EditInput } from "./EditProfile";
import * as authaction from "../../store/actions/auth";
import { userImageUploadInstance } from "../../services/user/edit";
import { getCountryCodes } from "../../store/actions/countryCodes";
import { useAnalytics } from "../../hooks/useAnalytics";

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
  const [editCounty, setEditCounry] = useState(false);
  const [editPhone, setEditPhone] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [whatsapp, setWhatsapp] = useState(props.whatsapp_opt_in);
  const [emailVerifyHover, setEmailVerifyHover] = useState(false);
  const [phoneVerifyHover, setPhoneVerifyHover] = useState(false);
  const [file, setFile] = useState(null);
  const [fileSizeError, setFileSizeError] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();
  const imageEditRef = useRef();
  const {trackUserAccountUpdate} = useAnalytics()

  useEffect(() => {
    props.getCountryCodes();
  }, []);

  useEffect(() => {
    handleSave();
  }, [whatsapp]);

  useEffect(() => {
    const maxSize = 5 * 1024 * 1024;
    let timeOut;
    if (file && file.size > maxSize) {
      setFileSizeError(true);
      timeOut = setTimeout(() => {
        setFileSizeError(false);
      }, 10000);
      return;
    }

    onFileUpload();

    return () => {
      clearTimeout(timeOut);
    };
  }, [file]);

  useEffect(() => {
    document.addEventListener("click", (e) => {
      if (imageEditRef.current && !imageEditRef.current.contains(e.target)) {
        setEditImage(false);
      }
    });
  }, []);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onFileUpload = async (remove = false) => {
    setEditImage(false);

    if (remove) {
      setLoading(true);

      userImageUploadInstance
        .delete("", {
          headers: {
            Authorization: `Bearer ${props.token}`,
          },
        })
        .then((response) => {
          props.setUserDetails(response.data);
          setLoading(false);
          setEditImage(false);
        })
        .catch((err) => {
          setLoading(false);
          setEditImage(false);
          console.log("[ERROR][EditProfile:onFileUpload]: ", err.message);
        });

      return;
    }

    if (!file) {
      setEditImage(false);
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("profile_pic", file);

    userImageUploadInstance
      .put("", formData, {
        headers: {
          Authorization: `Bearer ${props.token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        props.setUserDetails(response.data);
        setLoading(false);
        setEditImage(false);
      })
      .catch((err) => {
        setLoading(false);
        setEditImage(false);
        console.log("[ERROR][EditProfile:onFileUpload]: ", err.message);
      });
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSave = () => {
    props.changeUserDetails({name:props.name,country:props.country, whatsapp_opt_in: whatsapp },trackUserAccountUpdate);
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
    text-align: left;
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

  const userData={
    name:props.name,
    whatsapp_opt_in:props.whatsapp_opt_in,
    country:props.country
  }

  return (
    <Container className="border-thin">
      <OverviewContainer>
        <ImageNameContainer className={`center-div`}>
          <div className={`relative ${loading && "animate-pulse"}`}>
            <ImageLoader
              borderRadius="50%"
              url={
                props.image !== "null" && props.image !== null
                  ? props.image
                  : "media/icons/navigation/profile-user.png"
              }
              width="10rem"
              height="10rem"
              dimesions={{ width: 1600, height: 1600 }}
              dimensionsMobile={{ width: 1600, height: 1600 }}
              noPlaceholder={true}
            />

            <div
              ref={imageEditRef}
              className="absolute top-[70%] left-[75%] flex flex-col gap-1 w-full"
            >
              <div
                onClick={() => setEditImage((prev) => !prev)}
                className="w-fit py-1 px-2 bg-black cursor-pointer text-white text-xs border-2 border-gray-600 rounded-md flex flex-row gap-1 items-center"
              >
                <MdEdit /> Edit
              </div>

              {editImage && (
                <div className="w-fit flex flex-col gap-1 py-2 text-sm text-white bg-black border-2 border-gray-600 rounded-md cursor-pointer">
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={onFileChange}
                    className="hidden"
                  ></input>
                  {fileSizeError && (
                    <div className="w-full text-xs text-red-500 px-1 text-nowrap">
                      File size exceeds 5MB!
                    </div>
                  )}
                  <div
                    onClick={triggerFileInput}
                    className="cursor-pointer hover:bg-gray-700 py-1 px-3"
                  >
                    Upload a photo
                  </div>
                  <div
                    onClick={() => onFileUpload(true)}
                    className="cursor-pointer hover:bg-gray-700 py-1 px-3"
                  >
                    Remove photo
                  </div>
                </div>
              )}
            </div>
          </div>

          {editName ? (
            <div className="w-full flex items-center justify-center py-[12px]">
              <EditInput
                name="name"
                type="text"
                text={props.name}
                closeEdit={setEditName}
                userData={userData}
              />
            </div>
          ) : (
            <div className="flex flex-row gap-2 items-center">
              <Name className="">{props.name}</Name>
              <MdEdit
                onClick={(e) => {
                  e.stopPropagation();
                  setEditName(true);
                }}
                className="text-xl cursor-pointer"
              />
            </div>
          )}

          {editCounty ? (
            <div className="w-full flex items-center justify-center py-[12px]">
              <EditInput
                name="country"
                type="text"
                text={props.country ? props.country : ""}
                closeEdit={setEditCounry}
                userData={userData}
              />
            </div>
          ) : props.country &&
            props.country !== "" &&
            props.country !== "null" ? (
            <div className="flex flex-row items-center gap-2">
              <Image
                height="29"
                width="29"
                objectFit="cover"
                style={{ display: props.CountryCodes ? "block" : "none" }}
                src={
                  props.CountryCodes
                    ? props.CountryCodes[props.country]?.img
                    : ""
                }
              ></Image>
              {props.country}
              <MdEdit
                onClick={(e) => {
                  e.stopPropagation();
                  setEditCounry(true);
                }}
                className="text-xl cursor-pointer"
              />
            </div>
          ) : (
            <div
              onClick={() => setEditCounry(true)}
              className="text-sm text-blue underline cursor-pointer"
            >
              Add your country
            </div>
          )}
        </ImageNameContainer>

        {!isPageWide ? <hr style={{ margin: "0" }} /> : null}

        <DetailsContainer>
          {isPageWide ? (
            <SectionHeading
              className=""
              style={{ fontWeight: "700", marginBottom: "2rem" }}
            >
              Your Profile
            </SectionHeading>
          ) : null}

          <DetailHeading className="">
            <div>Contact Number</div>
          </DetailHeading>

          {editPhone ? (
            <div className="w-full flex flex-row justify-start items-center gap-3 mb-4">
              <EditInput
                name="phone"
                type="text"
                text={props.phone}
                closeEdit={setEditPhone}
                userData={userData}
              />
            </div>
          ) : (
            <div className="flex flex-row justify-start items-center gap-3 mb-4">
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

          <div className="flex flex-row items-center justify-start gap-3 mb-4">
            <div
              onClick={() => {
                // const RequestData={
                //   name:props.name,
                //   whatsapp_opt_in:!whatsapp,
                //   country:props.country
                // }
                // axiosuserinstance
                //   .put("/", RequestData, {
                //     headers: {
                //       Authorization: `Bearer ${token}`,
                //     },
                //   })
                //   .then((res) => {
                //     setUserDetails(res.data);
                //     setLoading(false);
                //     closeEdit(false);
                //   })
                //   .catch((err) => {
                //     setLoading(false);
                //     closeEdit(false);
                //     if (err?.response?.data?.name) {
                //       console.log(err.response.data.name[0]);
                //     } else {
                //       console.log(err?.response?.data);
                //     }
                //   });
                setWhatsapp((prev) => !prev)
              }}
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

          <DetailHeading className="" style={{ clear: "both" }}>
            <div>Email</div>
          </DetailHeading>

          {editEmail ? (
            <div className="w-full flex items-start justify-center">
              <EditInput
                name="email"
                type="email"
                text={props.email}
                closeEdit={setEditEmail}
                userData={userData}
              />
            </div>
          ) : (
            <div className="flex flex-row gap-3 justify-start items-center">
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
                    <div className="absolute text-xs text-nowrap text-gray-600 right-[50%] translate-x-[50%] -top-4 transition-all">
                      Last Verified on{" "}
                      {new Date(props.email_last_verified_on).toDateString()}
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
    country: state.auth.country,
    phone: state.auth.phone,
    is_phone_verified: state.auth.is_phone_verified,
    email: state.auth.email,
    is_email_verified: state.auth.is_email_verified,
    image: state.auth.image,
    token: state.auth.token,
    whatsapp_opt_in: state.auth.whatsapp_opt_in,
    email_last_verified_on: state.auth.email_last_verified_on,
    CountryCodes: state.CountryCodes,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSetProfilePic: (image) => dispatch(authaction.uploadProfilePic(image,trackUserAccountUpdate)),
    changeUserDetails: (payload,trackUserAccountUpdate) =>
      dispatch(authaction.changeUserDetails(payload,trackUserAccountUpdate)),
    setUserDetails: (payload) => dispatch(authaction.setUserDetails(payload)),
    getCountryCodes: () => dispatch(getCountryCodes()),
  };
};

export default connect(mapStateToPros, mapDispatchToProps)(Profile);
