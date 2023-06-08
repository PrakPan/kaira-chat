import React from 'react';
import styled from 'styled-components';

// import {BsDot} from 'react-icons/bs'

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 2rem;
`;

const Address = styled.div``;
const Location = (props) => {
  // const [ammenities, setAmmenities] = useState(null);
  // useEffect(() => {

  //   }, []);
  return (
    <Container>
      <Address>
        <p className="font-lexend" style={{ fontWeight: '300' }}>
          {props.data.addr1}
        </p>
        <p className="font-lexend" style={{ fontWeight: '300' }}>
          {props.data.addr2}
        </p>
      </Address>
    </Container>
  );
};

export default Location;
