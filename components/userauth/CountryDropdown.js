import { useEffect, useRef } from 'react';
import styled from 'styled-components'

const Container = styled.div`
background : white;
position : absolute;
z-index  : 5;
overflow : auto;
height : 17.5rem;
width : 90px;
border-radius :8px;
box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
`

const CountryCodeDropdown = props =>{
    const ref=useRef();
    useEffect(() => {
        const checkIfClickedOutside = e => {
            if ( ref.current && !ref.current.contains(e.target)) {
                props.onClose();
            }
          }
        document.addEventListener("mousedown", checkIfClickedOutside)
    
        return () => {
          document.removeEventListener("mousedown", checkIfClickedOutside)
    
        };
    },[]);
    return <Container ref={ref}>
        {props.ExtensionOptions}
    </Container>


}


export default CountryCodeDropdown;
