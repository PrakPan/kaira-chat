import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faHiking } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import * as authaction from "../../store/actions/auth";
import Slider from "@mui/material/Slider";
import { withStyles, makeStyles } from "@mui/material/styles";
// import Button from '../../components/Button';
import Button from "../../components/ui/button/Index";
import urls from "../../services/urls";
const Profile = (props) => {
  const Container = styled.div`
    @media screen and (min-width: 768px) {
    }
  `;
  const OverviewContainer = styled.div`
    display: grid;
    @media screen and (min-width: 768px) {
      grid-template-columns: 50% 50%;
    }
  `;
  const CountContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 0.5rem;
  `;
  const DP = styled.img`
    border-radius: 50%;
    width: 60%;
    @media screen and (min-width: 768px) {
      width: 40%;
    }
  `;
  const Name = styled.p`
    font-size: ${(props) => props.theme.fontsizes.mobile.text.two};
    margin: 1rem;
    @media screen and (min-width: 768px) {
      font-size: ${(props) => props.theme.fontsizes.desktop.text.two};
    }
  `;
  const Count = styled.p`
    margin: 0rem;
    font-size: ${(props) => props.theme.fontsizes.mobile.headings.three};
    @media screen and (min-width: 768px) {
      font-size: ${(props) => props.theme.fontsizes.desktop.headings.two};
    }
  `;
  const DetailsContainer = styled.div`
    padding: 2rem 0;
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
    @media screen and (min-width: 768px) {
      font-size: ${(props) => props.theme.fontsizes.desktop.text.three};
      text-align: left;
    }
  `;
  const DetailText = styled.span`
    font-size: ${(props) => props.theme.fontsizes.mobile.text.three};
    font-weight: 300;
    color: #a0a0a0;
    display: inline;
    @media screen and (min-width: 768px) {
      font-size: ${(props) => props.theme.fontsizes.desktop.text.three};
      float: left;
    }
  `;
  const PreferencesContainer = styled.div`
    width: 80%;
    margin: 2rem auto;
  `;
  const SlidersContainer = styled.div`
    display: grid;
    grid-template-columns: max-content auto;
    grid-gap: 1.5rem;
  `;
  const PrettoSlider = withStyles({
    root: {
      color: "#f7e700",
      height: 8,
      margin: "0.5rem 0",
    },
    thumb: {
      height: 16,
      width: 16,
      backgroundColor: "currentColor",
      border: "2px solid currentColor",
      marginTop: -6,
      marginLeft: -12,
      "&:focus, &:hover, &$active": {},
    },
    active: {},
    valueLabel: {
      left: "calc(-50% - 4px)",
    },
    track: {
      height: 5,
      borderRadius: 4,
    },
    rail: {
      height: 5,
      borderRadius: 4,
      opacity: "0.3",
    },
  })(Slider);

  return (
    <Container>
      <OverviewContainer>
        <div className="center-div">
          {/* <DP src={img}></DP> */}
          <Name className="font-lexend">
            <b>Shikhar Chadha</b>
          </Name>
        </div>
        {/* <CountContainer>
    <div className="center-div" >
        <Count className="font-lexend">10</Count>
        <p className="font-avenir" style={{textAlign: "center", height: "4rem"}}>Expereinces Saved</p>
    </div>
    <div className="center-div" >
        <Count className="font-lexend">24</Count>
        <p className="font-avenir" style={{textAlign: "center", height: "4rem"}}>Expereinces Taken</p>
    </div>
    <div className="center-div" >
        <Count className="font-lexend">10</Count>
        <p className="font-avenir" style={{textAlign: "center", height: "4rem"}}>Plans Created</p>
    </div>
    </CountContainer> */}
        <DetailsContainer>
          <SectionHeading
            className="font-lexend"
            style={{ fontWeight: "700", marginBottom: "2rem" }}
          >
            Your Profile
          </SectionHeading>
          <DetailHeading className="font-lexend">Contact Number</DetailHeading>
          <DetailText style={{ marginBottom: "2rem" }}>
            +91 9643158060
          </DetailText>
          <FontAwesomeIcon
            icon={faEdit}
            style={{
              fontSize: "1rem",
              marginLeft: "0.5rem",
              color: "#E4E4E4",
              fontWeight: "300",
            }}
            onClick={props.onSetProfilePic}
          />
          <DetailHeading className="font-lexend" style={{ clear: "both" }}>
            Email
          </DetailHeading>
          <DetailText>devansh@thetarzanway.com</DetailText>
          <FontAwesomeIcon
            icon={faEdit}
            style={{
              fontSize: "1rem",
              marginLeft: "0.5rem",
              color: "#E4E4E4",
              fontWeight: "300",
            }}
          />
        </DetailsContainer>
      </OverviewContainer>
      <hr />
      <PreferencesContainer>
        <SectionHeading
          className="font-lexend"
          style={{
            margin: "0 auto 2rem auto",
            textAlign: "center",
            fontWeight: "700",
          }}
        >
          Your Preferences
        </SectionHeading>
        <SlidersContainer>
          <div className="center-div" style={{ textAlign: "right" }}>
            <div>
              Adventure
              <FontAwesomeIcon
                icon={faHiking}
                style={{ marginLeft: "0.5rem", fontSize: "1.5rem" }}
              />{" "}
            </div>
          </div>
          <PrettoSlider
            defaultValue={8}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="on"
            step={1}
            min={0}
            max={10}
          />
          <div adventure className="center-div">
            <div>
              Nature
              <FontAwesomeIcon
                icon={faHiking}
                style={{ marginLeft: "0.5rem", fontSize: "1.5rem" }}
              />
            </div>
          </div>
          <PrettoSlider
            defaultValue={2}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="on"
            step={1}
            min={0}
            max={10}
          />

          <div adventure className="center-div">
            <div>
              Heritage
              <FontAwesomeIcon
                icon={faHiking}
                style={{ marginLeft: "0.5rem", fontSize: "1.5rem" }}
              />{" "}
            </div>
          </div>
          <PrettoSlider
            defaultValue={6}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="on"
            step={1}
            min={0}
            max={10}
          />
          <div adventure className="center-div">
            <div>
              Culture
              <FontAwesomeIcon
                icon={faHiking}
                style={{ marginLeft: "0.5rem", fontSize: "1.5rem" }}
              />{" "}
            </div>
          </div>
          <PrettoSlider
            defaultValue={1}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="on"
            step={1}
            min={0}
            max={10}
          />
          <div adventure className="center-div">
            <div>
              Social
              <FontAwesomeIcon
                icon={faHiking}
                style={{ marginLeft: "0.5rem", fontSize: "1.5rem" }}
              />
            </div>
          </div>
          <PrettoSlider
            defaultValue={9}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="on"
            step={1}
            min={0}
            max={10}
          />

          <div adventure className="center-div">
            <div>
              Other
              <FontAwesomeIcon
                icon={faHiking}
                style={{ marginLeft: "0.5rem", fontSize: "1.5rem" }}
              />
            </div>
          </div>
          <PrettoSlider
            defaultValue={0}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="on"
            step={1}
            min={0}
            max={10}
          />
        </SlidersContainer>
        <Button
          boxShadow
          link={urls.ERROR404}
          margin="auto"
          borderWidth="1px"
          borderRadius="2rem"
          padding="0.5rem 2rem"
        >
          Save
        </Button>
      </PreferencesContainer>
    </Container>
  );
};

const mapStateToPros = (state) => {
  return {
    otpFail: state.auth.otpFail,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onSetProfilePic: (image) => dispatch(authaction.uploadProfilePic(image)),
  };
};
export default connect(mapStateToPros, mapDispatchToProps)(Profile);
