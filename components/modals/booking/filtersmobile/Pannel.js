import React from 'react';
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronLeft, faFontAwesomeLogoFull} from '@fortawesome/free-solid-svg-icons';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import StarSlider from '../leftsidebar/StarSlider';

const Container  = styled.div`

`;
const Heading = styled.p`
    font-size: 1.25rem;
    font-weight: 600;
    text-align: center;
    margin: 2rem 0;
`;
const Label = styled.p`
    font-size: 0.75rem;
    margin: 0 0 0 0.5rem;
`;
const Pannel = (props) =>{
    let filter = null;
    const _onChangeHandler = (checked, filter, heading) => {
         if(checked)
          props._addFilterHandler(filter, heading)
        else
          props._removeFilterHandler(filter,heading)
      }
      if(props.heading === 'Budget') filter = 'budget';
      else if(props.heading === 'Star Category') filter = 'star_category';
      else filter = 'type';

    //   if(props.heading!=='Star Category')
    return(
        <Container >
            <FontAwesomeIcon  onClick={() => props.onclose()} className="hover-pointer" icon={faChevronLeft}  style={{margin: '1rem'}} ></FontAwesomeIcon>
            <Heading className='font-opensans'>{props.heading}</Heading>
            {props.heading!=='Star Category' ?<div style={{width: 'max-content', margin: '2rem auto'}}>
           
            <FormGroup>
          { 
          props.filters[filter].map((currentfilter,i) =>         <FormControlLabel  key={i} control={<Checkbox onChange={(event) => _onChangeHandler(event.target.checked, currentfilter, filter)} sx={{ '& .MuiSvgIcon-root': { fontSize: 16 }, color: 'black', '&.Mui-checked': {color: 'black' }, }} defaultChecked={currentfilter === props.default ? true : false} />} label={<Label className="font-opensans">{currentfilter}</Label>}/>)
          }
      </FormGroup>   
      
            </div>   : <StarSlider _updateStarFilterHandler={props._updateStarFilterHandler}></StarSlider>}     
        </Container>
    );
    // else return <StarSlider></StarSlider>
}

export default React.memo(Pannel);