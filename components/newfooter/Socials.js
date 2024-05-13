import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaPinterestP,
} from "react-icons/fa";
import styled from "styled-components";
import Link from "next/link";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  width: 16rem;

  svg {
    font-size: 1.5rem;
  }
`;

const IconContainer = styled(Link)`
  border: 1px solid white;
  border-radius: 100%;
  padding: 7px;
  cursor: pointer;
  text-decoration: none;
  color: white;
  &:hover {
    color: white;
    border: 0px;
    background: ${(props) => (props.hoverbg ? props.hoverbg : "white")};
    border: ${(props) =>
      props.hoverbg ? `1px solid ${props.hoverbg}` : "white"};
  }
`;

const Socials = (props) => {
  return (
    <Container className="font-lexend">
      <IconContainer
        hoverbg={"#1D9BF0"}
        href="https://twitter.com/thetarzanway"
      >
        <FaTwitter />
      </IconContainer>

      <IconContainer
        hoverbg={"#3b5998"}
        href="https://twitter.com/thetarzanway"
      >
        <FaFacebookF />
      </IconContainer>

      <IconContainer
        hoverbg={
          "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285AEB 90%)"
        }
        href="https://www.instagram.com/thetarzanway"
      >
        <FaInstagram />
      </IconContainer>

      <IconContainer
        hoverbg={"#0072b1"}
        href="https://linkedin.com/company/thetarzanway"
      >
        <FaLinkedinIn />
      </IconContainer>

      <IconContainer
        hoverbg={"#E60023"}
        href="https://www.pinterest.com/thetarzanway/"
      >
        <FaPinterestP />
      </IconContainer>
    </Container>
  );
};

export default Socials;
