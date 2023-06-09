import styled from 'styled-components';
import Enquiry from '../tailoredform/Index';
import WhyPlanWithUs from './Index';

const Container = styled.div`
  margin-inline: 5px;

  @media screen and (min-width: 768px) {
    margin-inline: 0px;
    display: grid;
    grid-template-columns: auto 400px;
    grid-column-gap: 2rem;
  }
`;

const PlanWithUs = (props) => {
  return (
    <Container>
      <WhyPlanWithUs />
      <div className="hidden-mobile" style={{ width: '400px' }}>
        <Enquiry
          page_id={props.page_id}
          destination={props.destination}
          destinationType={props.destinationType}
          //  cities={props.cities}
        ></Enquiry>
      </div>
    </Container>
  );
};

export default PlanWithUs;
