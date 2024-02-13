import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import media from "../../../components/media";
import WeatherWidget from "../../../components/WeatherWidget/WeatherWidget";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
const Container = styled.div`
  margin-top: 30px;

  @media screen and (min-width: 768px) {
    display: grid;
    grid-template-columns: 3fr 1.1fr;
    gap: 2rem;
  }
`;
const P = styled.div`
  font-weight: 300;
  text-align: left;
  line-height: 30px;
  position: relative;
  // ${(props) => `height : ${props.clientHeight}px`};
  // max-height : none;
  // ${(props) => !props.more && "overflow : hidden ; height: 201px"};
  transition: height 0.3s ease;

  @media screen and (min-width: 768px) {
    font-size: 18px;
  }
`;
const TextBold = styled.p`
  line-height: 24px;
  font-weight: 600;
  margin: 0;
  color: rgb(1, 32, 43);
`;

const WeatherContainer = styled.div`
  border: 1px solid #eceaea;
  border-radius: 10px;
  padding: 25px;
  height: max-content;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: white;
  margin-top: 1rem;
  @media screen and (min-width: 768px) {
    margin-top: 0rem;
  }
`;

const Brief = (props) => {
  const isPageWide = media("(min-width: 768px)");
  const [more, setMore] = useState(false);
  const [clientHeight, setClientHeight] = useState(false);
  const ref = useRef();

  //  useEffect(() => {
  //    setClientHeight(ref.current.offsetHeight);
  //  }, [isPageWide]);

  return (
    <Container>
      <P more={more} clientHeight={clientHeight}>
        <span ref={ref}>
          {more
            ? props.short_description
            : props.short_description.slice(0, 800)}
        </span>
        {props.short_description.length > 800 && (
          <span
            className="hover-pointer text-container font-[600] text-gray-500 ml-1"
            onClick={() => setMore(!more)}
            // style={{
            //   position: "absolute",
            //   right: "0",
            //   bottom: "-8px",
            //   marginBottom: "0px",
            //   backgroundColor: "white",
            //   zIndex: "2",
            //   paddingLeft: "0.25rem",
            //   fontWeight: "600",
            // }}
          >
            {!more ? (
              <>
                ...more
                <BiChevronDown
                  style={{
                    display: "inline",
                    fontSize: "1.2rem",
                    marginBottom: "0.2rem",
                  }}
                ></BiChevronDown>
              </>
            ) : (
              <>
                ...less
                <BiChevronUp
                  style={{
                    display: "inline",
                    fontSize: "1.2rem",
                    marginBottom: "0.2rem",
                  }}
                ></BiChevronUp>
              </>
            )}
          </span>
        )}
      </P>
      <WeatherContainer elevation={props.elevation}>
        <WeatherWidget city={props.name} lat={props.lat} lon={props.lon} />
        {props.elevation && (
          <div>
            <TextBold>Altitude</TextBold>
            <p style={{ fontWeight: "300", marginBottom: "0" }}>
              {Math.floor(props.elevation)} metres (
              {Math.floor(props.elevation * 3.281)} feet) above sea level
            </p>
          </div>
        )}
      </WeatherContainer>
    </Container>
  );
};

export default Brief;
