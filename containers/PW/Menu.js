import React, { useState } from 'react';
import styled from 'styled-components'
import { useRouter } from 'next/router';
import ImageLoader from '../../components/ImageLoader';
import {IoCheckboxOutline} from 'react-icons/io5';
import {IoMdSquareOutline} from 'react-icons/io'; 
import Spinner from '../../components/Spinner';
import urls from '../../services/urls';
import Terms from '../../components/modals/terms/PW';
const Container = styled.div`
position: sticky;
top: 0;
padding: 0.5rem;
 display: flex;
 align-items: center;
background-color: black;
z-index: 1000;
height: 66px;

@media screen and (min-width: 768px){

}
   `;

const DropDown = styled.div`
    background-color: #f7e700;
    border-radius: 5px;
    padding: 6px 10px;
    font-weight: 600;
    color: black;
`;
const FiltersContainer = styled.div`
display: flex;
 gap: 0.5rem;
  marginLeft: 1rem;
height: max-content;
 maxWidth: 100vw;  
`;

const FilterText = styled.div`
    margin-right: 4px;
    font-size: 10px;
    text-align: center;
    @media screen and (min-width: 768px){
        font-size: 1rem;

    }
`;
const FilterContainer = styled.div`
display: flex;
fontSize: 13px;
align-items: center;
font-weight: 700;
 padding: 0.25rem;
  border-radius: 5px;
  border-width: 1px;
   border-style: solid;
   background-color: #f7e700;
   border-color: #f7e700;
   height: max-content;
   @media screen and (min-width: 768px){
    height: auto;

   }
 `;

 const SetWidthContainer = styled.div`
 display: grid;
 width: 100%;
grid-template-columns: auto max-content;
 @media screen and (min-width: 768px){
    width: 90vw;
    margin: auto ;
    padding-left: 2rem;


   }
 `;
