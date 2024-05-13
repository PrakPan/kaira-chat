import styled from "styled-components";
import NewSearchMobile from "../../../components/search/homepage/mobile/Index";
import NewSearchDesktop from "../../../components/search/homepage/desktop/Index";
import media from "../../../components/media";

const Container = styled.div`
  width: 100%;

  height: max-content;
  text-align: center;

  @media screen and (min-width: 768px) {
    position: asbolute;
  }
`;

const Tagline = styled.h1`
  color: white;
  text-align: center;
  width: 99%;
  font-weight: 800;
  margin: 2rem 0 1rem 0;

  font-size: 2.25rem;
  @media screen and (min-width: 768px) {
    font-size: 5rem;
    margin: 10vh auto 2rem auto;
    font-weight: 700;
  }
`;

const SubText = styled.h3`
  color: white;
  font-weight: 100;
  width: 99%;
  font-size: 1.5rem;
  margin-bottom: 0rem;
  @media screen and (min-width: 768px) {
    font-size: 2rem;
    margin-bottom: 10vh;
  }
`;

const SearchFullImg = (props) => {
  let isPageWide = media("(min-width: 768px)");

  return (
    <Container className="center-dv">
      <div className="hidden-desktop" style={{ width: "100%" }}>
        <NewSearchMobile></NewSearchMobile>
      </div>

      <div className="hidden-mobile" style={{ width: "100%" }}>
        <NewSearchDesktop></NewSearchDesktop>
      </div>

      {props.city ? (
        <SubText
          style={{ margin: isPageWide ? "3rem 0 0 0" : "1rem 0 0.5rem 0" }}
          className="font-nunito"
        >
          {props.text}
        </SubText>
      ) : (
        <Tagline className="font-lexend">{props.tagline}</Tagline>
      )}

      {props.city ? (
        <Tagline style={{ margin: "0" }} className="font-lexend">
          {props.tagline}
        </Tagline>
      ) : (
        <SubText className="font-nunito">{props.text}</SubText>
      )}
    </Container>
  );
};

export default SearchFullImg;
