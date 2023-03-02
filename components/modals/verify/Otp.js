import React, {useState} from 'react';
import TextField from '@mui/material/TextField';
// import axiosgitregisterinstance from '../../../../../services/sales/git/register';
 




const Person = (props) => {

  

        
 
    // _checkValidation();
  return(
      <div className='bordr'>
       
 <TextField  autoFocus value={props.otp} onFocus={null} onChange={(event) => props.setOtp(event.target.value)} onBlur={() => console.log(props.otp)} error={props.otpVerificationFailed? true : false } helperText={props.otpVerificationFailed ? `Try Again ` : null} type="text" placeholder="0000" key="otp"  variant="outlined" required fullWidth name="otp"  label="OTP" id="otp" />
       </div>
  );

}

export default Person;
