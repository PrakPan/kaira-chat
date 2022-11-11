import Dropdown from 'react-bootstrap/Dropdown';

const DropDown = (props) =>  {
    const _handleChange = (event) => {
        // console.log(event.target.innerHTML)
        props.onclick( {
          itinerary_id: props.itinerary_id,
          taxi_type: props.taxi_type, 
          transfer_type: props.transfer_type,
          duration: props.duration,
          total_taxi: parseInt(event.target.innerHTML),
        }
      )
    }
    console.log('id', props.itinerary_id)
  return (
    <Dropdown  drop={'up'} onChange={_handleChange} >
      <Dropdown.Toggle  variant="success" id="staylisting-dropdown" className="border">
        Select
      </Dropdown.Toggle>

      <Dropdown.Menu id="staylisting-dropdown-menu" className='border-thin'>
        <p style={{margin: '0rem', padding: '0.75rem 0.5rem', borderRadius: '10px 10px 0 0', textAlign: 'right', fontWeight: '600', backgroundColor: 'black', color: '#f7e700'}}>How many rooms?</p>
        <Dropdown.Item onClick={_handleChange}>1</Dropdown.Item>
        <Dropdown.Item onClick={_handleChange}>2</Dropdown.Item>  
        <Dropdown.Item onClick={_handleChange}>3</Dropdown.Item>
        <Dropdown.Item onClick={_handleChange}>4</Dropdown.Item>
        <Dropdown.Item onClick={_handleChange}> 5</Dropdown.Item>
        <Dropdown.Item onClick={_handleChange}>6</Dropdown.Item>
        <Dropdown.Item onClick={_handleChange}>7</Dropdown.Item>
        <Dropdown.Item onClick={_handleChange}>8</Dropdown.Item>

      </Dropdown.Menu>
    </Dropdown>
  );
}

export default DropDown;