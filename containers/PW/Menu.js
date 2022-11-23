import React from 'react';
import styled from 'styled-components'
import { useRouter } from 'next/router';
import ImageLoader from '../../components/ImageLoader';
import {IoCheckboxOutline} from 'react-icons/io5';
import {IoMdSquareOutline} from 'react-icons/io'; 
import Spinner from '../../components/Spinner';
const Container = styled.div`
position: sticky;
top: 0;
padding: 0.5rem;
display: flex;
align-items: center;
background-color: black;
z-index: 1000;
height: 66px;
display: grid;
grid-template-columns: auto max-content;
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

const Menu = (props) => {
    const router = useRouter();

  
  return(
    <Container className="" style={{}}>
       <FiltersContainer style={{ }}>
        {/* <DropDown className='font-opensans hover-pointer'>Duration</DropDown>
        <DropDown className='font-opensans hover-pointer'>Budget</DropDown>
        <DropDown className='font-opensans hover-pointer'>Treks</DropDown> */}
        {/* <FilterContainer className='hover-pointer' onClick={props.token ? () => props._deselectBookingHandler() : () => props.setShowLoginModal(true)}  >
                    <div style={{lineHeight: '1', fontSize: '13px', }} className="font-opensans">
                        {props.is_selecting ? <Spinner   size={16} margin="0 0 0 0.25rem"></Spinner>
                       : true?  <IoCheckboxOutline  style={{lineHeight: '1', fontSize: '20px', fontWeight: '700', marginTop: '0px'}}></IoCheckboxOutline> : <IoMdSquareOutline    style={{lineHeight: '1', fontSize: '20px', fontWeight: '700', marginTop: '0px'}}></IoMdSquareOutline>}
                    </div>
                    <FilterText style={{marginLeft: '4px'}}>{true ? 'All Trips' : 'Select'}</FilterText>
            
                </FilterContainer > */}
        <FilterContainer  className='hover-pointer'  onClick={() => props._toggleFilterHandler("Treks")}  >
                    <div style={{lineHeight: '1', fontSize: '13px', }} className="font-opensans">
                        {props.is_selecting ? <Spinner   size={16} margin="0 0 0 0.25rem"></Spinner>
                       : props.filters["Trek"]?  <IoCheckboxOutline  style={{lineHeight: '1', fontSize: '20px', fontWeight: '700', marginTop: '0px'}}></IoCheckboxOutline> : <IoMdSquareOutline    style={{lineHeight: '1', fontSize: '20px', fontWeight: '700', marginTop: '0px'}}></IoMdSquareOutline>}
                    </div>
                    <FilterText style={{marginLeft: '4px'}}>{true ? 'Treks' : 'Select'}</FilterText>
            
                </FilterContainer  >
                <FilterContainer  className='hover-pointer' onClick={() => props._toggleFilterHandler("Road Trips")}  >
                    <div style={{lineHeight: '1', fontSize: '13px', }} className="font-opensans">
                        {props.is_selecting ? <Spinner   size={16} margin="0 0 0 0.25rem"></Spinner>
                       : props.filters["Road Trip"]?  <IoCheckboxOutline  style={{lineHeight: '1', fontSize: '20px', fontWeight: '700', marginTop: '0px'}}></IoCheckboxOutline> : <IoMdSquareOutline    style={{lineHeight: '1', fontSize: '20px', fontWeight: '700', marginTop: '0px'}}></IoMdSquareOutline>}
                    </div>
                    <FilterText style={{marginLeft: '4px'}}>{true ? 'Road Trips' : 'Select'}</FilterText>
            
                </FilterContainer  > 
                {/* <FilterContainer className='hover-pointer'  onClick={true ? () => props._deselectBookingHandler() : () => props.setShowLoginModal(true)}   >
                    <div style={{lineHeight: '1', fontSize: '13px', }} className="font-opensans">
                        {props.is_selecting ? <Spinner   size={16} margin="0 0 0 0.25rem"></Spinner>
                       : true?  <IoCheckboxOutline  style={{lineHeight: '1', fontSize: '20px', fontWeight: '700', marginTop: '0px'}}></IoCheckboxOutline> : <IoMdSquareOutline    style={{lineHeight: '1', fontSize: '20px', fontWeight: '700', marginTop: '0px'}}></IoMdSquareOutline>}
                    </div>
                    <FilterText style={{marginLeft: '4px'}}>{true ? 'Staycations' : 'Select'}</FilterText>
            
                </FilterContainer  >  */}

        </FiltersContainer>
        <div className='hidden-mobile' style={{color: 'white', display: 'flex', flexGrow: '1',paddingRight: '1rem'}}>
            <div className='font-opensans hidden-mobile hover-pointer center-div'style={{marginRight: '0.5rem', lineHeight: '1'}}>Connect on WhatsApp</div>
            <ImageLoader onclick={props.openWhatsapp} url="media/icons/bookings/whatsapp.svg" width="2rem" height="2rem" widthmobile="2rem"  ></ImageLoader>

        </div>
   </Container>
  );
}

export default Menu;