const Menu = (props) => {
    const router = useRouter();
    const [showTerms, setShowTerms] = useState(false);

   let message ="Hey TTWxPW! I need some help with planning my tailored experience.";

  
  return(
    <Container className="" style={{}}>
        <SetWidthContainer>
       {/* <FiltersContainer style={{ }}> */}
        {/* <DropDown className='font-lexend hover-pointer'>Duration</DropDown>
        <DropDown className='font-lexend hover-pointer'>Budget</DropDown>
        <DropDown className='font-lexend hover-pointer'>Treks</DropDown> */}
        {/* <FilterContainer className='hover-pointer' onClick={props.token ? () => props._deselectBookingHandler() : () => props.setShowLoginModal(true)}  >
                    <div style={{lineHeight: '1', fontSize: '13px', }} className="font-lexend">
                        {props.is_selecting ? <Spinner   size={16} margin="0 0 0 0.25rem"></Spinner>
                       : true?  <IoCheckboxOutline  style={{lineHeight: '1', fontSize: '20px', fontWeight: '700', marginTop: '0px'}}></IoCheckboxOutline> : <IoMdSquareOutline    style={{lineHeight: '1', fontSize: '20px', fontWeight: '700', marginTop: '0px'}}></IoMdSquareOutline>}
                    </div>
                    <FilterText style={{marginLeft: '4px'}}>{true ? 'All Trips' : 'Select'}</FilterText>
            
                </FilterContainer > */}
        {/* <FilterContainer  className='hover-pointer'  onClick={() => props._toggleFilterHandler("Treks")}  >
                    <div style={{lineHeight: '1', fontSize: '13px', }} className="font-lexend">
                        {props.is_selecting ? <Spinner   size={16} margin="0 0 0 0.25rem"></Spinner>
                       : props.filters["Trek"]?  <IoCheckboxOutline  style={{lineHeight: '1', fontSize: '20px', fontWeight: '700', marginTop: '0px'}}></IoCheckboxOutline> : <IoMdSquareOutline    style={{lineHeight: '1', fontSize: '20px', fontWeight: '700', marginTop: '0px'}}></IoMdSquareOutline>}
                    </div>
                    <FilterText style={{marginLeft: '4px'}}>{true ? 'Treks' : 'Select'}</FilterText>
            
                </FilterContainer  >
                <FilterContainer  className='hover-pointer' onClick={() => props._toggleFilterHandler("Road Trips")}  >
                    <div style={{lineHeight: '1', fontSize: '13px', }} className="font-lexend">
                        {props.is_selecting ? <Spinner   size={16} margin="0 0 0 0.25rem"></Spinner>
                       : props.filters["Road Trip"]?  <IoCheckboxOutline  style={{lineHeight: '1', fontSize: '20px', fontWeight: '700', marginTop: '0px'}}></IoCheckboxOutline> : <IoMdSquareOutline    style={{lineHeight: '1', fontSize: '20px', fontWeight: '700', marginTop: '0px'}}></IoMdSquareOutline>}
                    </div>
                    <FilterText style={{marginLeft: '4px'}}>{true ? 'Road Trips' : 'Select'}</FilterText>
            
                </FilterContainer  >  */}
                {/* <FilterContainer className='hover-pointer'  onClick={true ? () => props._deselectBookingHandler() : () => props.setShowLoginModal(true)}   >
                    <div style={{lineHeight: '1', fontSize: '13px', }} className="font-lexend">
                        {props.is_selecting ? <Spinner   size={16} margin="0 0 0 0.25rem"></Spinner>
                       : true?  <IoCheckboxOutline  style={{lineHeight: '1', fontSize: '20px', fontWeight: '700', marginTop: '0px'}}></IoCheckboxOutline> : <IoMdSquareOutline    style={{lineHeight: '1', fontSize: '20px', fontWeight: '700', marginTop: '0px'}}></IoMdSquareOutline>}
                    </div>
                    <FilterText style={{marginLeft: '4px'}}>{true ? 'Staycations' : 'Select'}</FilterText>
            
                </FilterContainer  >  */}

        {/* </FiltersContainer> */}
        <div className='font-lexend  hover-pointer' style={{color: 'white', display: 'flex',}} onClick={() => setShowTerms(true)}>
                    <div className='center-div'><ImageLoader center hoverpointer leftalign  onclick={props.openWhatsapp} url="media/icons/bookings/information.png" width="1.5rem" height="1.5rem" widthmobile="1.5rem"  ></ImageLoader></div>

            <div style={{display: 'flex', alignItems: 'center', marginLeft: '4px'}}>Terms & Conditions</div>
        </div>
        {/* <div></div> */}
        <div className='hidden-mobile' style={{color: 'white', display: 'flex', flexGrow: '1',paddingRight: '1rem'}} onClick={()=> window.location.href=urls.WHATSAPP+"?text="+message}>
            <div className='font-lexend hidden-mobile hover-pointer center-div'style={{marginRight: '0.5rem', lineHeight: '1'}}>Connect on WhatsApp</div>
            <ImageLoader onclick={props.openWhatsapp} url="media/icons/bookings/whatsapp.svg" width="2rem" height="2rem" widthmobile="2rem"  ></ImageLoader>
        </div>
   
        <div className='hidden-desktop' style={{color: 'white', display: 'flex', width: '100%', justifyContent: 'flex-end', paddingRight: '1rem'}} onClick={()=> window.location.href=urls.WHATSAPP+"?text="+message}>
            <div className='font-lexend hidden-mobile hover-pointer center-div'style={{marginRight: '0.5rem', lineHeight: '1'}}>Connect on WhatsApp</div>
            <ImageLoader onclick={props.openWhatsapp} leftalign url="media/icons/bookings/whatsapp.svg" width="2rem" height="2rem" widthmobile="2rem"  ></ImageLoader>
        </div>
        </SetWidthContainer>
        <Terms show={showTerms} hide={() => setShowTerms(false)}></Terms>
   </Container>
  );
}

export default Menu;
