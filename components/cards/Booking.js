import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImages } from "@fortawesome/free-solid-svg-icons";
import ImageLoader from "../ImageLoader";
import MuiAccordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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

const PhotosButton = styled.div`
  &:hover {
    cursor: pointer;
  }
`;

const Booking = (props) => {
  const detailsarr = [];
  for (var i = 0; i < props.details.length; i++) {
    detailsarr.push(
      <li
        key={props.details[i]}
        className={props.blur ? "blurry-text" : ""}
        style={{ fontSize: "0.75rem", margin: "0.5rem 0", fontWeight: "300" }}
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
                : "media/website/grey.png"
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
                backgroundColor: "white",
                opacity: "0.7",
                borderRadius: "5px",
                position: "absolute",
                right: "0.5rem",
                bottom: "0.5rem",
                padding: "0.5rem",
                fontSize: "0.75rem",
              }}
            >
              <FontAwesomeIcon
                icon={faImages}
                style={{ marginRight: "0.5rem" }}
              ></FontAwesomeIcon>
              All Photos
            </PhotosButton>
          ) : null}
        </ImageContainer>
        <div>
          <MuiAccordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <div>
                <Typography
                  className={
                    props.blur ? "font-lexend blurry-text" : " font-lexend"
                  }
                  style={{ fontSize: "1rem", fontWeight: "600", width: "100%" }}
                >
                  {props.heading}
                </Typography>
                {detailsarr}
              </div>
            </AccordionSummary>
            <AccordionDetails></AccordionDetails>
          </MuiAccordion>
        </div>
      </Container>
    );
  else
    return (
      <Container className="border-thin">
        <ImageContainer>
          <ImageLoader
            blur={props.blur}
            url={
              props.images.length
                ? props.images[0].image
                : "media/website/grey.png"
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
              backgroundColor: "white",
              opacity: "0.7",
              borderRadius: "5px",
              position: "absolute",
              right: "0.5rem",
              bottom: "0.5rem",
              padding: "0.5rem",
              fontSize: "0.75rem",
            }}
          >
            {" "}
            <FontAwesomeIcon
              icon={faImages}
              style={{ marginRight: "0.5rem" }}
            ></FontAwesomeIcon>
            All Photos
          </PhotosButton>
        </ImageContainer>
        <div style={{ padding: "1rem" }}>
          <div>
            <Typography
              className={
                props.blur ? "font-lexend blurry-text" : " font-lexend"
              }
              style={{ fontSize: "1rem", fontWeight: "600", width: "100%" }}
            >
              {props.heading}
            </Typography>
            <p
              style={{
                fontSize: "0.75rem",
                margin: "0.5rem 0",
                fontWeight: "300",
              }}
              className="font-lexend"
            >
              {props.details1}
            </p>
          </div>
          {detailsarr}
        </div>
      </Container>
    );
};

export default Booking;
