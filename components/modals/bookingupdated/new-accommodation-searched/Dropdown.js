import Dropdown from 'react-bootstrap/Dropdown';

function BasicExample() {
  return (
    <Dropdown  drop={'up'} >
      <Dropdown.Toggle  variant="success" id="staylisting-dropdown">
        Select
      </Dropdown.Toggle>

      <Dropdown.Menu id="staylisting-dropdown-menu">
        <p style={{margin: '0rem', padding: '0.5rem', textAlign: 'right', fontWeight: '600', backgroundColor: 'black', color: '#f7e700'}}>How many rooms?</p>
        <Dropdown.Item>1</Dropdown.Item>
        <Dropdown.Item>2</Dropdown.Item>
        <Dropdown.Item>3</Dropdown.Item>
        <Dropdown.Item>4</Dropdown.Item>
        <Dropdown.Item>5</Dropdown.Item>
        <Dropdown.Item>6</Dropdown.Item>
        <Dropdown.Item>7</Dropdown.Item>
        <Dropdown.Item>8</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default BasicExample;