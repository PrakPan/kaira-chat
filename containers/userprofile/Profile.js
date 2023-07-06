import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import * as authaction from '../../store/actions/auth';
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
        <ImageNameContainer className="center-div">
          <ImageLoader
            dimesions={{ width: 1600, height: 1600 }}
            dimensionsMobile={{ width: 1600, height: 1600 }}
            url={
              props.image !== 'null' && props.image !== null
                ? props.image
                : 'media/website/user.svg'
            }
            width="40%"
            borderRadius="50%"
            widthmobile="40%"
            noPlaceholder={true}
          ></ImageLoader>
          <Name className="font-lexend">{props.name}</Name>
        </ImageNameContainer>
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
          <DetailHeading className="font-lexend" style={{ clear: 'both' }}>
            Email
          </DetailHeading>
          <DetailText style={{ marginBottom: '0' }}>{props.email}</DetailText>
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
