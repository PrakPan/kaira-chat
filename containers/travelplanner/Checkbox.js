import Form from 'react-bootstrap/Form';

function CheckExample() {
  return (
    <Form>
    
           <Form.Check 
           filledIn="true"
            type={'checkbox'}
            id={`planner-filter-checkbox`}
            label={'Checkbox'}
          />
 
      </Form>
  );
}

export default CheckExample;