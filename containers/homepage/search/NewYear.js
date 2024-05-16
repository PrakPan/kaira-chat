import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  @media screen and (min-width: 768px) {
    position: relative;
  }
`;

const ContentContainer = styled.div`
  margin: 5vw 1rem 0 5vw;
  @media screen and (min-width: 768px) {
    margin: 10vh 20vh;
  }
`;

const Tagline = styled.h1`
  color: white;
  font-weight: 800;
  text-align: right;
  margin: 0rem 0 0.5rem 0;
  font-size: 2rem;
  @media screen and (min-width: 768px) {
    font-size: 3.5rem;
    margin: 0 auto 1rem auto;
    font-weight: 700;
    width: 100%;
  }
`;

const SubText = styled.h3`
  color: white;
  text-align: right;
  font-weight: 100;
  width: 99%;
  line-height: 1;
  font-size: 1.5rem;
  margin-bottom: 0rem;
  @media screen and (min-width: 768px) {
    font-size: 2.25rem;
    margin-bottom: 0;
    line-height: normal;
  }
`;

const SearchFullImg = (props) => {
  return (
    <Container className="center-dv">
      <ContentContainer>
        <Tagline className="font-lexend">{props.tagline}</Tagline>

        <SubText className="font-lexend">{props.text}</SubText>
      </ContentContainer>
    </Container>
  );
};

export default SearchFullImg;
