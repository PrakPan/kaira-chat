import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styled from "styled-components";
import ImageLoader from "../ImageLoader";
import urls from "../../services/urls";
import { getFirstName } from "../../services/getfirstname";
import usePageLoaded from "../custom hooks/usePageLoaded";
import { FaBell, FaUser } from "react-icons/fa";
import { MdOutlineLogout } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useAnalytics } from "../../hooks/useAnalytics";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const DropdownContainer = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  width: 250px;
  max-height: 80vh;
  overflow-y: auto;
  z-index: 1000;
  opacity: ${(props) => (props.show ? 1 : 0)};
  visibility: ${(props) => (props.show ? "visible" : "hidden")};
  transform: ${(props) => (props.show ? "translateY(0)" : "translateY(-10px)")};
  transition: all 0.2s ease-in-out;
`;

const ListContainer = styled.div`
  padding: 0.5rem 0;
`;

const ListItem = styled.div`
  padding: 1rem 15px;
  display: flex;
  gap: 13px;
  align-items: center;
  font-family: Poppins;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #01202b;
`;

const Heading = styled.p`
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  text-transform: uppercase;
  color: #7a7a7a;
  margin: 1rem 0;
  padding: 0 1rem;
`;
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

const CircularImageWrapper = styled.div`
  width: 2rem;
  height: 2rem;
  min-width: 2rem;
  min-height: 2rem;
  max-width: 2rem;
  max-height: 2rem;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  /* Force all children to fill and be circular */
  & > * {
    border-radius: 50% !important;
    width: 100% !important;
    height: 100% !important;
    max-width: 100% !important;
    max-height: 100% !important;
  }

  /* Ensure image fills the container properly */
  img {
    width: 100% !important;
    height: 100% !important;
    max-width: 100% !important;
    max-height: 100% !important;
    object-fit: cover !important;
    border-radius: 50% !important;
  }

  /* Mobile specific fixes */
  @media screen and (max-width: 768px) {
    width: 2rem !important;
    height: 2rem !important;
    min-width: 2rem !important;
    min-height: 2rem !important;
    max-width: 2rem !important;
    max-height: 2rem !important;
  }
