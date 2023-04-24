import React, {useState} from 'react';
 import styled from 'styled-components';
import ImageLoader from '../../../ImageLoader';
import Info from './info/Index';
import  media from '../../../media';
import BackgroundImageLoader from '../../../BackgroundImageLoader';

const Container = styled.div`
@media screen and (min-width: 768px){
    width: 90%;
    margin: auto;
}
`;
const GridContainer = styled.div`
    display: grid;
    grid-template-columns: max-content auto;
`;
const RelativeContainer = styled.div`
    position: relative;
 `;
const AbsoluteContainer = styled.div`
    position: absolute;
    bottom: 0;
    background-color: rgba(0,0,0,0.6);
    height: 100%;
    border-radius: 5px;
    color: white;
    width: 100%;
     padding: 0.5rem;
`;
const Heading = styled.p`
    font-weight: 600;
    margin-bottom: 0.25rem;
    font-size: 13px;
    line-height: 1.2;
    @media screen and (min-width: 768px){
        font-size: 16px;

    }

`;
const Subheading = styled.p`
    font-weight: 300;
    font-size: 13px;
    margin-bottom: 0;
    line-height: 1;


`;
const Cart = (props) => {
    let isPageWide = media('(min-width: 768px)')

  
  return(
      <Container className='' >
            <GridContainer>
                <RelativeContainer>
                <ImageLoader 
                url={props.plan ? props.plan.images ? props.plan.images.length ? props.plan.images[0] : "media/website/grey.png" : "media/website/grey.png" : "media/website/grey.png"}
                widthmobile="40vw"
                width="12vw"
                borderRadius="5px"
                height={'100%'}
                ></ImageLoader>
                <AbsoluteContainer className='font-opensans center-div text-center'>
                    <Heading className='font-opensans'>{props.plan ? props.plan.name ? props.plan.name : null : null}</Heading>
                    <Subheading className='font-opensans'>{props.plan ? props.plan.duration_number ? props.plan.duration_number + " " + props.plan.duration_unit : null : null}</Subheading>
                </AbsoluteContainer>
                </RelativeContainer>
                {/* <BackgroundImageLoader height={'20vh'}
                url={props.plan ? props.plan.images ? props.plan.images.length ? props.plan.images[0] : "media/website/grey.png" : "media/website/grey.png" : "media/website/grey.png"}
                filters="linear-gradient(180deg, rgba(0, 0, 0,0) 50%, rgba(0, 0, 0, 1) 100%)" 
                  borderRadius="10px 10px 0 0"></BackgroundImageLoader> */}

                <Info setShowTermsModal={props.setShowTermsModal} date={props.date} cost={props.cost} pax={props.pax} plan={props.plan}></Info>
            </GridContainer>
            <hr style={{margin: '6px 0'}}></hr>
        </Container>
  );

}

export default Cart;
