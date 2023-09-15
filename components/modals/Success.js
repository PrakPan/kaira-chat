import React from 'react';
import {Modal} from 'react-bootstrap';
import Heading from '../heading/Heading';
import styled from 'styled-components';
import ImageLoader from '../ImageLoader';
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
const PersonaliseModal = (props) => {
  return(
      <div>
        <Modal show={props.show} size="lg" onHide={props.hide} className="" >
            <Modal.Body className="">
                <Heading align="center" margin="2rem auto 2rem auto" bold>Thank you for contacting us.</Heading>
                <ImageLoader url={'media/website/success.gif'} width="60%" widthmobile="90%" margin="4rem auto"></ImageLoader>
                <P>Your inquiry is noted! We will get in touch with you within 12 hours.
                </P>
                <P>You can also reach out to us immediately <a href="https://wa.me/919625509382?text=Hi%20The%20Tarzan%20Way!%20I%27d%20like%20to%20ask%20you%20something%20" style={{color: "blue"}}> here</a></P>
            </Modal.Body>
      </Modal>
      </div>
  );
}
export default PersonaliseModal;