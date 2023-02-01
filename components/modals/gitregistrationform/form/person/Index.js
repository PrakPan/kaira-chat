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
import styled from  'styled-components';
import {AiOutlinePlusSquare} from 'react-icons/ai';
import media from '../../../../media';

const StyledTypo = styled(Typography)`
margin: 0.25rem 0;
@media screen and (min-width: 768px){
  font-size: 0.5rem;
  margin: 0.75rem 0; 
}
`;
const StyledGridContainer = styled(Grid)`
padding: 0.25rem;
@media screen and (min-width: 768px){
  padding: 0.75rem;
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
  
const Person = (props) => {
  let isPageWide = media('(min-width: 768px)')

    const [expanded, setExpanded] = useState(false);
    const [verificationfailed, setVerificationFailed] = useState(false);
    const [verificationfailedmessage, setVerificationFailedMessage] = useState(null);

    const [verified, setVerified] = useState(false);
    const [verificationLoading, setVerificationLoading] = useState(false);
    const [email, setEmail] = useState(null);
    const [id, setId] = useState(null);

    useEffect(() => {
            if(props.first) setExpanded(true);
            if(props.first) setEmail(props.email);
      },[]);

      const _handleClose = () => {
        _checkValidation(email, id);
       
      }

      const _checkValidation = (email, id) => { 
        setVerificationLoading(true);
        const data = {
            "itinerary_id": props.id,
            "registered_users": [
                {
                     "email": email,
                     "employee_id": id,
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
            try{
            props._addPersonHandler({
                email: res.data.registered_users[0].email,
                employee_id: res.data.registered_users[0].employee_id,
            })
          }catch{

          }
            // console.log(res.data)
     }).catch(err => {
       try{
         setVerificationFailed(err.response.data.registered_users[0].invalid_field);
        setVerificationFailedMessage(err.response.data.registered_users[0][err.response.data.registered_users[0].invalid_field])
      }catch{

      }
        // setVerificationFailed(err.response.data.registered_users[0].invalid_field);
        setVerificationLoading(false);

     })
      }

      const _handleChange = () => {
        setVerified(false);
        props.setVerificationCount(props.verificationCount - 1);
        props._removePersonHandler({
          email: email,
          employee_id: id,
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
         <StyledTypo content={'span'} className="font-opensans" style={{fontWeight:'600' , margin: '0.5rem 0', color: expanded ? 'black' : verificationfailed  ? 'red' : email && id && verified?  'green' : 'black'}} >{  email && id && verified? email : 'Member '+props.index}</StyledTypo> 
 
        <Typography content={'span'} className="font-opensans" style={{fontWeight:'600', fontSize: '0.75rem', margin: '0', flexGrow:  '1', textAlign: 'right'}} >{''}</Typography>

      </AccordionSummary>
         <div style={{margin: '0 1rem', borderStyle: 'none none none none', borderWidth: '1px', borderColor: "#F7e700", position: 'relative', top: '-0.5rem'}}></div>
       <AccordionDetails style={{display: 'block', padding: '0'}}>
       
        <StyledGridContainer container spacing={2}>
                <Grid style={{width: !isPageWide ? '100%' : 'auto'}} item md={6} xs={12}>
                 <Email verified={verified} setVerified={setVerified} token={props.token} email={email} setEmail={setEmail} verificationfailed={verificationfailed} setVerificationFailed={setVerificationFailed} id={props.id}></Email>
               </Grid>
               <Grid style={{width: !isPageWide ? '100%' : 'auto'}}  item md={6} xs={12}>
                  <Id  verificationfailedmessage={verificationfailedmessage} verified={verified} id={id} setId={setId} close={_handleClose} verificationfailed={verificationfailed} ></Id>
               </Grid>
        </StyledGridContainer> 
            <div className='hidden-desktop'><Button onclick={verified ? _handleChange : _handleClose} width="60%" margin="0.25rem auto" borderWidth="0" bgColor="#f7e700" borderRadius="10px">
              {verified ? 'Change' : 'Add Member'}
              {/* <GrAdd></GrAdd> */}
              {verificationLoading ? 
                <Spinner size={16} display={ "inline" }   margin="0 0 0 0.25rem" ></Spinner> : null }
              </Button></div>
              <div className='hidden-mobile' style={{display: 'flex', justifyContent: 'flex-end'}}><Button onclick={!verified ? _handleClose : _handleChange} width="max-content" padding="0.5rem 1rem" margin="0.5rem 0.75rem 0.5rem 0" borderWidth="0" bgColor="#f7e700" hoverBgColor="#f7e700" hoverColor="black" borderRadius="10px">
              {verified ? 'Change' : 'Add Member'}
              {/* <GrAdd></GrAdd> */}
              {verificationLoading ? 
                <Spinner size={16} display={ "inline" }   margin="0 0 0 0.25rem" ></Spinner> : null }
              </Button></div>
       </AccordionDetails>
     </Accordion>
      </div>
  );

}

export default Person;