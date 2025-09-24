import styled from "styled-components";
import { useEffect } from "react";
import ImageLoader from "../../../../components/ImageLoader";
import WeatherWidget from "../../../../components/WeatherWidget/WeatherWidget";
import { FaBed } from "react-icons/fa";

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 0.6fr 1fr;
  grid-gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

export const ITbutton = styled.button`
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px 8px;
  font-weight: 600;
  font-size: 12px;
  background: #ffffff;
  border: 1.5px solid #eceaea;
  box-shadow: 0px 2px 0px #eceaea;
  border-radius: 8px;
`;

const City = (props) => {
  useEffect(() => {}, []);
  function scrollToTargetAdjusted(id) {
    const element = document.getElementById(id);
    const headerOffset = 117;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }

  return (
    <div className=" ">
      <div className="font-bold text-2xl pb-3">
        {props.cityData.city_name + " - " + props.cityData.duration} Nights
      </div>
      <GridContainer>
        <ImageLoader
          borderRadius="8px"
          url={props.cityData.image}
          height={200}
          heightMobile="auto"
          dimensionsMobile={{ width: 180, height: 180 }}
        ></ImageLoader>
        <div>
          <div className="flex flex-row">
            <div className="flex justify-center items-center bg-slate-100 rounded-lg px-3 py-3 mr-2">
              <FaBed />
            </div>

            <div className="flex flex-col">
              <div className="text-xl font-medium">
                Lemon Tree Premium Hotel
              </div>
              <div className="text-xs font-light">
                Nirwan Marg, Bani Park, Jaipur
              </div>
            </div>
          </div>
          <div className="flex flex-col py-2"></div>

          <div>
            <WeatherWidget
              city={props.cityData.city_name}
              lat={props.cityData.lat}
              lon={props.cityData.long}
            />
            <ITbutton onClick={() => scrollToTargetAdjusted(props.dayId)}>
              View {props.cityData.city_name} in your Itinerary
            </ITbutton>
          </div>
        </div>
      </GridContainer>

      <div
        style={{
          border: "1px solid #F0F0F0",
          marginBottom: "0.75rem",
          marginTop: "0.75rem",
        }}
      ></div>
    </div>
  );
};

export default City;
