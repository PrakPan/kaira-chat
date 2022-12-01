import React, {useState} from 'react';
import TextField from '@mui/material/TextField';
import axiosgitregisterinstance from '../../../../../services/sales/git/register';
 




const Person = (props) => {

    const _checkValidation = (email) => { 
        const data = {
            "itinerary_id": "344fc89a-3e48-4a0c-9afe-368d85538634",
            "registered_users": [
                {
                     "email": email,
                     "employee_id": "abcabcba"
                }
            ]
        }
        // const token = localStorage.getItem('access_token');
        axiosgitregisterinstance.post('/', data).then(res => {
            // if(!res.data.verified) 
            props.setVerificationFailed(false);
            // console.log(res.data)
     }).catch(err => {
        props.setVerificationFailed(true);
     })
         }

 
    // _checkValidation();
  return(
      <div className='bordr'>
       
 <TextField  autoFocus value={props.email} onFocus={null} onChange={(event) => props.setEmail(event.target.value)} onBlur={() => _checkValidation(props.email)} error={props.verificationfailed ? true : false } helperText={props.verificationfailed ? `This doesn't seem right ` : null} type="text" placeholder="test@test.com" key="email"  variant="outlined" required fullWidth name="email" label="Work Email" id="email" />
       </div>
  );

}

export default Person;
