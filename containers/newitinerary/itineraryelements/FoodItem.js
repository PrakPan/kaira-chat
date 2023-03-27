import styled from 'styled-components';
import { useState, useEffect } from 'react';
import {AiFillStar} from 'react-icons/ai'
import ImageLoader from '../../../components/ImageLoader';
     const Container = styled.div`
     display: grid;
     grid-template-columns: 1fr 2.5fr;
     grid-gap: 0.75rem;
         @media screen and (min-width: 768px){
 
    }
`;
const Heading = styled.p`
font-weight: 500;
margin-bottom: 2px;
`;
const Text = styled.p`
    font-size: 14px;
`;
 
const FoodItem = (props) => {
    
   
    useEffect(() => {   
      
    },[]);
    
    return(

        <Container margin={props.margin}>
                             <ImageLoader  dimensions={{width: 200, height: 200}} dimensionsMobile={{width: 200, height: 200}} borderRadius="8px"  hoverpointer  onclick={() =>  console.log('')} width="80%" leftalign widthmobile="100%" url={props.ImageUrl} ></ImageLoader>
                            <div>
                                <Heading>{props.heading}</Heading>
                                <Text>{props.text}</Text>
                                
                            </div>
        </Container>
        
    );
 }

export default FoodItem;