import styled from "styled-components";

const ExperienceIndexLoading = (props) => {
  const Container = styled.div`
    width: 100%;
    background-color: ${(props) => props.theme.colors.brandColor};
  `;

  const InnerContainer = styled.div`
    width: ${props.mobileWidth};
    margin: auto;
    background-color: white;
    @media screen and (min-width: 768px) {
      width: ${props.desktopWidth};
    }
  `;

  return (
    <Container>
      <InnerContainer>{props.children}</InnerContainer>
    </Container>
  );
};

export default ExperienceIndexLoading;
