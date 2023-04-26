import { ImPinterest2 } from 'react-icons/im';
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaPinterestP,
} from "react-icons/fa";
import styled from 'styled-components';
import { useState, useEffect } from 'react';
 
 const Container = styled.div`
   display: flex;
   justify-content: space-between;
   width: 16rem;

   svg {
     font-size: 1.5rem;
   }
 `;
const IconContainer = styled.div`
  border: 1px solid white;
  border-radius: 100%;
  padding: 7px;
  cursor: pointer;

  &:hover {
    color: white;
    border: 0px;
    background: ${(props) => (props.hoverBg ? props.hoverBg : "white")};
    border: ${(props) =>
      props.hoverBg ? `1px solid ${props.hoverBg}` : "white"};
  }
`;
 

const Socials = (props) => {
   

    return (
      <Container className="font-lexend">
        <IconContainer
          hoverBg={"#1D9BF0"}
          onClick={() =>
            (window.location.href = "https://twitter.com/thetarzanway")
          }
        >
          <FaTwitter />
        </IconContainer>
        <IconContainer
          hoverBg={"#3b5998"}
          onClick={() =>
            (window.location.href = "https://www.facebook.com/thetarzanway/")
          }
        >
          <FaFacebookF />
        </IconContainer>
        <IconContainer
          hoverBg={
            "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285AEB 90%)"
          }
          onClick={() =>
            (window.location.href = "https://www.instagram.com/thetarzanway")
          }
        >
          <FaInstagram />
        </IconContainer>
        <IconContainer
          hoverBg={"#0072b1"}
          onClick={() =>
            (window.location.href = "https://linkedin.com/company/thetarzanway")
          }
        >
          <FaLinkedinIn />
        </IconContainer>
        <IconContainer
          hoverBg={"#E60023"}
          onClick={() =>
            (window.location.href = "https://www.pinterest.com/thetarzanway/")
          }
        >
          <FaPinterestP />
        </IconContainer>
      </Container>
    );
 }

export default Socials;