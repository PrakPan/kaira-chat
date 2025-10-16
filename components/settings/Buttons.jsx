import React from 'react'
import useMediaQuery from '../../hooks/useMedia';
import { useRouter } from 'next/router';
const Buttons = (props) => {
  const isDesktop = useMediaQuery("(min-width:767px)");
  const router = useRouter();
  return (
    <div className='flex gap-[20px] '>
        <button onClick={() =>
              router.push({
                pathname: `/itinerary/${router?.query?.id}`,
                query: {
                  drawer: "handleEditRoute",
                },
              })
            } className={`${isDesktop ? 'MediumIndigoOutlinedButton' : 'MediumIndigoOutlinedButton w-1/2'}`}>Edit Route</button>
        <button onClick={props.handleUpdate} className={`${isDesktop ? 'MediumIndigoButton' : 'MediumIndigoButton w-1/2'}`}>Update</button>
    </div>
  )
}

export default Buttons