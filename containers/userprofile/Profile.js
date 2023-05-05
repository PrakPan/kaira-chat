import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import img from '../../public/assets/user.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faHiking } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import * as authaction from '../../store/actions/auth';
import Slider from '@mui/material/Slider';

import ImageLoader from '../../components/ImageLoader';
import media from '../../components/media';

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
const ImageNameContainer = styled.div`
  padding: 2rem 0;
  @media screen and (min-width: 768px) {
    padding: 0;
  }
`;
const Profile = (props) => {
  let isPageWide = media('(min-width: 768px)');

  const Name = styled.p`
    font-size: ${(props) => props.theme.fontsizes.mobile.text.two};
    margin: 1rem 0 0 0;
    font-weight: 700;
    @media screen and (min-width: 768px) {
      font-size: ${(props) => props.theme.fontsizes.desktop.text.two};
      margin: 1rem;
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
  const PreferencesContainer = styled.div`
    width: 80%;
    margin: 2rem auto;
  `;
  const SlidersContainer = styled.div`
    display: grid;
    grid-template-columns: max-content auto;
    grid-gap: 1.5rem;
  `;

  return (
    <Container className="border-thin">
      <OverviewContainer>
        <ImageNameContainer className="center-div">
          <ImageLoader
            dimesions={{ width: 400, height: 400 }}
            dimensionsMobile={{ width: 1600, height: 1600 }}
            url={
              props.image !== 'null' && props.image !== null
                ? props.image
                : 'media/website/user.svg'
            }
            width="40%"
            borderRadius="50%"
            widthmobile="40%"
          ></ImageLoader>
          <Name className="font-lexend">{props.name}</Name>
        </ImageNameContainer>
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
        {!isPageWide ? <hr style={{ margin: '0' }} /> : null}
        <DetailsContainer>
          {isPageWide ? (
            <SectionHeading
              className="font-lexend"
              style={{ fontWeight: '700', marginBottom: '2rem' }}
            >
              Your Profile
            </SectionHeading>
          ) : null}
          <DetailHeading className="font-lexend">Contact Number</DetailHeading>
          <DetailText style={{ marginBottom: !isPageWide ? '2rem' : '2rem' }}>
            {props.phone}
          </DetailText>
          {/* <FontAwesomeIcon icon={faEdit} style={{fontSize: "1rem", marginLeft: "0.5rem", color: "#E4E4E4", fontWeight: '300'}} onClick={props.onSetProfilePic} />     */}
          <DetailHeading className="font-lexend" style={{ clear: 'both' }}>
            Email
          </DetailHeading>
          <DetailText style={{ marginBottom: '0' }}>{props.email}</DetailText>
          {/* <FontAwesomeIcon icon={faEdit} style={{fontSize: "1rem", marginLeft: "0.5rem", color: "#E4E4E4", fontWeight: '300'}}/>     */}
        </DetailsContainer>
      </OverviewContainer>
      {/* <PreferencesContainer>
        <SectionHeading className="font-lexend" style={{margin: "0 auto 2rem auto", textAlign: "center", fontWeight: '700'}}>Your Preferences</SectionHeading>
        <SlidersContainer>
               <div className="center-div" style={{textAlign: 'right'}}>
                <div>Adventure
                <FontAwesomeIcon icon={faHiking} style={{marginLeft: "0.5rem", fontSize: '1.5rem'}}/> </div>   
                </div>
                <PrettoSlider defaultValue={8} aria-labelledby="discrete-slider" valueLabelDisplay="on" step={1} min={0} max={10} />
            <div adventure className="center-div">
                <div>Nature
                <FontAwesomeIcon icon={faHiking} style={{marginLeft: "0.5rem", fontSize: '1.5rem'}}/></div>   
            </div>
            <PrettoSlider defaultValue={2} aria-labelledby="discrete-slider" valueLabelDisplay="on" step={1} min={0} max={10} />

            <div adventure className="center-div">
                <div>Heritage
                <FontAwesomeIcon icon={faHiking} style={{marginLeft: "0.5rem", fontSize: '1.5rem'}}/>  </div>  
            </div>
            <PrettoSlider defaultValue={6} aria-labelledby="discrete-slider" valueLabelDisplay="on" step={1} min={0} max={10}/>
            <div adventure className="center-div">
                <div>Culture
                <FontAwesomeIcon icon={faHiking} style={{marginLeft: "0.5rem", fontSize: '1.5rem'}}/>   </div> 
            </div>
            <PrettoSlider defaultValue={1} aria-labelledby="discrete-slider" valueLabelDisplay="on" step={1} min={0} max={10} />
            <div adventure className="center-div">
                <div>Social
                <FontAwesomeIcon icon={faHiking} style={{marginLeft: "0.5rem", fontSize: '1.5rem'}}/></div>  
            </div>
            <PrettoSlider defaultValue={9} aria-labelledby="discrete-slider" valueLabelDisplay="on" step={1} min={0} max={10}/>

            <div adventure className="center-div">
                <div>Other
                <FontAwesomeIcon icon={faHiking} style={{marginLeft: "0.5rem", fontSize: '1.5rem'}}/></div>  
            </div>
            <PrettoSlider defaultValue={0} aria-labelledby="discrete-slider" valueLabelDisplay="on" step={1} min={0} max={10}/>

        </SlidersContainer>
        <Button margin="auto" borderWidth="1px" borderRadius="2rem" padding="0.5rem 2rem">Save</Button>
    </PreferencesContainer> */}
    </Container>
  );
};

const mapStateToPros = (state) => {
  return {
    otpFail: state.auth.otpFail,
    name: state.auth.name,
    phone: state.auth.phone,
    email: state.auth.email,
    image: state.auth.image,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onSetProfilePic: (image) => dispatch(authaction.uploadProfilePic(image)),
  };
};
export default connect(mapStateToPros, mapDispatchToProps)(Profile);
