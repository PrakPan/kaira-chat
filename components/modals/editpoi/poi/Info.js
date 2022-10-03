import React, {useRef, useEffect, useState} from 'react';
import styled from 'styled-components';
import media from '../../../media';

import Button from '../../../Button';
import {BsInfoCircle} from 'react-icons/bs'
import {BiTimeFive} from 'react-icons/bi'
const Container = styled.div`
    position: relative;
    padding: 0 0.5rem 3rem 0.5rem;
`;
const Name = styled.div`
    font-size: 1rem;
    font-weight: 700;
    display: inline;
    line-height: 1;

`;
 
const RightBottomContainer = styled.div`
    position: absolute;
    right: 0;
    bottom: 0.5rem;
    display: flex;
    
`;
const Cost = styled.div`
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0.5rem 0 0;
    line-height: 1;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
&:after{
    content: "per night";
        display: block;
        font-size: 0.75rem;
        font-weight: 300;
}

`;
 
 
const TagsContainer = styled.div`
    display: flex;
    margin: 0 0 2rem 0;
`;
const Tag = styled.div`
    padding: 0.15rem 1rem;
    border-radius: 2rem !important;
    margin-right: 0.5rem;
    font-size: 0.75rem;
`;
const Description = styled.p`
 
font-weight: 300;
margin : 0;
@media screen and (min-width: 768px){

}
`;
const StyledInfoIcon=styled(BsInfoCircle)`
    margin-left: 0.25rem;
    &:hover{
        cursor: pointer;
    }
`;

 
const GridContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin: 0.5rem 0 1rem 0;
    @media screen and (min-width: 768px){
        width: 60%;
    }

`;
const StyledTimeIcon = styled(BiTimeFive)`
    &:hover{
        cursor: pointer;
    }
`;
const IconContainer = styled.div`
font-weight: 300;

`;
 
const Accommodation = (props) => {
   let isPageWide = media('(min-width: 768px)')

  return(
      <Container className=''>
        <div style={{display: 'flex', alignItems: 'center', marginBottom: '1rem'}}>
            <Name className='font-opensans'>
             {props.heading}
            </Name>
            <StyledInfoIcon  onClick={() => props._openPoiModal(props.data.activity_data.poi)} ></StyledInfoIcon>
            {/* <Star src={star} style={{marginLeft: '0.25rem'}}></Star>
            <Star src={star} style={{marginLeft: '0.25rem'}}></Star>
            <Star src={star} style={{marginLeft: '0.25rem'}}></Star> */}

        </div>
        {/* <TagsContainer>
                <Tag className='border'>
                    <FontAwesomeIcon icon={faStar} style={{marginRight: '0.25rem'}}></FontAwesomeIcon>
                    {props.star+" star"}
                </Tag>
                <Tag className='border'>
                    <FontAwesomeIcon icon={faHome} style={{marginRight: '0.25rem'}}></FontAwesomeIcon>
                    {props.type}
                </Tag>
        </TagsContainer> */}
        {props.text ? <Description className='font-opensans' onClick={() => props._openPoiModal(props.data.activity_data.poi)}>
         
            {isPageWide && props.text.length? props.text.substring(0,250)+"...": props.text.substring(0,80)+"..."}
            
            </Description> : null}
        {/* <GridContainer>
                <IconContainer >
                    <StyledTimeIcon></StyledTimeIcon>
                    <p className='font-opensans' style={{margin: '0'}}>2 hours</p>
                </IconContainer>
                <IconContainer >
                    <StyledTimeIcon></StyledTimeIcon>
                    <p className='font-opensans' style={{margin: '0'}}>2 hours</p>

                </IconContainer>

            </GridContainer> */}
        <RightBottomContainer>
        {/* <Cost className='font-opensans'>{ "₹ "+getIndianPrice(props.cost)+" /-"  }</Cost> */}

            <Button
             onclick={props._updatePoiHandler}
                onclickparam={props.data}
            borderRadius="2rem" padding="0.25rem 1rem" borderWidth="0" bgColor="#f7e700" hoverColor="white" hoverBgColor="black">Select</Button>
        </RightBottomContainer>
        
      </Container>
  );
  

}
 
export default Accommodation;