import React, {useState} from 'react';
 import styled from 'styled-components';
import ImageLoader from '../../../ImageLoader';
import Info from './info/Index';
const GridContainer = styled.div`
    display: grid;
    grid-template-columns: max-content auto;
`;
const Cart = (props) => {

  
  return(
      <div className=''>
            <GridContainer>
                <ImageLoader 
                url={props.plan ? props.plan.images ? props.plan.images.length ? props.plan.images[0] : "media/website/grey.png" : "media/website/grey.png" : "media/website/grey.png"}
                widthmobile="40vw"
                height="40vw"
                ></ImageLoader>
                <Info date={props.date} pax={props.pax} plan={props.plan}></Info>
            </GridContainer>
            <hr></hr>
        </div>
  );

}

export default Cart;
