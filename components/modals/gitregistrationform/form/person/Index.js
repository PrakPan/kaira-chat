import React, {useState, useEffect} from 'react';
import Accordion , {AccordionSummary , AccordionDetails} from '../../../../ui/Accordion';
import Email from './Email';
import Id from './Id';
import axiosgitregisterinstance from '../../../../../services/sales/git/register';
import Button from '../../../../ui/button/Index';
import Spinner from '../../../../Spinner';
import styled from  'styled-components';
import media from '../../../../media';
const GridContainer = styled.div`
display : grid;
row-gap : 0.5rem;
@media screen and (min-width: 768px){
gap : 1rem;
grid-template-columns : 1fr 1fr;

}
`
  
const Person = (props) => {
  let isPageWide = media('(min-width: 768px)')
  const [open , setOpen] = useState(false)
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
          setOpen(false)
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
         <Accordion border initialOpen={props.index == 1?true:false} open={open} setOpen={setOpen}>
       <AccordionSummary
        id="itinerary-booking-summary-accordio"
    style={{padding: '1rem'}}
      >
         <p content={'span'} className="font-lexend" style={{fontWeight:'600' , margin: '0.5rem 0', color: expanded ? 'black' : verificationfailed  ? 'red' : email && id && verified?  'green' : 'black'}} >{  email && id && verified? email : 'Member '+props.index}</p> 
 
      </AccordionSummary>
       <AccordionDetails style={{padding : '0.5rem'}}>
       
        <GridContainer container spacing={2}>
                 <Email verified={verified} setVerified={setVerified} token={props.token} email={email} setEmail={setEmail} verificationfailed={verificationfailed} setVerificationFailed={setVerificationFailed} id={props.id}></Email>
                  <Id  verificationfailedmessage={verificationfailedmessage} verified={verified} id={id} setId={setId} close={_handleClose} verificationfailed={verificationfailed} ></Id>
        </GridContainer> 
            <div className='hidden-desktop'><Button onclick={verified ? _handleChange : _handleClose} width="60%" margin="0.25rem auto" borderWidth="0" bgColor="#f7e700" borderRadius="10px">
              {verified ? 'Change' : 'Add Member'}
              {verificationLoading ? 
                <Spinner size={16} display={ "inline" }   margin="0 0 0 0.25rem" ></Spinner> : null }
              </Button></div>
              <div className='hidden-mobile' style={{display: 'flex', justifyContent: 'flex-end'}}><Button onclick={!verified ? _handleClose : _handleChange} width="max-content" padding="0.5rem 1rem" margin="0.5rem 0.75rem 0.5rem 0" borderWidth="0" bgColor="#f7e700" hoverBgColor="#f7e700" hoverColor="black" borderRadius="10px">
              {verified ? 'Change' : 'Add Member'}
              {verificationLoading ? 
                <Spinner size={16} display={ "inline" }   margin="0 0 0 0.25rem" ></Spinner> : null }
              </Button></div>
       </AccordionDetails>
     </Accordion>
      
  );

}

export default Person;