`;

const ProfileDropDown = (props) => {
  const isPageLoaded = usePageLoaded();
  let profileRef = useRef();
  let firstname;
  const router = useRouter();
  const [toggleMenu, setToggleMenu] = useState(false);
  const { trackUserLogout } = useAnalytics();
  const { id } = useSelector((state) => state.auth);

  if (props.name) {
    firstname = getFirstName(props.name);
  } else firstname = "Traveler";

  // useEffect(() => {
  //   let handler = (event) => {
  //     if (!profileRef.current.contains(event.target)) {
  //       props.setShowDropDownProfileList(false);
  //     }
  //   };
  //   document.addEventListener("mousedown", handler);
  //   return () => {
  //     document.removeEventListener("mousedown", handler);
  //   };
  // });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setToggleMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  var LinksArr = [
    {
      type: "main",
      link: "/dashboard",
      text: "My Trips",
      icon: "media/icons/navigation/trip.svg",
    },
    {
      type: "main",
      link: "http://blog.thetarzanway.com/",
      text: "Travel Feed",
      icon: "media/icons/navigation/chat.png",
    },
    {
      type: "main",
      link: "/testimonials",
      text: "Reviews",
      icon: "media/icons/navigation/testimonial.png",
    },
    {
      type: "others",
      link: "/contact",
      text: "Contact Us",
      icon: "media/icons/navigation/call.png",
    },
    {
      type: "others",
      link: "/covid-19-safe-travel-india",
      text: "Covid 19 Safety",
      icon: "media/icons/navigation/health-insurance.png",
    },
  ];

  if (!props.token) LinksArr = LinksArr.filter((e) => e.link != "/dashboard");

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
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          width: "100%",
          textAlign: "left",
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
            <Image src="/trip.svg" alt="My Trips" width={15} height={15} />
            <div>My Trips</div>
          </ProfileList>
        </Link>
        <ProfileList onClick={props.onLogout}>
          <MdOutlineLogout /> <div>Logout</div>
        </ProfileList>
      </ProfileContainer>
    );

  const MainLinksDiv = LinksArr.map((e, i) => {
    if (e.type === "main")
      return (
        <ListItem
          key={i}
          onClick={e.onclick && e.onclick}
          style={
            router.pathname === e.link ? { backgroundColor: "#ffff4a45" } : {}
          }
        >
          {e.icon && (
            <ImageLoader
              leftalign
              url={e.icon}
              height="20px"
              width="20px"
              dimensions={{ height: 50, width: 50 }}
              dimensionsMobile={{ height: 50, width: 50 }}
              widthmobile="20px"
              noPlaceholder={true}
            />
          )}
          {e.link && (
            <StyledLink
              style={{ textDecoration: "none" }}
              href={e.link}
              className="next-link"
              passHref={true}
            >
              {e.text}
            </StyledLink>
          )}
          {e.onclick && <div onClick={e.onclick}>{e.text}</div>}
        </ListItem>
      );
  });

  const OtherLinksDiv = LinksArr.map((e, i) => {
    if (e.type == "others")
      return (
        <ListItem
          key={i}
          onClick={e.onclick && e.onclick}
          style={
            router.pathname === e.link ? { backgroundColor: "#ffff4a45" } : {}
          }
        >
          {e.icon && (
            <ImageLoader
              leftalign
              url={e.icon}
              height="20px"
              width="20px"
              dimensions={{ height: 50, width: 50 }}
              dimensionsMobile={{ height: 50, width: 50 }}
              widthmobile="20px"
              noPlaceholder={true}
            />
          )}
          {e.link && (
            <StyledLink
              style={{ textDecoration: "none" }}
              href={e.link}
              className="next-link"
              passHref={true}
            >
              {e.text}
            </StyledLink>
          )}
          {e.onclick && <div onClick={e.onclick}>{e.text}</div>}
        </ListItem>
      );
  });

  return (
    <div ref={profileRef} className="relative w-fit">
      {props.notifications.length && props.notOpenedCount ? (
        <RedDot className="center-div">1</RedDot>
      ) : null}

      {/* <div className="w-full flex flex-row items-center gap-1">
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
          onclick={()=>setToggleMenu(!toggleMenu)}
          noPlaceholder={true}
        />
        <div className="Body2R_14">{props.name}</div>
        {isPageLoaded ? (
          <IoIosArrowDown
            width="18px"
            height="18px"
            onClick={()=>setToggleMenu(!toggleMenu)}
            style={{ color: props.headerColor === "black" ? "white" : "black" }}
          />
        ) : null}
      </div> */}

      <div className="w-full flex flex-row items-center gap-1">
        <CircularImageWrapper onClick={() => setToggleMenu(!toggleMenu)}>
          <ImageLoader
            url={
              props.image && props.image !== "null" && props.image !== null
                ? props.image
                : localStorage.getItem("user_image") !== "null" &&
                  localStorage.getItem("user_image") !== null
                ? localStorage.getItem("user_image")
                : "media/icons/navigation/profile-user.png"
            }
            width="2rem"
            height="2rem"
            dimensions={{ width: 300, height: 300 }}
            dimensionsMobile={{ width: 200, height: 200 }}
            noPlaceholder={true}
            // Remove the borderRadius prop - let the wrapper handle it
          />
        </CircularImageWrapper>
        <div className="Body2R_14">{props.name}</div>
        {isPageLoaded ? (
          <IoIosArrowDown
            width="18px"
            height="18px"
            onClick={() => setToggleMenu(!toggleMenu)}
            style={{ color: props.headerColor === "black" ? "white" : "black" }}
          />
        ) : null}
      </div>

      <DropdownContainer show={toggleMenu}>
        <ListContainer>
          {!props.token ? (
            <ListItem style={{ backgroundColor: "#F8F8F8" }}>
              <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
              <div onClick={props.handleCTAClick}>Login/Signup</div>
            </ListItem>
          ) : (
            <>
              <ListItem
                style={{ backgroundColor: "#F8F8F8" }}
                className="cursor-pointer"
                onClick={() => router.push("/dashboard")}
              >
                <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
                <div>My Profile</div>
              </ListItem>
            </>
          )}

          {MainLinksDiv}

          <Heading>OTHERS</Heading>

          {OtherLinksDiv}

          {props.token && (
            <ListItem
              onClick={() => {
                props.onLogout();
                setToggleMenu(false);
                trackUserLogout(id);
              }}
              className="cursor-pointer"
            >
              <ImageLoader
                leftalign
                url={"media/icons/navigation/logout.png"}
                height="20px"
                width="20px"
                dimensions={{ height: 50, width: 50 }}
                dimensionsMobile={{ height: 50, width: 50 }}
                widthmobile="20px"
                noPlaceholder={true}
              />
              <div>Logout</div>
            </ListItem>
          )}
        </ListContainer>
      </DropdownContainer>
    </div>
  );
};

export default ProfileDropDown;
