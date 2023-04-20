import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { BsCaretDownFill } from "react-icons/bs";
import { BiError } from "react-icons/bi";
const Container = styled.div`
  background: white;
  width: ${props=>props.width || '100%'};
  position: relative;
  // border: 1px solid rgba(208, 213, 221, 1);
  z-index : ${props=>props.zIndex || '5'};
  // border-radius: 8px;
  /* box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px; */
`;
const SelectBox = styled.div`
border: ${props=>props.error ? '1px solid red !important' :  '1px solid rgba(208, 213, 221, 1)'};
  border-radius: 8px;
  position: relative;
  text-align : center;
  display : flex;
  align-items : center;
  justify-content : ${props=>props.labelCenter? 'center' : 'left'};
  height : ${(props) => props.height || "3rem"};
  width: ${props=>props.width || '100%'};
`;
const DropDownIcon = styled.div`
  position: absolute;
  height: 1rem;
  right: 5px;
  top: 1rem;

  transform: rotate(0deg);
  transition: all 0.3s ease-out;
  transform: ${(props) => (props.rotate ? `rotate(180deg)` : "")};
`;
const Children = styled.div`
  position: absolute;
  top: ${props=>props.top || '3rem'};
  margin-top : 3px;
  border-radius: 8px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  background: white;
  width: 100%;

  option {
    display : flex;
  align-items : center;
  justify-content : center;
  height : ${(props) => props.height || "3rem"};
    &:hover {
      background: rgba(0, 0, 0, 0.1);
      border-radius: 8px;
    }
  }
`;
const Error = styled.div`
  color : red;
  font-size : 13px;
  margin-left : 5px;
  display : flex;
`;
const Label = styled.label`
  position: absolute;
  pointer-events: none;
  font-size : ${props=>props.fontSize};
  color : ${props=>props.error? 'red !important' : 'black'};
  left: 20px;
  top: 30%;
  white-space: nowrap;
  // overflow: hidden;
  transition: 0.2s ease all;
  color : ${props=>props.error? 'red !important' : 'black'};
  ${props=>props.selected && 'top: -4px;left: 10px;font-size: 11px;padding-inline: 5px;background: white;'} 
`
const CountryCodeDropdown = (props) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const ref = useRef();
  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);

    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, []);
  return (
      <Container ref={ref} zIndex={props.zIndex} className='font-poppins' width={props.width}>
        <SelectBox error={props.error} labelCenter={props.labelCenter} height={props.height} onClick={() => setOpen(!open)} width={props.width} style={props.labelStyle}>
<Label error={props.error} selected={selected}>{props.label}</Label>
    {selected}
          <DropDownIcon rotate={open}>
            <BsCaretDownFill />
          </DropDownIcon>
        </SelectBox>
        {open && (
            <Children
            top={props.height}
            width={props.width}
            height={props.optionHeight || props.height}
              onClick={(e) => {
                setSelected(e.target.innerText);
                props.onChange(e);
                setOpen(false);
              }}
            >
              {props.children}
            </Children>
        )}
  {props.error && props.helperText && <Error><BiError style={{fontSize : '1rem' , marginTop : '2px'}} /><span style={{marginLeft : '2px'}}>{props.helperText}</span></Error>}
      </Container>
  );
};

export default CountryCodeDropdown;
