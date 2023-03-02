import React from 'react';
import {Modal} from 'react-bootstrap';
import Heading from '../heading/Heading';
import styled from 'styled-components';
// import TailoredFrom from '../tailoredform/Index';
// import ImageLoader from '../ImageLoader';

const P = styled.p`
    font-weight: 300;
    font-size: 1.25rem;
    width: 90%;
    text-align: center;
    margin: 1rem auto;
    @media screen and (min-width: 768px) {
        width: 80%;
    }
`
const TailoredModal = (props) => {
  return(
      <div>

        <Modal show={props.show} size="lg" onHide={props.hide} className="" >
            <Modal.Body className="">
                {/* <TailoredFrom></TailoredFrom> */}
                {props.children}
            </Modal.Body>
      </Modal>
      </div>
  );

}

export default TailoredModal;