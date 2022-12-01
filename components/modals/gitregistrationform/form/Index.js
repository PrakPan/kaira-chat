import React, {useState} from "react";
 
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import Person from './person/Index';

  const Container = styled.div`
 
@media screen and (min-width: 768px){
    
}
`;
 
 

const Enquiry = (props) => {
    const [paxJSX, setPaxJSX] = useState(null);

    let pax = []
    for(var i = 0 ; i < 10 ; i++){
        pax.push(
        <Grid item xs={12}>
            <Person id={props.id}></Person>
        </Grid> 
        )
    }
    // setPaxJSX(pax);
return(
    <Container className="borer center-div">
              <div>
            </div>
            
            <Grid container spacing={2}>
                {pax}
               
            </Grid> 
           
     </Container>
);
}

export default Enquiry;