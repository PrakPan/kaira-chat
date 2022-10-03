import React, {useState} from 'react';
import styled from 'styled-components';
// import Button from '../../../components/Button';
import Button from '../../../components/ui/button/Index';
import {checkEmail} from '../../../services/validations.js';


const Submit = (props) => {
    const [loading, setLoading] = useState(false);

    const _submitHandler = (event) => {
        props.storeState();
        setLoading(true);
        props.callAPI();
    }
    return(
        <Button
        boxShadow
            margin="auto"
            
            padding="0.5rem 2rem"
            borderWidth="1px"
            onclick={_submitHandler}>
            Submit
            {loading ? 1 : null}
        </Button>
    );
}

export default Submit;
