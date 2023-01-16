import React, { useState, useEffect }  from 'react';
import styled from 'styled-components';
import ImageLoader from '../../../ImageLoader';
import questioncontansts from '../../../../containers/personaliseform/questioncontansts';
const Container = styled.div`
border-radius: 5px;
@media screen and (min-width: 768px){
    
 }
`;
const GridContainer = styled.div`
display: grid;
grid-template-columns: max-content max-content max-content;
grid-gap: 1rem;
margin: 0rem 0;
width: max-content;
margin: auto;
@media screen and (min-width: 768px){
   
}
`;
const Icon = styled.div`
    &:hover{
        cursor: pointer;
    }
`;
 const CounContainer = styled.div`
 width: max-content;
 @media screen and (min-width: 768px){
    width: max-content;
}
 `;
 const Age = styled.p`
    font-size: 0.65rem;
    fort-weight: 300; 
    margin-bottom: 0em;
 `;

const Counter = (props) => {
    useEffect(() => {
        //Set background color if previously selected
        setCounter(props.defaultcounter);
        // let newanswers = props.newAnswers;
        let UPDATED_NEW_ANSWERS = {...props.newAnswers} || { };
        UPDATED_NEW_ANSWERS[props.type] = props.defaultcounter;
    //    props.setNewAnswers(UPDATED_NEW_ANSWERS);
        
    },[props.defaultcounter]);
    useEffect(() => {

        // if(props.answers[6] && props.heading==="Adults") setCounter(props.answers[6])
        // if(props.answers[7] && props.heading==="Children") setCounter(props.answers[7]) 
        // if(props.answers[8] && props.heading==="Infants") setCounter(props.answers[8])
        try{
            if(props.newAnswers[questioncontansts.PAX]){
                if(props.newAnswers[questioncontansts.PAX]["number_of_adults"] && props.type==="number_of_adults") setCounter(props.newAnswers[questioncontansts.PAX]["number_of_adults"])
                if(props.newAnswers[questioncontansts.PAX]["number_of_children"] && props.type==="number_of_infants") setCounter(props.newAnswers[questioncontansts.PAX]["number_of_adults"])
                if(props.newAnswers[questioncontansts.PAX]["number_of_infants"] && props.type==="number_of_infants") setCounter(props.newAnswers[questioncontansts.PAX]["number_of_adults"])

            }
        }catch{

        }

        
    },[props.questionIndex]);
   const [counter, setCounter ] = useState(1);

   const _increaseCounter = () => {
    //    let newanswers = props.answers
    //    newanswers[props.answerIndex] = counter+1;
       setCounter(counter+1)
    //    props.setAnswers(newanswers);
    switch(props.type){
        case 'number_of_adults': 
        props.setNumberOfAdults(props.numberOfAdults + 1)
        break;
        case 'number_of_children': 
        props.setNumberOfChildren(props.numberOfChildren + 1)
        break;
        case 'number_of_infants': 
        props.setNumberOfInfants(props.numberOfInfants + 1)
        break;
        default: 
        null;
        break;
    }


   }
   const _decreaseCounter = () => {
       if(counter){
        // let UPDATED_NEW_ANSWERS = {...props.newAnswers} || { };
        // let test = {}
        // test[props.type] = counter-1;
        // UPDATED_NEW_ANSWERS[questioncontansts.PAX] = {...UPDATED_NEW_ANSWERS[questioncontansts.PAX], ...test};
        // props.setPax()

        // let newanswers = props.answers
        // newanswers[props.answerIndex] = counter-1;
        switch(props.type){
            case 'number_of_adults': 
            props.setNumberOfAdults(props.numberOfAdults - 1)
            break;
            case 'number_of_children': 
            props.setNumberOfChildren(props.numberOfChildren - 1)
            break;
            case 'number_of_infants': 
            props.setNumberOfInfants(props.numberOfInfants - 1)
            break;
            default: 
            null;
            break;
        }
    setCounter(counter-1)
    // props.setAnswers(newanswers);

        
    }
}
 
    return(
        <Container className='border-thin'>
            {/* <ImageLoader width="3rem" widthmobile="15vw" dimensions={{width: 400, height: 400}}   dimensionsMobile={{width: 400, height: 400}}  url={props.img}></ImageLoader> */}
            <div style={{padding: '0.5rem'}}><p style={{margin: '0rem 0', fontSize: '0.85rem'}} className="font-opensans text-center">{props.heading}</p>
            <Age className='font-opensans text-center'>{props.age}</Age>
            {/* <p style={{margin: '0rem 0'}} className="font-opensans">{props.}</p> */}
            </div>
            <div style={{borderStyle: 'solid none none none', borderWidth: '1px', borderColor: '#e4e4e4'}}></div>
            <GridContainer>
                <Icon className="center-div" style={{fontSize: '1rem', fontWeight: '600'}} onClick={_decreaseCounter}>-</Icon>
                <CounContainer className="center-div">
                    <p style={{margin: '0rem 0'}}>{counter}</p>
                </CounContainer >
                <Icon className="center-div" style={{fontSize: '1rem', fontWeight: '600'}} onClick={_increaseCounter}>+</Icon>
            </GridContainer>
        </Container>
    );
   
}

export default Counter;