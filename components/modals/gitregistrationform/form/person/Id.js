import React, {useState} from 'react';
import TextField from '@mui/material/TextField';

 
const Person = (props) => {
 
    const [value, setValue] = useState(null);

    const _handleBlur = () => {
        if(!props.verificationFailed){
            props.close();
        }
    }
  return(
      <div className='bordr'>
       
 <TextField value={value} onChange={(event) => setValue(event.target.value)} onBlur={_handleBlur}  type="text" placeholder="Employee ID" key="id"  variant="outlined" required fullWidth name="email" label="Employee ID" id="id"/>
       </div>
  );

}

export default Person;
