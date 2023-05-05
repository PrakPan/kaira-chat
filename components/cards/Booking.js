import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarker,
  faStar,
  faImages,
} from '@fortawesome/free-solid-svg-icons';

import ImageLoader from '../ImageLoader';
import { makeStyles } from '@mui/styles';
import { Accordion } from '@mui/material';
import { AccordionSummary } from '@mui/material';
import { AccordionDetails } from '@mui/material';
import { Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { withStyles } from '@mui/styles';

const Container = styled.div`
  width: 100%;

  border-radius: 10px;
  @media screen and (min-width: 768px) {
    border-radius: 0;
  }
`;
const ImageContainer = styled.div`
  width: 100%;
  position: relative;
`;

const DetailsContainer = styled.div`
  color: black;
  display: grid;
  grid-template-columns: auto max-content;
  padding: 0 0.5rem;
`;
const DetailsLeftContainer = styled.div``;
const DetailsRightContainer = styled.div`
  text-align: right;
`;
const Rating = styled.div`
  text-align: right;
`;
const IconsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  color: black;
`;
const Icon = styled.img`
  width: 40%;
  height: auto;
  display: block;
  margin: 0.5rem auto;
`;
const PhotosButton = styled.div`
  &:hover {
    cursor: pointer;
  }
`;

const Booking = (props) => {
  const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
  }));
  const classes = useStyles();

  const Accordion = withStyles({
    root: {},
    content: {},
    expanded: {},
  })(MuiAccordion);
  const detailsarr = [];
  for (var i = 0; i < props.details.length; i++) {
    detailsarr.push(
      <li
        key={props.details[i]}
        className={props.blur ? 'blurry-text' : ''}
        style={{ fontSize: '0.75rem', margin: '0.5rem 0', fontWeight: '300' }}
      >
        {props.details[i]}
      </li>
    );
  }

  let imagesarr = [];

  for (var i = 0; i < props.images.length; i++) {
    imagesarr.push(props.images[i].image);
  }
  if (window.innerWidth >= 768)
    return (
      <Container className="">
        <ImageContainer>
          <ImageLoader
            fit="cover"
            url={
              props.images.length
                ? props.images[0].image
                : 'media/website/grey.png'
            }
            dimensions={{ width: 1600, height: 900 }}
            dimensionsMobile={{ width: 1600, height: 900 }}
            width="100%"
          ></ImageLoader>
          {props.images.length ? (
            <PhotosButton
              onClick={() => props.setImagesHandler(imagesarr)}
              className="font-lexend"
              style={{
                backgroundColor: 'white',
                opacity: '0.7',
                borderRadius: '5px',
                position: 'absolute',
                right: '0.5rem',
                bottom: '0.5rem',
                padding: '0.5rem',
                fontSize: '0.75rem',
              }}
            >
              <FontAwesomeIcon
                icon={faImages}
                style={{ marginRight: '0.5rem' }}
              ></FontAwesomeIcon>
              All Photos
            </PhotosButton>
          ) : null}
        </ImageContainer>
        <div>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <div>
                <Typography
                  className={
                    props.blur
                      ? classes.heading + 'font-lexend blurry-text'
                      : classes.heading + ' font-lexend'
                  }
                >
                  {props.heading}
                </Typography>
                {detailsarr}
              </div>
            </AccordionSummary>
            <AccordionDetails></AccordionDetails>
          </Accordion>
        </div>
      </Container>
    );
  else
    return (
      <Container className="border-thin">
        <ImageContainer>
          {/* <ImageLoader fit="cover" url={props.images[0].image} dimensions={{width: 1600, height: 900}} dimensionsMobile={{width: 1600, height: 900}} widthmobile="100%" height="20vh" ></ImageLoader> */}
          <ImageLoader
            blur={props.blur}
            url={
              props.images.length
                ? props.images[0].image
                : 'media/website/grey.png'
            }
            dimensionsMobile={{ width: 1600, height: 900 }}
            fit="cover"
            width="100%"
            height="25vh"
          />
          <PhotosButton
            onClick={() => props.setImagesHandler(imagesarr)}
            className="font-lexend"
            style={{
              backgroundColor: 'white',
              opacity: '0.7',
              borderRadius: '5px',
              position: 'absolute',
              right: '0.5rem',
              bottom: '0.5rem',
              padding: '0.5rem',
              fontSize: '0.75rem',
            }}
          >
            {' '}
            <FontAwesomeIcon
              icon={faImages}
              style={{ marginRight: '0.5rem' }}
            ></FontAwesomeIcon>
            All Photos
          </PhotosButton>
        </ImageContainer>
        <div style={{ padding: '1rem' }}>
          <div>
            <Typography
              className={
                props.blur
                  ? classes.heading + 'font-lexend blurry-text'
                  : classes.heading + ' font-lexend'
              }
            >
              {props.heading}
            </Typography>
            <p
              style={{
                fontSize: '0.75rem',
                margin: '0.5rem 0',
                fontWeight: '300',
              }}
              className="font-lexend"
            >
              {props.details1}
            </p>
          </div>
          {detailsarr}
          {/* <IconsContainer>
                        <div>
                            <Icon src={icon} style={{width: "25%"}}></Icon>
                            <p className="font-nunito" style={{textAlign: "center", fontSize: "0.75rem", margin: "0"}}>Breakfast</p>
                        </div>
                        <div>
                            <Icon src={icon2}  style={{width: "25%"}}></Icon>
                            <p className="font-nunito" style={{textAlign: "center",  fontSize: "0.75rem", margin: "0"}}>Toiletries</p></div>
                        <div>
                            <Icon src={icon3} style={{width: "25%"}}></Icon>
                            <p className="font-nunito" style={{textAlign: "center",  fontSize: "0.75rem", margin: "0"}}>Free Wifi</p>
                        </div>
                        
                        
                    </IconsContainer> */}
        </div>
      </Container>
    );
};

export default Booking;
