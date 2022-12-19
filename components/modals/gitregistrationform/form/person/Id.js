import React, {useState} from 'react';
import TextField from '@mui/material/TextField';

 
const Person = (props) => {
 
 
    const _handleBlur = () => {
        if(!props.verificationFailed){
            props.close();
        }
    }
  return(
      <div className='bordr'>
       
 <TextField error={props.verificationfailed === 'employee_id' ? true : false } helperText={props.verificationfailed ==='employee_id' ? props.verificationfailedmessage : null} disabled={props.verified} value={props.id} onChange={(event) => props.setId(event.target.value)} onBlur={null}  type="text" placeholder="Employee ID" key="id"  variant="outlined" required fullWidth name="email" label="Employee ID" id="id"/>
       </div>
  );

}

export default Person;
