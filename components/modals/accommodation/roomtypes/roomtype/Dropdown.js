import Dropdown from 'react-bootstrap/Dropdown';
// import Collapse from 'react-bootstrap/Collapse';
import { useState } from 'react';

const DropDown = (props) =>  {
    const [open, setOpen] = useState(false);
    const _handleChange = (event) => {
         props.onclick({bookings: props.bookings,
            new_booking: props.new_booking,
            itinerary_id: props.itinerary_id,
            tailored_id: props.tailored_id,
            number_of_rooms: parseInt(event.target.innerHTML),
            })
    }
  return (
    <Dropdown  drop={'left'} onChange={_handleChange} >
      <Dropdown.Toggle   variant="success" id="stayroom-dropdown" className="border">
        Select
      </Dropdown.Toggle>
      {/* <Collapse in={open}> */}
      <Dropdown.Menu id="stayroom-dropdown-menu" className='bordr'>
        <p style={{margin: '0rem', padding: '0.75rem 0.5rem', borderRadius: '10px 10px 0 0', borderStyle: 'none none solid none', borderWidth: '1px', borderColor: '#e4e4e4', textAlign: 'right', fontWeight: '600',}}>How many rooms?</p>
        <Dropdown.Item onClick={_handleChange}>1</Dropdown.Item>
        <Dropdown.Item onClick={_handleChange}>2</Dropdown.Item>  
        <Dropdown.Item onClick={_handleChange}>3</Dropdown.Item>
        <Dropdown.Item onClick={_handleChange}>4</Dropdown.Item>
        <Dropdown.Item onClick={_handleChange} style={{border: 'none'}}>5</Dropdown.Item>


      </Dropdown.Menu>
      {/* </Collapse> */}

    </Dropdown>
  );
}

export default DropDown;