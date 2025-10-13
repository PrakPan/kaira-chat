import React from 'react'
import useMediaQuery from '../../hooks/useMedia';

const Buttons = (props) => {
  const isDesktop = useMediaQuery("(min-width:767px)");
  return (
    <div className='flex gap-[20px] '>
        <button onClick={props.handleCancel} className={`${isDesktop ? 'MediumIndigoOutlinedButton' : 'MediumIndigoOutlinedButton w-1/2'}`}>Cancel</button>
        <button onClick={props.handleUpdate} className={`${isDesktop ? 'MediumIndigoButton' : 'MediumIndigoButton w-1/2'}`}>Update</button>
    </div>
  )
}

export default Buttons