import React from 'react';
import styled from 'styled-components';
import media from '../../../media';
import {IoCheckboxOutline} from 'react-icons/io5';
import {IoMdSquareOutline} from 'react-icons/io';
import { getIndianPrice } from '../../../../services/getIndianPrice';
import Spinner from '../../../Spinner';
import {connect} from 'react-redux';

const Container = styled.div`
margin: 0.5rem 0.5rem 0 0.5rem;
padding: 0.5rem 0;
display: flex;
justify-content: space-between;
@media screen and (min-width: 768px){
   
    
}


`;
const Cost = styled.p`
    font-size: 23px;
    font-weight: 700;
    margin: 0;
`;
const HoverConainer = styled.div`
    &:hover{
        cursor: pointer;
    }
`;
const Section= (props) => {
    let isPageWide = media('(min-width: 768px)')
  
   if(props.data)
    return(
      <Container className='font-opensans'>  
              <HoverConainer onClick={props.token ? () => props._deselectBookingHandler(props.data, props.data.user_selected ? false : true) : () => props.setShowLoginModal(true)} style={{height: 'max-content', display: 'flex', fontSize: '13px', alignItems: 'center', fontWeight: '700', padding: '0.25rem', backgroundColor: props.data.user_selected ?  '#f7e700' : 'transparent', borderRadius: '5px', borderWidth: '1px', borderStyle: 'solid' , borderColor: props.data.user_selected ? '#f7e700' : "#e4e4e4"}} >
                    <div style={{lineHeight: '1', fontSize: '13px', }} className="font-opensans">
                        {props.is_selecting ? <Spinner   size={16} margin="0 0 0 0.25rem"></Spinner>
                       : props.data.user_selected ?  <IoCheckboxOutline style={{lineHeight: '1', fontSize: '20px', fontWeight: '700', marginTop: '0px'}}></IoCheckboxOutline> :  <IoMdSquareOutline style={{lineHeight: '1', fontSize: '20px', fontWeight: '700', marginTop: '0px'}}></IoMdSquareOutline> }
                    </div>
                    <div style={{marginLeft: '4px'}}>{props.data.user_selected ? 'Selected' : 'Select'}</div>
            
                </HoverConainer >
                {/* <div></div> */}
                <div >
                {/* {!props.are_prices_hidden ? <Cost className='font-opensans'>
                {"₹ "+ getIndianPrice(Math.round(props.data.booking_cost/100))+" /-"}
                </Cost> : null} */}
                </div>
      </Container>
  ); 
  else return null;
}

 const mapStateToPros = (state) => {
    return{
    
       
      token: state.auth.token,
     
    }
  }
  const mapDispatchToProps = dispatch => {
      return{
   
      }
    }

export default  connect(mapStateToPros,mapDispatchToProps)(Section);