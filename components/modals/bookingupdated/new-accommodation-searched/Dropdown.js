import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownButton = styled.button`
  background-color: #ffffff;

  color: #333333;
  padding: 8px 16px;
  font-size: 16px;
  cursor: pointer;
`;

const DropdownContent = styled.div`
  position: absolute;
  bottom: 100%;
  right: 0%;
  width: 200px;
  background-color: #ffffff;
  border: 1px solid #cccccc;
  padding: 8px;
  z-index: 1;
  opacity: ${({ open }) => (open ? 1 : 0)};
  transform: translateY(${({ open }) => (open ? '0' : '10px')});
  transition: opacity 0.3s ease, transform 0.3s ease;

  > :not(:last-child) {
    border-bottom: 1px solid #cccccc;
  }
  > div:hover {
    background-color: #000;
    color: #ffffff;
  }
  > * {
    text-align: center;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const ListItem = styled.div`
  animation: ${fadeIn} 0.3s ease;
  padding: 8px;
`;

const Dropdown = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  function _handleChange(e) {
    e.stopPropagation();
    props.onclick1();
    props.onclick({
      alternates: props.alternates,
      new_booking: props.new_booking,
      itinerary_id: props.itinerary_id,
      tailored_id: props.tailored_id,
      number_of_rooms: parseInt(e.target.innerHTML),
    });
  }
  return (
    <DropdownContainer>
      <DropdownContent open={isOpen}>
        <div>How many rooms?</div>
        <div onClick={(e) => _handleChange(e)}>1</div>
        <div onClick={(e) => _handleChange(e)}>2</div>
        <div onClick={(e) => _handleChange(e)}>3</div>
        <div onClick={(e) => _handleChange(e)}>4</div>
        <div onClick={(e) => _handleChange(e)} style={{ border: 'none' }}>
          5
        </div>
      </DropdownContent>
      <DropdownButton onClick={toggleDropdown}>{props.children}</DropdownButton>
    </DropdownContainer>
  );
};

export default Dropdown;

// const DropDown = ({ props, children }) => {

//   return (
//     <Dropdown drop={'up'} onChange={_handleChange}>
//       <Dropdown.Toggle
//         className=" background: none;
//   border: none;
//   box-shadow: none;
//   padding: 0;
//   outline: none;"
//       >
//         {children}
//       </Dropdown.Toggle>
//       {/* <Collapse in={open}> */}
//       <Dropdown.Menu id="staylisting-dropdown-menu" className="border">
//         <p
//           style={{
//             margin: '0rem',
//             padding: '0.75rem 0.5rem',
//             borderRadius: '10px 10px 0 0',
//             borderStyle: 'none none solid none',
//             borderWidth: '1px',
//             borderColor: '#e4e4e4',
//             textAlign: 'right',
//             fontWeight: '600',
//           }}
//         >
//           How many rooms?
//         </p>
//         <Dropdown.Item onClick={(e) => _handleChange(e)}>1</Dropdown.Item>
//         <Dropdown.Item onClick={(e) => _handleChange(e)}>2</Dropdown.Item>
//         <Dropdown.Item onClick={(e) => _handleChange(e)}>3</Dropdown.Item>
//         <Dropdown.Item onClick={(e) => _handleChange(e)}>4</Dropdown.Item>
//         <Dropdown.Item
//           onClick={(e) => _handleChange(e)}
//           style={{ border: 'none' }}
//         >
//           5
//         </Dropdown.Item>
//       </Dropdown.Menu>
//       {/* </Collapse> */}
//     </Dropdown>
//   );
// };

// export default DropDown;
