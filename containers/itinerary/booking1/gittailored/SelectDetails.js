
import React, {useState} from 'react';
// import ImageLoader from '../../../components/ImageLoader';
import SelectDate from './SelectDate';
import SelectPax from './SelectPax';
import Grid from '@material-ui/core/Grid';

const SelectDetails = (props) => {

 
  return (
 <div>
    <Grid container spacing={2}>
        <Grid item xs={6}>
            <SelectDate></SelectDate>
        </Grid>
        <Grid item xs={6}>
            <SelectPax></SelectPax>
        </Grid>
    </Grid>
    </div>
  );
}

export default SelectDetails;

