import React , {useState,useEffect,forwardRef} from "react";
import styled from "styled-components";
import {BiError} from 'react-icons/bi'

const Container = styled.div`
  position: relative;
  height: ${(props) => props.height || "50px"};
  width: ${(props) => props.width || "100%"};
  overflow : hidden;
`;

const Input = styled.input`
  height: ${(props) => props.height || "50px"};
  width: ${(props) => props.width || "100%"};
  font-size: 14px;
  padding-inline: 20px;
  font-style: normal;
  border: ${props=>props.error ? '1px solid red !important' :  '1px solid rgba(208, 213, 221, 1)'};
  border-radius: 0.5rem;
  box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  &:focus {
    outline: none;
    border-width : 2px !important;
  }
`;

const Label = styled.label`
  position: absolute;
  pointer-events: none;
  font-size : ${props=>props.fontSize};
  left: 20px;
  top: 30%;
  white-space: nowrap;
  // overflow: hidden;
  transition: 0.3s ease all;
  color : ${props=>props.error? 'red !important' : 'black'};
  ${Input}:focus ~ & {
    top: -4px;
    left: 10px;
    font-size: 11px;
    padding-inline: 5px;
    background: white;
  }
  ${(props) =>
    props.filled &&
    "top: -4px; left: 10px; font-size: 11px; padding-inline: 5px; background: white;"};
  sup{
    top: -0.3em;
    left: -0.2em;
  }
    `;
const Error = styled.div`
  color : red;
  font-size : 13px;
  margin-left : 5px;
  display : flex;
`;
const FloatingInput = forwardRef((props,ref) => {
  const [valueState,setValueState] = useState(null)
  useEffect(()=>{
  setValueState(props.value)
  },[props.value])

 return <div style={{marginBottom : '2px' , margin : props.margin}}>  
 <Container
    style={props.ContainerStyle}
    height={props.height}
    width={props.width}
    className="font-lexend"
  > 
    <Input
      {...props}
      height={props.height}
      width={props.width}
      placeholder={""}
      onChange={(e) => {
        props.onChange && props.onChange(e);
        setValueState(e.target.value)
       }}
       onFocus={(e) => props.onFocus && props.onFocus(e)}
       onBlur={(e)=>props.onBlur && props.onBlur(e)}
      ref={ref} 
    />
    <Label filled={
      (valueState !== 0)? !!valueState
      : true
    } fontSize={props.fontSize || props.style?.fontSize || '1rem'} error={props.error} style={props.labelStyle}>{props.label || props.placeholder} {props.required && <sup>*</sup>}</Label>
  </Container>
  {props.error && props.helperText && <Error><BiError style={{fontSize : '1rem' , marginTop : '2px'}} /><span style={{marginLeft : '2px'}}>{props.helperText}</span></Error>}
  </div>
});

export default FloatingInput;
