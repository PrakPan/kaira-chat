import React from 'react'
import useMediaQuery from '../../hooks/useMedia';

const Buttons = () => {
  const isDesktop = useMediaQuery("(min-width:767px)");
  return (
    <div className='flex gap-[20px] w-full max-h-[100vh] overflow-y-auto'>
        <button className={`${isDesktop ? 'MediumIndigoOutlinedButton' : 'MediumIndigoOutlinedButton w-1/2'}`}>Edit Route</button>
        <button className={`${isDesktop ? 'MediumIndigoButton' : 'MediumIndigoButton w-1/2'}`}>Update</button>
    </div>
  )
}

export default Buttons