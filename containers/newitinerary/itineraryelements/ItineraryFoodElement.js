import styled from "styled-components";
import { newDayContainerTextpadding } from "../../itinerary/New_Itenary_DBD/New_itenaryStyled";
import FoodItem from "./FoodItem";
import { isJson } from "../../../services/isJSON";
import { MdRestaurant } from "react-icons/md";

const padding = {
  initialLeft: "8.5rem",
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  font-style: normal;
  font-weight: 400;

  line-height: 22px;

  padding: 0px 0px 0px 0px;
  color: #01202b;
`;

export const Text = styled.p`
  overflow: hidden;
  line-height: 1.5;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  font-size: 14px;
`;

export const RecommendationGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-template-rows: ${(props) =>
    props.Norows > 2 ? "repeat(1, 1fr)" : "auto"};
  grid-column-gap: 20px;
  grid-row-gap: 27px;
  @media screen and (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: ${(props) =>
      props.Norows > 2 ? "repeat(2, 1fr)" : "auto"};
  }
`;

export const TInfoContainer = styled.div`
  @media screen and (min-width: 768px) {
    display: flex;

    flex-direction: row;
    & > div {
      padding-left: ${padding.initialLeft};
      width: 100%;
    }
  }
`;

const ItineraryFoodElement = (props) => {
  return (
    <>
      <Container className="font-lexend pt-3">
        <div className="flex flex-row ">
          <div className="w-[6.15rem] flex flex-col justify-center items-center">
            <div className="w-[6.15rem] grid place-items-center">
              <MdRestaurant className="text-black text-[3.05rem] " />
            </div>
          </div>

          <div
            className="pl-[1.4rem] flex justify-center flex-col"
            style={{ paddingLeft: newDayContainerTextpadding.initialLeft }}
          >
            <div className="text-xl font-normal">{props.heading}</div>
            <div className="pt-1 line-clamp-3 font-normal text-sm pb-4">
              {props.text}
            </div>
          </div>
        </div>

        <TInfoContainer>
          <div>
            <div>
              <div className="text-center"></div>
            </div>

            {props.recomendation ? (
              <>
                <div className="pt-1 line-clamp-3 font-normal text-sm">
                  {props.text}
                </div>
                {!isJson(props.recomendation) ? (
                  `${props.recomendation}`
                ) : (
                  <RecommendationGridContainer
                    Norows={JSON.parse(props.recomendation)?.length}
                  >
                    {JSON.parse(props.recomendation)?.map((item) => (
                      <FoodItem
                        key={item.name}
                        heading={item.name}
                        text={item.description}
                        ImageUrl={item.image}
                      ></FoodItem>
                    ))}
                  </RecommendationGridContainer>
                )}
              </>
            ) : null}
          </div>
        </TInfoContainer>
      </Container>
    </>
  );
};

export default ItineraryFoodElement;
