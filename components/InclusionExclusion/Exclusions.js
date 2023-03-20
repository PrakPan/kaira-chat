import React from 'react';
import ExElementContainer from './containers/ExElementContainer';
import { MainHeading } from './InclusionExclusionStyled';

const Exclusions = (props) => {
  return (
    <div>
      <MainHeading size={'1.4rem'} style={{ paddingBottom: '10px' }}>
        Exclusions
      </MainHeading>

      <ExElementContainer info={props.info} Idxs={props.flightsIds} />
    </div>
  );
};

export default Exclusions;
