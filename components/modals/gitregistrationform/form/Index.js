import React, {useState} from "react";
 
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import Person from './person/Index';

  const Container = styled.div`
 
@media screen and (min-width: 768px){
    
}
`;
 
 

const Enquiry = (props) => {
    const [paxList, setPaxList] = useState([]);

    const _addPersonHandler = (data) => {
        let pax = paxList.slice();
        pax.push(
            data
        )
        setPaxList(pax);

    }
    console.log('paxlist', paxList);
    let pax = []
    for(var i = 0 ; i < props.pax ; i++){
        pax.push(
        <Grid item xs={12}>
            <Person token={props.token} _addPersonHandler={_addPersonHandler} id={props.id} index={i+1} first={!(i)}></Person>
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
           {/* <div onClick={null}></div> */}
           <div onClick={() => props.onSuccess(paxList)}>Submit</div>
     </Container>
);
}

export default Enquiry;