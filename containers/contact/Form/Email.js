import React, {useState} from 'react';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import {checkEmail} from '../../../services/validations'


const Text = (props) => {
    const [errorState, setErrorState] = useState(false);
    const onBlurHandler = (event) => {
        if(!checkEmail(event.target.value)) setErrorState(true)
        else setErrorState(false);
    }
    return(
        <TextField 
            error = {errorState ? true : false}
            helperText={errorState ? "Invalid Email" : null}
            id={props.id}
            required
            name={props.name}
            fullWidth 
            label={props.label}
            variant="outlined" 
            placeholder={props.placeholder}
            onChange={(event) => props._changeDetailsHandler(event, props.name)}
            onBlur={onBlurHandler}
        />
    );
}

export default React.memo(Text);
