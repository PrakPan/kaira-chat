import React, {useState, useEffect} from 'react';
import styled from 'styled-components';

// import {BsDot} from 'react-icons/bs'


const Container = styled.div`
width: 80%;
margin: auto;
display: grid;
grid-template-columns: 1fr ;
grid-gap: 2rem;
`;

const Address = styled.div``;

const Map = styled.div`

`;
const Location = (props) => {
    // const [ammenities, setAmmenities] = useState(null);
    // useEffect(() => {
     
    //   }, []);
return( 
 <Container className='center-di'>
    <Address>
        <p className='font-opensans' style={{fontWeight: '600'}}>Address</p>
        <p className='font-opensans' style={{fontWeight: '300'}}>{props.data.addr1}</p>
        <p className='font-opensans' style={{fontWeight: '300'}}>{props.data.addr2}</p>
    </Address>
    {/* <Map>

    </Map> */}
</Container>
);

}

export default Location;