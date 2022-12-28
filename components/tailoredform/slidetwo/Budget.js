import React  from 'react';
import styled from 'styled-components';
// import Counter from './pax/counter';
// import questions from '../../../containers/personaliseform/questions';
// import Button from '../../../components/Button';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEdit } from '@fortawesome/free-solid-svg-icons';
// import questioncontansts from '../../../containers/personaliseform/questioncontansts';
import ImageLoader from '../../ImageLoader';
const Container = styled.div`
    width: 100%;
    margin: 1rem auto;
     @media screen and (min-width: 768px){
        padding-bottom: 0;
        margin: auto;
    }
`;


const GridContainer = styled.div`
display: grid;
grid-template-columns: 1fr 1fr 1fr;
grid-gap: 1rem;
width: 100%;
@media screen and (min-width: 768px){
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
 }
`;
 const OptionContainer = styled.div`
    padding: 0.5rem;
    text-align: center;
    border-radius: 10px;
    font-size: 0.85rem;
 `;
 
const GroupType = (props) => {

    let defaultcounters = [2,0,0];
    
     return(
        <Container>
            <GridContainer onClick={() => props.setShowPax(true)}>
                <OptionContainer className='border-thin font-opensans'>
                  <ImageLoader width="2rem" widthmobile="15vw" dimensions={{width: 400, height: 400}}   dimensionsMobile={{width: 400, height: 400}}  url="media/icons/Questionnaire/Budget/affordable.png"></ImageLoader>
                    Affordable
                </OptionContainer>
                <OptionContainer className='border-thin font-opensans'>
                    <ImageLoader width="2rem" widthmobile="15vw" dimensions={{width: 400, height: 400}}   dimensionsMobile={{width: 400, height: 400}}  url="media/icons/Questionnaire/Budget/average.png"></ImageLoader>

                    Average
                </OptionContainer>
                <OptionContainer className='border-thin font-opensans'>
                    <ImageLoader width="2rem" widthmobile="15vw" dimensions={{width: 400, height: 400}}   dimensionsMobile={{width: 400, height: 400}}  url="media/icons/Questionnaire/Budget/luxury.png"></ImageLoader>
                    Luxury
                </OptionContainer>
                <OptionContainer className='border-thin font-opensans'>
                    <ImageLoader width="2rem" widthmobile="15vw" dimensions={{width: 400, height: 400}}   dimensionsMobile={{width: 400, height: 400}}  url="media/icons/Questionnaire/Budget/ultra luxury.png"></ImageLoader>
                    Luxury +
                </OptionContainer>
                {/* <OptionContainer className='border-thin font-opensans'>
                    <ImageLoader width="2rem" widthmobile="15vw" dimensions={{width: 400, height: 400}}   dimensionsMobile={{width: 400, height: 400}}  url="media/icons/Questionnaire/Group Type/friends.png"></ImageLoader>
                    Large group
                </OptionContainer> */}
            </GridContainer>
        </Container>
    );
   
}

export default GroupType;