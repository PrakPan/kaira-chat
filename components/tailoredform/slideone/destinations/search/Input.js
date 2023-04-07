
import React, {useState, useEffect } from 'react';
  
import media from '../../../../media';
 
import styled from 'styled-components';
//  import LocationsContainer from './LocationsContainer'


const Container = styled.input`
 &:focus{
    border: none;
    outline: none;
 }
 border: none;
 
  @media screen and (min-width: 768px){
 
}

`;

 
const SearchInput = (props) => {
const [value, setValue] = useState(null);

const _handleKey = (e) => {
  setValue(e.target.value)
  props._handleKey(e);

}

useEffect(() => {
  if(props.searchFinalized) setValue(props.searchFinalized.name)
}, [props.searchFinalized]);
  let isPageWide = media('(min-width: 768px)');
  // const [showCities, setShowCities] = useState(false);
  // const [selectedCities, setSelectedCities] = useState([]);
  const _handleReset = () => {
    setValue('');
    props.setSearchFinalized(false);
    props.setResults([]);
    props.setShowResults(false);

    const selected = props.selectedCities.map(e=>{
      if(e.input_id == props.inbox_id) return {input_id : props.inbox_id}
      return e
    })
    props.setSelectedCities(selected)
  }

  function _handleBlur(){
    props.onblur()
    if(!value) props.setShowDestination(true)
  }

  return (
   <Container onFocus={props.onfocus} onBlur={_handleBlur} onClick={props.searchFinalized ? _handleReset : () => console.log('') } disabled={false} placeholder='Search destination' className='font-opensans' value={value} autoFocus onChange={(e) => _handleKey(e)}>
    
    </Container>
  );
}


export default SearchInput;

 