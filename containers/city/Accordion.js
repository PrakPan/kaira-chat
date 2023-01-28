import React, {useState, useEffect} from 'react';
  
 import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MuiAccordion from '@material-ui/core/Accordion';
import { withStyles } from '@material-ui/styles';
import styled from  'styled-components';
 import media from '../../components/media';
import {BsChevronDown} from 'react-icons/bs'
import PoisData from '../../components/experiencecity/info/pois/Index';
import FoodsData from '../../components/experiencecity/info/foods/Index';

 const Container = styled.div`
 margin: 0 1rem;
 @media screen and (min-width: 768px){
width: 70%;
margin: auto; 
}
 `;
const StyledTypo = styled(Typography)`
margin: 0;
font-weight: 800;
@media screen and (min-width: 768px){
  font-size: 1.5rem;
  margin:0; 
}
`;
 
const Accordion = withStyles({

    root: {
     marginBottom: 10,
     border: '0px solid #e4e4e4',
     boxShadow: 'none',
     zIndex: '1'
  
    },
   
    expanded: {},
  })(MuiAccordion);

  const MainHeading = styled.h2`
    font-weight: 2rem;
    text-align: center;
    font-weight: 600;
    @media screen and (min-width: 768px){
        font-weight: 2.5rem;

    }
  `;
  const ContentContainer  = styled.div`
    font-size: 1.2rem;
    font-weight: 300;
    text-align: center;
  `;
  
const Accordions = (props) => {
  let isPageWide = media('(min-width: 768px)')

    const [expanded, setExpanded] = useState(false);
  
 
    useEffect(() => {
            
      },[]);

      const _handleClose = () => {
        
      }

      const handleChange = () => {
      
      }
    //   console.log(props.conveyance_available)
    
  return(
      <Container className='borde'>
        <MainHeading className='font-opensans text-center'>Overview</MainHeading>
        <ContentContainer className='font-opensans text-center'>
            {props.overview}
        </ContentContainer>

         {props.pois.length ? <Accordion expanded={expanded}        
 onChange={() => setExpanded(!expanded)}>
       <AccordionSummary
        expandIcon={null}
        aria-controls="panel1a-content"
        id="itinerary-booking-summary-accordio"
        style={{zIndex: '1', minHeight: 'max-content'}}

      >
  
        <StyledTypo content={'div'} className="font-opensans" style={{fontWeight: '600', fontSize: '1.5rem', textAlign: 'center', width: '100%'}} >
            {'Things to do'}
            <BsChevronDown style={{marginLeft: '4px'}}></BsChevronDown>
            </StyledTypo>

      </AccordionSummary>
         <div style={{}}></div>
       <AccordionDetails style={{}}>
       <PoisData slug={props.slug} pois={props.pois} _openPoiModal={(poi) => props._openPoiModal(poi)} ></PoisData>

      
       </AccordionDetails>
     </Accordion> : null}
     {props.conveyance_available? <Accordion expanded={expanded}        
 onChange={() => setExpanded(!expanded)}>
       <AccordionSummary
        expandIcon={null}
        aria-controls="panel1a-content"
        id="itinerary-booking-summary-accordio"
        style={{zIndex: '1', minHeight: 'max-content'}}

      >
  
        <StyledTypo content={'div'} className="font-opensans" style={{fontWeight: '600', fontSize: '1.5rem', textAlign: 'center', width: '100%'}} >
            {'Getting around'}
            <BsChevronDown style={{marginLeft: '4px'}}></BsChevronDown>
            </StyledTypo>

      </AccordionSummary>
         <div style={{}}></div>
       <AccordionDetails style={{}}>
        <ContentContainer>{props.conveyance_available}</ContentContainer>
      
       </AccordionDetails>
     </Accordion> : null}

     {props.foods? <Accordion expanded={expanded}        
 onChange={() => setExpanded(!expanded)}>
       <AccordionSummary
        expandIcon={null}
        aria-controls="panel1a-content"
        id="itinerary-booking-summary-accordio"
        style={{zIndex: '1', minHeight: 'max-content'}}

      >
  
        <StyledTypo content={'div'} className="font-opensans" style={{fontWeight: '600', fontSize: '1.5rem', textAlign: 'center', width: '100%'}} >
            {'What to eat'}
            <BsChevronDown style={{marginLeft: '4px'}}></BsChevronDown>
            </StyledTypo>

      </AccordionSummary>
         <div style={{}}></div>
       <AccordionDetails style={{}}>
        <FoodsData foods={props.foods}></FoodsData>
      
       </AccordionDetails>
     </Accordion> : null}

     {props.survival_tips_and_tricks? <Accordion expanded={expanded}        
 onChange={() => setExpanded(!expanded)}>
       <AccordionSummary
        expandIcon={null}
        aria-controls="panel1a-content"
        id="itinerary-booking-summary-accordio"
        style={{zIndex: '1', minHeight: 'max-content'}}

      >
  
        <StyledTypo content={'div'} className="font-opensans" style={{fontWeight: '600', fontSize: '1.5rem', textAlign: 'center', width: '100%'}} >
            {'Survival Tips & Tricks'}
            <BsChevronDown style={{marginLeft: '4px'}}></BsChevronDown>
            </StyledTypo>

      </AccordionSummary>
         <div style={{}}></div>
       <AccordionDetails style={{}}>
        <ContentContainer>{props.survival_tips_and_tricks}</ContentContainer>
      
       </AccordionDetails>
     </Accordion> : null}


        {props.folklore? <Accordion expanded={expanded}        
 onChange={() => setExpanded(!expanded)}>
       <AccordionSummary
        expandIcon={null}
        aria-controls="panel1a-content"
        id="itinerary-booking-summary-accordio"
        style={{zIndex: '1', minHeight: 'max-content'}}

      >
  
        <StyledTypo content={'div'} className="font-opensans" style={{fontWeight: '600', fontSize: '1.5rem', textAlign: 'center', width: '100%'}} >
            {'Folklore or Story'}
            <BsChevronDown style={{marginLeft: '4px'}}></BsChevronDown>
            </StyledTypo>

      </AccordionSummary>
         <div style={{}}></div>
       <AccordionDetails style={{}}>
        <ContentContainer>{props.folklore}</ContentContainer>
      
       </AccordionDetails>
     </Accordion> : null} 
      </Container>
  );

}



export default Accordions;