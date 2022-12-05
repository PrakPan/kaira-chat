import React, {useState} from 'react';
import TextField from '@mui/material/TextField';
import axiosgitregisterinstance from '../../../../../services/sales/git/register';
 




const Person = (props) => {

    
 
    // _checkValidation();
  return(
      <div className='bordr'>
       
 <TextField disabled={props.verified} autoFocus value={props.email} onFocus={null} onChange={(event) => props.setEmail(event.target.value)} onBlur={null} error={props.verificationfailed ? true : false } helperText={props.verificationfailed ? `This doesn't seem right ` : null} type="text" placeholder="test@test.com" key="email"  variant="outlined" required fullWidth name="email" label="Work Email" id="email" />
       </div>
  );

}

export default Person;
