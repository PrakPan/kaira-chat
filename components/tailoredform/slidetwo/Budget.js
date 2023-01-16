import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
 const marks = [
  {
    value: 0,
    label: <div style={{marginLeft: '50%'}} className="font-opensans" >{'₹3,000'}<div style={{fontSize: '0.65rem', fontWeight: '300'}}>per day or less</div></div>
  },
  {
    value: 33,
    label: '',
  },
  {
    value: 66,
    label: '',
  },
  {
    value: 100,
    label: <div style={{position: 'relative', left: '-50%', textAlign: 'right'}} className="font-opensans">{'₹10,000'}<div style={{textAlign: 'right', fontWeight: '300', fontSize: '0.65rem'}}>per day or more</div></div>
  },
];

function valuetext(value) {
  return `${value}`;
}

function valueLabelFormat(value) {
  // return marks.findIndex((mark) => mark.value === value) + 1;
  switch(value){
    case 0:
      return '₹3,000';
      break;
    case 33:
      return '₹3,000 - ₹6,000';
      break;
    case 66:
        return '₹6,000 - ₹10,000';
        break;
    case 100:
          return '₹10,000';
          break;
    default:
      return ''
  }
}

// const StyledSlider = styled(Slider)({
// color: '#f7e700',
// '& .MuiSlider-track': {
//   'backgroundColor': 'red',
// },
// '& .MuiSlider-rail': {
//   'opacity': 0.5,
//   'backgroundColor': '#bfbfbf',
// },
// });

const  DiscreteSliderValues = (props) =>  {
  const _handleChange = (event) => {
    switch(event.target.value){
      case 0: 
      props.setBudget('Affordable');
      break;
      case 33: 
      props.setBudget('Average');
       break;
      case 66: 
      props.setBudget('Luxury');
       break;
      case 100: 
      props.setBudget('Luxury +');
       break;
    }
  
  }
  return (
    <Box>
      <Slider
        aria-label="Budget per day"
        defaultValue={0}
        style={{color:'#f7e700'}}
        valueLabelFormat={valueLabelFormat}
        getAriaValueText={valuetext}
        step={null}
        onChange={(event) => _handleChange(event)}
        valueLabelDisplay="auto"
        marks={marks}
      />
    </Box>
  );
}

export default DiscreteSliderValues
