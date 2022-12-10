import React from 'react';
import styled from 'styled-components'
import Poi from './poirecommendation/Index'
import ImageLoader from '../../ImageLoader';
import {FaRegEdit} from 'react-icons/fa';
import {BsInfoCircle} from 'react-icons/bs'
import Food from './Food';

import Notes from './Notes'
import { ITINERARY_ELEMENT_TYPES } from '../../../services/constants';
const Container = styled.div`
width: 100%;
margin: auto auto 1rem auto;
display: grid;
grid-template-columns: 1fr 4fr;
grid-gap: 1rem;
color: black !important;
box-sizing: border-box;

background-image:none !important; 
@keyframes fade {
    0%{background-color: #f7e700;}
    100%{background-color:white;}
     
  
  }

`;
const Name = styled.p`
font-size: ${props => props.theme.fontsizes.mobile.text.default};
font-weight: 700;
margin-bottom : 0.25rem;
margin-top: 0;
@media screen and (min-width: 768px){
    font-size: ${props => props.theme.fontsizes.desktop.text.three};

}

`;
const Description = styled.p`
font-size: 0.85rem;
font-weight: 100;
margin : 0.25rem 0;
@media screen and (min-width: 768px){
    font-size: 0.85rem;
}
`;
const Icon = styled.img`
width: 40%;
margin: auto;
`;

const StyledEditIcon = styled(FaRegEdit)`
    color: hsl(0,0%,70%);
    &:hover{
        cursor: pointer;
        color: black;
    }
    margin-left: 0.75rem;
 `;
const StyledDetailIcon=styled(BsInfoCircle)`
&:hover{
    cursor: pointer;

}
margin-left: 0.75rem;
`;
const Element = (props) =>{
     return(
        <div style={{margin: "2rem 0"}}>
        <Container props={props} style={{ backgroundColor:  'white'}}>
        {props.type === "image" ? <ImageLoader blur={props.blur} url={props.image} dimensions={{width: 400, height: 400}} width="80%" widthMobile="100%" borderRadius="50%"></ImageLoader> : <ImageLoader  url={props.image} dimensions={{width: 400, height: 400}} widthMobile="100%" width="40%" blur={props.blur}></ImageLoader>}
            <div>
                
                    <Name className={props.blur ? "font-opensans blurry-text" : "font-opensans"}>{props.name}
                    {/* {props.element_type === ITINERARY_ELEMENT_TYPES.activity ?  <StyledDetailIcon onClick={props.setShowPoiModal}></StyledDetailIcon> : null} */}
                    {props.element_type === ITINERARY_ELEMENT_TYPES.activity && props.enablepoiedit && !props.is_stock && !props.is_experience && !props.is_preview && !props.traveleritinerary && props.is_auth && !props.is_registration_needed ?  <StyledEditIcon  onClick={() => props.setShowPoiModal({name: props.poi_name, city_id: props.city_id, day_slab_index: props.day_slab_index, slab_element_index: props.slab_element_index, element_index: props.element_index})}></StyledEditIcon> : null}
                    </Name>
                      
                {props.text && !props.is_food && !props.is_poi_rec? <Description className={props.blur ? "font-opensans blurry-text" : "font-opensans"}>{props.text}</Description> : null}
                {props.is_food ? <Food text={props.text}></Food> : null}
                {props.meta   ? <Notes blur={props.blur} meta={props.meta} transfer={props.element_type === ITINERARY_ELEMENT_TYPES.transfer}></Notes> : null}
                {props.is_poi_rec ? <Poi text={props.text}></Poi> : null}
                {props.activity_data ? props.activity_data.poi ? props.activity_data.poi.tips ?  props.activity_data.poi.tips.length ? 
                 <div className='font-opensans' style={{fontSize: '0.75rem', margin: '0.5rem 0'}}>
                    <div style={{fontWeight: '600'}}>Tips & Tricks</div>
                    <ul>
                        <li style={{fontWeight: '300'}}>{props.activity_data.poi.tips[0]}</li>
                        {props.activity_data.poi.tips.length > 1 ? <li style={{fontWeight: '300'}}>{props.activity_data.poi.tips[1]}</li> : null}

                        </ul>
                </div>
                   : null: null : null : null}
            </div>
        </Container>
        </div>
    );
}

export default Element;