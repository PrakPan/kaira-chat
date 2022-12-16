import React, {useState} from "react";
 
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import Person from './person/Index';
 const Container = styled.div`
 display: grid;
 grid-template-columns: 1fr 1fr;
@media screen and (min-width: 768px){
    width: 75%;
    margin: auto;
}
`;
 
 
const Enquiry = (props) => {
    console.log(props.registered_users)
    let emails = [];
    let status = [];
  
    
     let pax = []
     try{
    for(var i = 0 ; i < props.registered_users.length ; i++){
        emails.push(
            <div>email@pw.live</div>
         )
         status.push(
            <div>Invited</div>
         )
    }
}
catch{

}
     // setPaxJSX(pax);
return(
    <Container className="borer center-div">
       <div>
            {emails}
       </div>
       <div>
            {status}
       </div>
      </Container>
);
}

export default Enquiry;