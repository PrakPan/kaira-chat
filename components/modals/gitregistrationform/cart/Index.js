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
                url="media/website/grey.png"
                widthmobile="40vw"
                height="40vw"
                ></ImageLoader>
                <Info></Info>
            </GridContainer>
            <hr></hr>
        </div>
  );

}

export default Cart;
