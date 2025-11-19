import React from 'react'
import useMediaQuery from '../../hooks/useMedia';
import { useRouter } from 'next/router';
import Button from '../ui/button/Index';
const Buttons = (props) => {
  const isDesktop = useMediaQuery("(min-width:767px)");
  const router = useRouter();
  return (
    <div className={`flex gap-[20px] `}>
        <button onClick={props.handleCancel} className={`${isDesktop ? 'MediumIndigoOutlinedButton' : 'MediumIndigoOutlinedButton w-1/2'}`}>Cancel</button>
        <Button
                    fontSize="1rem"
                    width={!isDesktop ? "50%" : props?.isEdit ? 'w-fit':"131px"}
                     height="40px"
                    fontWeight="500"
                    borderRadius="8px"
                    bgColor="#07213A"
                    onclick={props.handleUpdate}
                    loading={props.isLoading}
                    disabled={props.isLoading}
                    color="white"
                  >
                   {props?.isEdit ? "Update Itinerary":"Continue"}
                  </Button>
        {/* <button onClick={props.handleUpdate} className={`MediumIndigoButton ${!isDesktop ? 'w-1/2' : ''}`}>Update</button> */}
    </div>
  )
}

export default Buttons