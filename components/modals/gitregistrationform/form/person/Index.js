import React, {useState, useEffect} from 'react';
  
 import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MuiAccordion from '@material-ui/core/Accordion';
import { withStyles } from '@material-ui/styles';
import Email from './Email';
import Id from './Id';
import Grid from '@material-ui/core/Grid';
import axiosgitregisterinstance from '../../../../../services/sales/git/register';
import Button from '../../../../ui/button/Index';
import Spinner from '../../../../Spinner';
import {AiOutlinePlusSquare} from 'react-icons/ai';
import media from '../../../../media';
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
  let isPageWide = media('(min-width: 768px)')

    const [expanded, setExpanded] = useState(false);
    const [verificationfailed, setVerificationFailed] = useState(false);
    const [verified, setVerified] = useState(false);
    const [verificationLoading, setVerificationLoading] = useState(false);
    const [email, setEmail] = useState(null);
    const [id, setId] = useState(null);

    useEffect(() => {
            if(props.first) setExpanded(true);
            if(props.first) setEmail(props.email);
      },[]);

      const _handleClose = () => {
        _checkValidation(email);
       
      }

      const _checkValidation = (email) => { 
        setVerificationLoading(true);
        const data = {
            "itinerary_id": "344fc89a-3e48-4a0c-9afe-368d85538634",
            "registered_users": [
                {
                     "email": email,
                }
            ]
        }
        // const token = localStorage.getItem('access_token');
        axiosgitregisterinstance.post('/', data, {headers: {
            'Authorization': `Bearer ${props.token}`
            }}).then(res => {
              setVerificationLoading(false);
              props.setVerificationCount(props.verificationCount + 1)
            // if(!res.data.verified) 
            setVerificationFailed(false);
            setVerified(true);
            setExpanded(false);
            props._addPersonHandler({
                email: email,
                employee_id: id,
            })
            // console.log(res.data)
     }).catch(err => {
        setVerificationFailed(true);
        setVerificationLoading(false);

     })
      }

    
  return(
      <div className='border'>
         <Accordion expanded={expanded}        
 onChange={() => setExpanded(!expanded)}>
       <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="itinerary-booking-summary-accordio"
        style={{zIndex: '1', minHeight: 'max-content'}}

      >
         <Typography content={'span'} className="font-opensans" style={{fontWeight:'600', fontSize: '1rem', margin: '0.25rem 0' , color: expanded ? 'black' : verificationfailed  ? 'red' : email?  'green' : 'black'}} >{  email ? email : 'Add Traveler '+props.index}</Typography> 
 
        <Typography content={'span'} className="font-opensans" style={{fontWeight:'600', fontSize: '0.75rem', margin: '0', flexGrow:  '1', textAlign: 'right'}} >{''}</Typography>

      </AccordionSummary>
         <div style={{margin: '0 1rem', borderStyle: 'none none none none', borderWidth: '1px', borderColor: "#F7e700", position: 'relative', top: '-0.5rem'}}></div>
       <AccordionDetails style={{display: 'block', padding: '0'}}>
       
        <Grid container spacing={2} style={{padding: '0.25rem'}}>
                <Grid style={{width: !isPageWide ? '100%' : 'auto'}} item md={6} xs={12}>
                 <Email verified={verified} setVerified={setVerified} token={props.token} email={email} setEmail={setEmail} verificationfailed={verificationfailed} setVerificationFailed={setVerificationFailed} id={props.id}></Email>
               </Grid>
               <Grid style={{width: !isPageWide ? '100%' : 'auto'}}  item md={6} xs={12}>
                    <Id verified={verified} id={id} setId={setId} close={_handleClose} verificationfailed={verificationfailed} ></Id>
               </Grid>
        </Grid> 
            <Button onclick={_handleClose} width="60%" margin="0.25rem auto" borderWidth="0" bgColor="#f7e700" borderRadius="10px">
              {verified ? 'Change' : 'Add Traveler'}
              {/* <GrAdd></GrAdd> */}
              {verificationLoading ? 
                <Spinner size={16} display={ "inline" }   margin="0 0 0 0.25rem" ></Spinner> : null }
              </Button>
       </AccordionDetails>
     </Accordion>
      </div>
  );

}

export default Person;