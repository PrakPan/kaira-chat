import React from 'react';
import styled from 'styled-components';
// import media from '../../media';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import { IoMdClose } from 'react-icons/io';
const Container = styled.div`
  margin: 0;
  display: flex;

  @media screen and (min-width: 768px) {
  }
`;

const Section = (props) => {
  // let isPageWide = media('(min-width: 768px)')

  return (
    <Container className=" font-lexend line-clamp-1  px-3 flex flex-row gap-2 justify-start mt-3 items-center">
      {/* <div></div> */}
      {/* <FontAwesomeIcon
        className="hover-pointer"
        icon={faChevronLeft}
        onClick={props.setHideBookingModal}
        style={{
          margin: '0.5rem',
          position: 'sticky',
          top: '0',
          visibility: 'hidden',
        }}
      ></FontAwesomeIcon>
      <FontAwesomeIcon
        className="hover-pointer"
        icon={faSearch}
        onClick={props.setHideBookingModal}
        style={{
          margin: '0.5rem',
          position: 'sticky',
          top: '0',
          fontSize: '1.5rem',
          visibility: 'hidden',
        }}
      ></FontAwesomeIcon> */}
      <IoMdClose
        className="hover-pointer"
        onClick={props.setHideBookingModal}
        style={{ fontSize: '2rem' }}
      ></IoMdClose>
      <div className="text-2xl font-normal ">
        Changing Stays in {props?.booking_city ? props?.booking_city : 'City'}
      </div>
    </Container>
  );
};

export default Section;
