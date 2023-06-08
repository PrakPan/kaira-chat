import React from 'react';

import Spinner from '../components/Spinner';
import LoaderContainer from '../containers/loaderbar/Index';
const loaderpage = () => {
  return (
    <div className="w-full h-full">
      <LoaderContainer></LoaderContainer>
    </div>
  );
};

export default loaderpage;
