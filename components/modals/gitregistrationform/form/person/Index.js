import React, {useState} from 'react';
  
 import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MuiAccordion from '@material-ui/core/Accordion';
import { withStyles } from '@material-ui/styles';
import Email from './Email';
import Id from './Id';
import Grid from '@material-ui/core/Grid';


const Accordion = withStyles({
    root: {
     marginBottom: 10,
     border: '0px solid #e4e4e4',
     boxShadow: 'none',
     zIndex: '1'
  
    },
   
    expanded: {},
  })(MuiAccordion);
  
const Person = (props) => {
    const [expanded, setExpanded] = useState(true);
    const [verificationfailed, setVerificationFailed] = useState(false);
    const [email, setEmail] = useState(null);
    const [id, setId] = useState(null);

  return(
      <div className='border'>
         <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
       <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="itinerary-booking-summary-accordio"
        style={{zIndex: '1', minHeight: 'max-content'}}

      >
         <Typography content={'span'} className="font-opensans" style={{fontWeight:'600', fontSize: '1rem', margin: '0.25rem 0' , color: expanded ? 'black' : verificationfailed  ? 'red' : email?  'green' : 'black'}} >{  email ? email : 'Person'}</Typography> 
 
        <Typography content={'span'} className="font-opensans" style={{fontWeight:'600', fontSize: '0.75rem', margin: '0', flexGrow:  '1', textAlign: 'right'}} >{''}</Typography>

      </AccordionSummary>
         <div style={{margin: '0 1rem', borderStyle: 'none none none none', borderWidth: '1px', borderColor: "#F7e700", position: 'relative', top: '-0.5rem'}}></div>
       <AccordionDetails style={{display: 'block', padding: '0'}}>
       
        <Grid container spacing={2} style={{padding: '0.25rem'}}>
                <Grid style={{width: '100%'}} item={12}>
                 <Email email={email} setEmail={setEmail} verificationfailed={verificationfailed} setVerificationFailed={setVerificationFailed} id={props.id}></Email>
               </Grid>
               <Grid style={{width: '100%'}} item={12}>
                    <Id  close={() => setExpanded(false)} verificationfailed={verificationfailed} ></Id>
               </Grid>


            </Grid> 
       </AccordionDetails>
     </Accordion>
      </div>
  );

}

export default Person;