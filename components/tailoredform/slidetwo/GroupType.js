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
    display: flex;
    justify-content: space-between;
  }
`;
 const OptionContainer = styled.div`
     text-align: center;
    border-radius: 16px;
    line-height: 1;
    font-size: 0.8rem;
    border: 2px solid rgba(236, 234, 234, 1);
    box-shadow: 0px 3px 0px 0px rgba(240, 240, 240, 1);
  margin-bottom: 0.5rem;
    width: 4.5rem;
    height: 4.5rem;
    background-color: ${(props) => (props.is_selected ? 'rgba(247,231,0,0.3)' : "transparent")};
    &:hover{
        background-color:${(props) => (props.is_selected ? 'rgba(247,231,0,0.3)' : "rgba(247,231,0,0.1)")};
  color: black;
    }
 `;
 
const GroupType = (props) => {

    let defaultcounters = [2,0,0];
    
     return(
        <Container className='font-opesans'>
            <GridContainer>
                <div className='text-center'>
                <OptionContainer className=' center-div font-opensans hover-pointer' is_selected={props.groupType === 'Solo'} onClick={() => props._handleShowPax('Solo')}>
                  <ImageLoader width="2rem" widthmobile="15vw" dimensions={{width: 400, height: 400}}   dimensionsMobile={{width: 400, height: 400}}  url="media/icons/planner-box/grouptype/solo.png"></ImageLoader>
                    
                </OptionContainer>
                Solo
                </div>
                <div className='text-center'>

                <OptionContainer  className='center-div   font-opensans hover-pointer' is_selected={props.groupType === 'Couple'} onClick={() => props._handleShowPax('Couple')}>
                    <ImageLoader width="2rem" widthmobile="15vw" dimensions={{width: 400, height: 400}}   dimensionsMobile={{width: 400, height: 400}}  url="media/icons/planner-box/grouptype/couple.png"></ImageLoader>

                   
                </OptionContainer>
                Couple
                </div>
                <div className='text-center'>

                <OptionContainer    className=' center-div  font-opensans hover-pointer' is_selected={props.groupType === 'Friends'}  onClick={() => props._handleShowPax('Friends')}>
                    <ImageLoader width="2rem" widthmobile="15vw" dimensions={{width: 400, height: 400}}   dimensionsMobile={{width: 400, height: 400}}  url="media/icons/planner-box/grouptype/friends.png"></ImageLoader>
                 </OptionContainer>
                Friends
                </div>
                <div className='text-center'>

                <OptionContainer   className='  center-div  font-opensans hover-pointer' is_selected={props.groupType === 'Family'} onClick={() => props._handleShowPax('Family')}>
                    <ImageLoader width="2rem" widthmobile="15vw" dimensions={{width: 400, height: 400}}   dimensionsMobile={{width: 400, height: 400}}  url="media/icons/planner-box/grouptype/family.png"></ImageLoader>
                    
                </OptionContainer>
                Family
                </div>
                {/* <OptionContainer className='border-thin font-opensans'>
                    <ImageLoader width="2rem" widthmobile="15vw" dimensions={{width: 400, height: 400}}   dimensionsMobile={{width: 400, height: 400}}  url="media/icons/Questionnaire/Group Type/friends.png"></ImageLoader>
                    Large group
                </OptionContainer> */}
            </GridContainer>
        </Container>
    );
   
}

export default GroupType;