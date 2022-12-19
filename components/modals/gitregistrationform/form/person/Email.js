import React, {useState} from 'react';
import TextField from '@mui/material/TextField';
import axiosgitregisterinstance from '../../../../../services/sales/git/register';
 




const Person = (props) => {

    // _checkValidation();
  return(
      <div className='bordr'>
       
 <TextField disabled={props.verified} autoFocus value={props.email} onFocus={null} onChange={(event) => props.setEmail(event.target.value)} onBlur={null} error={props.verificationfailed === 'email' ? true : false } helperText={props.verificationfailed ==='email' ? `This email is not authorised to register.` : null} type="text" placeholder="employee@pw.live" key="email"  variant="outlined" required fullWidth name="email" label="Work Email" id="email" />
       </div>
  );

}

export default Person;
