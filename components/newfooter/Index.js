import styled from 'styled-components';
import ImageLoader from '../ImageLoader';
import Socials from './Socials';
import { FiPhoneCall } from 'react-icons/fi';
import { HiOutlineMail } from 'react-icons/hi';
import Subscribe from './Subscribe';
import Link from 'next/link';
import { useState } from 'react';
import linksArr from './Links';

const Container = styled.div`
  min-height: 10vw;
  background-color: rgb(35, 35, 35);
  padding: 1.5rem 1rem;
  color: white;
  z-index: 1000;
  position: relative;

  @media screen and (min-width: 768px) {
    padding: 9.5rem 0rem 1.5rem 0rem;
  }
  @media screen and (min-width: 1300px) {
    padding: 9.5rem 5rem 1.5rem 5rem;
  }
`;
const SubContainer = styled.div`
  @media screen and (min-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 3fr;
    column-gap: 6%;
    margin: 2% 0% 2% 7%;
  }
`;
const Box = styled.div`
  &.linkContainer {
  }
`;
const LogoContainer = styled.div`
  position: relative;
  .CompanyName {
    position: absolute;
    top: 18px;
    left: 40px;
  }
`;
const CompanyName = styled.div`
  display: flex;
  align-items: flex-end;
  font-size: 16px;
  font-weight: 700;
`;
const CompanyText = styled.div`
  font-size: 14px;
  margin: 1.5rem 0;
`;

const LinksContainer = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  margin: 0;
  @media screen and (min-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    margin-top: 1.5rem;
  }
`;

const CopyWrite = styled.div`
  font-size: 10px;
  margin: 1.5rem 0 0 0;
`;
const Links = styled.div`
  font-size: 14px;
  margin: 0 0 1rem 0;
  a,
  p {
    text-decoration: none;
    color: white;
  }
  a:hover,
  p:hover {
    color: white;
    text-decoration: none;
    cursor: pointer;
    text-underline-offset: 10px;
    text-decoration-thickness: 2px;
  }
`;

const Heading = styled.p`
  font-size: 16px;
  font-weight: 700;

  margin: 2rem 0rem 1rem 0rem;
  @media screen and (min-width: 768px) {
    margin: -0.3rem 0rem 1.85rem 0rem;
  }
`;
const SubscribeBox = styled.div`
  position: relative;
  z-index: 1001;
  height: 23rem;
  padding-bottom: 2rem;
  background: white;
  @media screen and (min-width: 768px) {
    height: 14rem;
  }
`;

const NewFooter = (props) => {
  const [shadow, setShadow] = useState(false);
  const LinksComponent = linksArr.map((e) => (
    <div>
      <Heading>{e.heading}</Heading>
      {e.data.map((data, index) => (
        <Links key={index}>
          {typeof data.link != 'string' ? (
            <a href={data.link[0]}>{data.title}</a>
          ) : data.title == 'Subscribe' ? (
            <p onClick={() => setShadow(!shadow)}>{data.title}</p>
          ) : (
            <a href={'https://thetarzanway.com' + data.link}>{data.title}</a>
          )}
        </Links>
      ))}
    </div>
  ));
  return (
    <>
      <SubscribeBox className="font-lexend" onClick={() => setShadow(false)}>
        <Subscribe shadow={shadow} />
      </SubscribeBox>

      <Container className="font-lexend">
        <SubContainer>
          <Box>
            <LogoContainer>
              <ImageLoader
                dimensions={{ width: 100, height: 100 }}
                dimensionsMobile={{ width: 120, height: 100 }}
                url="media/website/logowhite.svg"
                widthmobile="60px"
                leftalign
                height="50px"
                width="3.5rem"
              ></ImageLoader>
              <CompanyName className="CompanyName">thetarzanway</CompanyName>
            </LogoContainer>
            <CompanyText>
              The Tarzan Way is a travel based startup with the vision to
              simplify travel and build immersive travel programs across India.
            </CompanyText>
            <Socials></Socials>

            <CompanyName style={{ margin: '1rem 0' }}>Contact Us</CompanyName>
            <CompanyText style={{ display: 'flex', margin: '0' }}>
              <div style={{ display: 'flex' }}>
                <FiPhoneCall
                  style={{ fontSize: '1.15rem', marginRight: '0.5rem' }}
                ></FiPhoneCall>
                +91 95821 25476, +91 87872 00342
              </div>
            </CompanyText>
            <CompanyText style={{ display: 'flex', margin: '0.25rem 0 0 0' }}>
              <div style={{ display: 'flex' }}>
                <HiOutlineMail
                  style={{ fontSize: '1.15rem', marginRight: '0.5rem' }}
                ></HiOutlineMail>
                <Links>
                  <a href="mailto:info@thetarzanway.com">
                    info@thetarzanway.com
                  </a>
                </Links>
              </div>
            </CompanyText>
          </Box>
          <LinksContainer>{LinksComponent}</LinksContainer>
        </SubContainer>
        <div
          style={{
            borderBottom: '1px solid rgba(255, 255, 255, 0.5)',
            width: '80%',
            margin: 'auto',
          }}
        ></div>
        <CopyWrite className="text-center">
          Copyright © 2018 - {new Date().getFullYear()} Tarzan Way Travels
          Private Limited ® - All Rights Reserved
        </CopyWrite>
      </Container>
    </>
  );
};

export default NewFooter;
