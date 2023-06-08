import React, { useState } from 'react';
import styled from 'styled-components';
import Info from './Info';
import Gallery from './gallery/Index';
import Buttons from './Buttons';
import AccommodationModal from '../../accommodation/Index';

const Container = styled.div`
  margin: 0 0 1rem 0;
  border-radius: 10px !important;
  @media screen and (min-width: 768px) {
    padding: 0.5rem;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: max-content auto;

  @media screen and (min-width: 768px) {
  }
`;

const ImageContainer = styled.div`
  padding: 0 0.5rem;
  border-style: none solid none none;
  border-color: rgba(175, 164, 164, 0.4);
  border-width: 1px;
  margin: 0.5rem 0;
`;

const Accommodation = (props) => {
  //   if(!showPhotos)
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Container className="border">
      <GridContainer>
        <ImageContainer className="center-di">
          <Gallery
            setShowDetails={() => setShowDetails(true)}
            images={props.selectedBooking.images}
          ></Gallery>
        </ImageContainer>
        <Info
          setShowDetails={() => setShowDetails(true)}
          rating={4.2}
          selectedBooking={props.selectedBooking}
        />
      </GridContainer>
      <AccommodationModal
        _setImagesHandler={props._setImagesHandler}
        onHide={() => setShowDetails(false)}
        id={props.selectedBooking.accommodation}
        show={showDetails}
      ></AccommodationModal>

      <Buttons setShowDetails={() => setShowDetails(true)}></Buttons>
    </Container>
  );
  //   else return(
  //       <FullScreenGallery images={images} closeGalleryHandler={closePhotosHandler}></FullScreenGallery>
  //   )
};

export default Accommodation;
