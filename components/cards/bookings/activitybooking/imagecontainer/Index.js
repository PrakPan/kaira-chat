import React from "react";
import styled from "styled-components";
import ImageLoader from "../../../../ImageLoader";
import Tag from "./Tag";

const Container = styled.div`
  width: 100%;
  border-radius: 10px;
  @media screen and (min-width: 768px) {
    border-radius: 10px;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  position: relative;
  background-image: url("https://d31aoa0ehgvjdi.cloudfront.net/media/website/grey.png");
  min-height: 20vh;
`;

const PhotosButton = styled.div`
  &:hover {
    cursor: pointer;
  }
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border-radius: 2rem;
  position: absolute;
  right: 0.25rem;
  top: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  letterspacing: 1px;
  font-weight: 300;
`;

const EditButton = styled.div`
  &:hover {
    cursor: pointer;
  }
  background-color: rgba(255, 255, 255, 0.8);
  color: black;
  border-radius: 2rem;
  padding: 0.35rem 1.5rem;
  font-size: 0.85rem;
  letterspacing: 1px;
  font-weight: 400;
`;

const Booking = (props) => {
  const detailsarr = [];

  if (props.details)
    for (var i = 0; i < props.details.length; i++) {
      detailsarr.push(
        <li
          className={props.blur ? "blurry-text" : ""}
          style={{ fontSize: "0.75rem", margin: "0.5rem 0", fontWeight: "300" }}
        >
          {props.details[i]}
        </li>
      );
    }

  let imagesarr = [];
  if (props.images)
    for (var i = 0; i < props.images.length; i++) {
      imagesarr.push(props.images[i].image);
    }

  return (
    <Container className="">
      <ImageContainer>
        <div style={{ minHeight: "20vh" }}>
          <ImageLoader
            borderRadius="10px 10px 0 0"
            fit="cover"
            url={
              props.images
                ? props.images.length
                  ? props.images[0].image
                  : "media/website/grey.png"
                : "media/website/grey.png"
            }
            height="25vh"
            width="100%"
          ></ImageLoader>
        </div>
        {props.images ? (
          props.images.length ? (
            <PhotosButton
              onClick={() => props._setImagesHandler(imagesarr)}
              className=""
            >
              All Photos
            </PhotosButton>
          ) : null
        ) : null}

        <div
          style={{
            position: "absolute",
            bottom: "0.25rem",
            right: "0.25rem",
            display: "flex",
          }}
        >
          <EditButton className="" style={{ marginRight: "0.5rem" }}>
            Activity
          </EditButton>
          {props.star_category ? (
            <EditButton className="">
              {props.star_category + " star"}
            </EditButton>
          ) : null}
        </div>
        {props.tag ? (
          <Tag star_category={props.star_category} tag={props.tag}></Tag>
        ) : null}
      </ImageContainer>
    </Container>
  );
};

export default Booking;
