import styled from 'styled-components';
import { useState, useEffect } from 'react';
import {AiFillCar} from 'react-icons/ai';
import ImageLoader from '../../../components/ImageLoader';
import Button from '../../../components/ui/button/Index';
import { ITINERARY_ELEMENT_TYPES } from '../../../services/constants';
import {HiPencil} from 'react-icons/hi';
import Rating from './Rating';
import Tips from './Tips';

   const Container = styled.div`
   padding: 0.5rem;
   
    @media screen and (min-width: 768px){
 
    }
`;
 
 const SectionOneText = styled.span`
    
 `;
 const GridContainer = styled.div`
    display: grid;
    margin-top: 1rem;
    grid-template-columns: ${(props) => (props.image ? '1fr 2fr' : '1fr')};
    grid-column-gap: 0.5rem;
 `;
 const Text = styled.p`
 
 overflow: hidden;
 line-height: 1.5;
text-overflow: ellipsis;
display: -webkit-box;
-webkit-line-clamp: 3;
-webkit-box-orient: vertical;
font-size: 14px;
 
 `
 const Heading = styled.span`
    margin-bottom: 0rem;
    margin-right: 0.25rem;
    font-weight: 500;
    line-height: 1;
 `;
 const Line= styled.div`
 border-style: none none solid none;
   border-color: #e4e4e4;
   border-width: 1px;
 `;
 const BoldTags = styled.p`
    font-weight: 600;
    font-size: 14px;
    margin-bottom: 0.25rem;
 `;

 const ColorTags = styled.span`
    border-style: solid;
    border-radius: 6px;
    font-size: 12px;
    line-height: 1;
    letter-spacing: 1px;
    
    font-weight: 400;
    padding: 0.25rem 0.5rem;

 `
const ItineraryPoiElementM = (props) => {
    
   
    useEffect(() => {   
      
    },[]);
    
    return(

        <Container
     
        className='font-poppins'>
            <div style={{display: 'flex', alignItems: 'center'}}>
                <SectionOneText>{props.time}</SectionOneText>
                <AiFillCar style={{margin: '-2px 0  0 0.5rem'}}></AiFillCar>
                {
                    props.booking ? 
                    <div style={{flexGrow: '1', justifyContent: 'flex-end', display: 'flex'}}>
                        
                        <Button
                        borderRadius="8px"
                        fontWeight="700"
                        fontSize="12px"
                        borderWidth="1.5px"
                        padding="0.5rem 0.5rem"
                        onclick={() => console.log('')}
                        >
                        View Booking
                        </Button>
                        </div>
                    : null
                }
            </div>
            <GridContainer image={props.image}>
                {props.image ? 
                   <ImageLoader  dimensions={{width: 250, height: 200}} dimensionsMobile={{width: 250, height: 200}} borderRadius="8px"  hoverpointer  onclick={() =>  console.log('')} width="70%" leftalign widthmobile="100%" url={props.image} ></ImageLoader>
                : 
                null
                }
                <div>
                    <div className="display-flex" style={{lineHeight: '1'}}>
                    <Heading>{props.heading}</Heading>
                    <HiPencil></HiPencil>
                    </div>
                    <Rating margin="0.25rem 0"></Rating>
                    <BoldTags>Heritage • Culture</BoldTags>
                    <div style={{display: 'flex', gap: '0.5rem', marginBottom: '0.5rem'}}>
                    <ColorTags style={{color:'#9C54F6'}}>HIDDEN GEM</ColorTags>
                    <ColorTags style={{color: '#5363F5'}}>ATTRACTION</ColorTags>

                    </div>

                </div>
            </GridContainer>
            <Text>{props.text}</Text>
             { props.tipa ? <Tips tips={props.tips}></Tips> :
                null
             }
                

<Line></Line>
         </Container>
        
    );
 }

export default ItineraryPoiElementM;