// import React from 'react';
// import styled from 'styled-components';
// // import media from '../../media';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faChevronLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
// import { TbArrowBack } from 'react-icons/tb';
// const Container = styled.div`
//   margin: 0;
//   display: flex;
//   justify-content: space-between;
//   border : 1px solid red;
//   @media screen and (min-width: 768px) {
//     width: 50vw;
//   }
// `;

// const Section = (props) => {
//   // let isPageWide = media('(min-width: 768px)')

//   return (
//     <Container className="font-lexend">
//       {/* <div></div> */}
//       <FontAwesomeIcon
//         className="hover-pointer"
//         icon={faChevronLeft}
//         onClick={props.setHideTaxiModal}
//         style={{
//           margin: '0.5rem',
//           position: 'sticky',
//           top: '0',
//           visibility: 'hidden',
//         }}
//       ></FontAwesomeIcon>
//       <FontAwesomeIcon
//         className="hover-pointer"
//         icon={faSearch}
//         onClick={props.setHideTaxiModal}
//         style={{
//           margin: '0.5rem',
//           position: 'sticky',
//           top: '0',
//           fontSize: '1.5rem',
//           visibility: 'hidden',
//         }}
//       ></FontAwesomeIcon>
//       <TbArrowBack
//         className="hover-pointer"
//         onClick={props.setHideTaxiModal}
//         style={{ margin: '0.5rem', fontSize: '1.75rem' }}
//       ></TbArrowBack>
//     </Container>
//   );
// };

// export default Section;

import React from "react";
import styled from "styled-components";
import { IoMdClose } from "react-icons/io";
import media from '../../media'
const Container = styled.div`
  margin: 0;
  display: flex;
  gap: 0.5rem;
  align-items : center;
  margin: 1rem;
  @media screen and (min-width: 768px) {
    width : 50vw;

  }
`;
const Text = styled.div`
  font-size: 1.2rem;
  line-height: 2rem;
`;

const Section = (props) => {
  let isPageWide = media("(min-width: 768px)");

  return (
    <Container className=" font-lexend">
      <IoMdClose
        className="hover-pointer"
        onClick={props.setHideTaxiModal}
        style={{ fontSize: "1.5rem" }}
      ></IoMdClose>
      <Text>
        {/* Changing Stays in {props?.booking_city ? props?.booking_city : "City"} */}
        {props.selectedBooking.city &&
        props.selectedBooking.destination_city &&
        isPageWide
          ? "Changing taxi from " +
            props.selectedBooking.city +
            " to " +
            props.selectedBooking.destination_city
          : "Change transfer"}
      </Text>
    </Container>
  );
};

export default Section;
