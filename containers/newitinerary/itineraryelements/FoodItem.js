import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { AiFillStar } from 'react-icons/ai';
import ImageLoader from '../../../components/ImageLoader';
import { cutSentence } from '../../../helper/cutSentence';
const Container = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 2.5fr;
  grid-gap: 0.75rem;
  @media screen and (min-width: 768px) {
  }
`;
const Heading = styled.p`
  margin-bottom: 2px;
`;
const Text = styled.p`
  font-size: 14px;
`;

const FoodItem = (props) => {
  useEffect(() => {}, []);

  return (
    <Container margin={props.margin}>
      <ImageLoader
        dimensions={{ width: 150, height: 150 }}
        dimensionsMobile={{ width: 100, height: 100 }}
        borderRadius="8px"
        hoverpointer
        onclick={() => console.log('')}
        width="100%"
        leftalign
        widthmobile="100%"
        url={props.ImageUrl}
      ></ImageLoader>
      <div>
        <Heading className="font-normal text-lg lg:text-xl">
          {props.heading}
        </Heading>
        <div className="pt-1 text-sm font-normal line-clamp-3  ">
          {cutSentence(props.text, 18)}
        </div>
      </div>
    </Container>
  );
};

export default FoodItem;
