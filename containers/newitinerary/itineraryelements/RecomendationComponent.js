import React from 'react';
import FoodItem from './FoodItem';
import {
  RecommendationGridContainer,
  TInfoContainer,
  Text,
} from './ItineraryFoodElement';
import { isJson } from '../../../services/isJSON';
import {
  HLine,
  Line,
  Timecontainer,
} from '../../itinerary/New_Itenary_DBD/New_itenaryStyled';
import styled from 'styled-components';
const Container = styled.div`
  display: flex;
  flex-direction: column;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 22px;

  padding: 0px 0px 0px 0px;
  color: #01202b;
`;
const RecomendationComponent = (props) => {
  return props.recomendation ? (
    <Container>
      <Timecontainer>
        {/* <div style={{ width: '3.7rem' }}>{time}</div> */}
      </Timecontainer>
      <TInfoContainer>
        {/* <HLine style={{ width: '2rem' }}></HLine> */}

        <div className={`${!isJson(props.recomendation) ? 'pt-0' : 'pt-4'}`}>
          {props.recomendation ? (
            <div className="pb-3">
              {!isJson(props.recomendation) ? (
                <Text className="text-base font-medium">
                  {props.recomendation}
                </Text>
              ) : (
                <RecommendationGridContainer>
                  {JSON.parse(props.recomendation)?.map((item, index) => (
                    <FoodItem
                      key={index}
                      heading={item.name}
                      text={item.description}
                      ImageUrl={item.image}
                    ></FoodItem>
                  ))}
                </RecommendationGridContainer>
              )}
            </div>
          ) : null}
          <Line></Line>
        </div>
      </TInfoContainer>
    </Container>
  ) : null;
};

export default RecomendationComponent;
