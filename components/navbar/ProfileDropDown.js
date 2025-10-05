import React, { useEffect, useRef } from "react";
import Link from "next/link";
import styled from "styled-components";
import ImageLoader from "../ImageLoader";
import urls from "../../services/urls";
import { getFirstName } from "../../services/getfirstname";
import usePageLoaded from "../custom hooks/usePageLoaded";
import { FaBell, FaUser } from "react-icons/fa";
import { MdOutlineLogout, MdAssignment } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import Image from "next/image";


const ProfileList = styled.span`
  font-weight: 500;
  text-align: center;
  padding: 1rem 0rem 0.5rem 0rem;
  display: flex;
  justify-content: flex-start;
  gap: 0.5rem;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover {
    color: lightgrey;
  }
  div {
    text-align: left;
  }
`;

const RedDot = styled.div`
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background-color: #f7e700;
  position: relative;
  top: 0.75rem;
  left: 2.25rem;
  z-index: 1000;
  font-size: 0.75rem;
`;

const ProfileContainer = styled.div`
  border-top: none;
  position: absolute;
  padding: 0rem 1rem 1rem 1rem;
  width: 15rem;
  right: -0.5rem;
  left: auto;
  transition: opacity 0.2s linear;
  height: auto;
  margin-top: ${(props) => (props.showProfileList ? `0` : "-40rem")};
  opacity: ${(props) => (props.showProfileList ? `1` : "0")};

  @media screen and (min-width: 768px) {
    border-top: none;
    width: max-content;
    top: 3rem;
    border-radius: 1rem !important;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    left: 50%;
    transform: translateX(-50%);
    padding: 0rem 1rem 1rem 1rem;
    border-radius: 0.5rem;
    z-index: 80;
    height: auto;
    margin-top: ${(props) => (props.showProfileList ? `0.2rem` : "-50rem")};
    opacity: ${(props) => (props.showProfileList ? `1` : "0")};
    transition: opacity 0.2s linear;
  }
`;

const ProfileDropDown = (props) => {
  const isPageLoaded = usePageLoaded();
  let profileRef = useRef();
  let firstname;

  if (props.name) {
    firstname = getFirstName(props.name);
  } else firstname = "Traveler";

  useEffect(() => {
    let handler = (event) => {
      if (!profileRef.current.contains(event.target)) {
        props.setShowDropDownProfileList(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  let AuthMenu = (
    <ProfileContainer
      className={props.headerColor === "white" ? "border" : ""}
      style={{
        backgroundColor:
          props.headerColor === "black" ? "rgba(0,0,0,0.7)" : "white",
        color: "rgba(0,0,0,0.7)",
      }}
      showProfileList={props.showDropDownProfileList}
      showProfileListMobile={props.showDropDownProfileListMobile}
    >
      <button 
        onClick={() => props.authShowLogin()} 
        style={{ 
          background: 'none', 
          border: 'none', 
          padding: 0, 
          cursor: 'pointer',
          width: '100%',
          textAlign: 'left'
        }}
      >
        <ProfileList>Login</ProfileList>
      </button>
    </ProfileContainer>
  );

  if (props.token)
    AuthMenu = (
      <ProfileContainer
        className={props.headerColor === "white" ? "border" : ""}
        style={{
          backgroundColor:
            props.headerColor === "black" ? "rgba(0,0,0,0.7)" : "white",
        }}
        showProfileList={props.showDropDownProfileList}
      >
        <ProfileList style={{ borderStyle: "none" }}>
          <FaUser /> <div>My Profile</div>
        </ProfileList>
        <ProfileList
          style={{ display: "grid", gridTemplateColumns: "auto max-content" }}
          onClick={props._handleNotifications}
        >
          <FaBell />
          <div>Notifications</div>
          {props.notOpenedCount ? (
            <div
              style={{
                fontWeight: "700",
                fontSize: "0.75rem",
                backgroundColor: "#f7e700",
                width: "1.25rem",
                height: "1.25rem",
                marginLeft: "0.5rem",
                color: "black",
                borderRadius: "50%",
              }}
              className="center-div"
            >
              {props.notOpenedCount}
            </div>
          ) : null}
        </ProfileList>

        <Link
          style={{ textDecoration: "none", color: "rgba(0,0,0,0.7)" }}
          href={urls.DASHBOARD}
          className="next-link"
          passHref={true}
        >
          <ProfileList>
            <Image src="trip.svg" alt="My Trips" width={15} height={15} />
            <div>My Trips</div>
          </ProfileList>
        </Link>
        <ProfileList onClick={props.onLogout}>
          <MdOutlineLogout /> <div>Logout</div>
        </ProfileList>
      </ProfileContainer>
    );

  return (
    <div
      ref={profileRef}
      className="relative w-fit"
    >
      {props.notifications.length && props.notOpenedCount ? (
        <RedDot className="center-div">1</RedDot>
      ) : null}

      <div className="w-full flex flex-row items-center gap-1">
        <ImageLoader
          borderRadius="50%"
          url={
            localStorage.getItem("user_image") !== "null" && localStorage.getItem("user_image") !== null
              ? localStorage.getItem("user_image")
              : "media/icons/navigation/profile-user.png"
          }
          width="2rem"
          height="2rem"
          dimensions={{ width: 300, height: 300 }}
          onclick={props.toggleProfileList}
          noPlaceholder={true}
        />
        <div className="Body2R_14">{props.name}</div>
        {isPageLoaded ? (
          <IoIosArrowDown
            width="18px"
            height="18px"
            onClick={props.toggleProfileList}
            style={{ color: props.headerColor === "black" ? "white" : "black" }}
          />
        ) : null}
      </div>

      {AuthMenu}
    </div>
  );
};

export default ProfileDropDown;
