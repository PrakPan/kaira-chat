import React from 'react'
import useMediaQuery from '../../hooks/useMedia';
import { useRouter } from 'next/router';
import Button from '../ui/button/Index';
const Buttons = (props) => {
  const isDesktop = useMediaQuery("(min-width:767px)");
  const router = useRouter();
  return (
    <div className={`flex gap-[20px] ${props?.isEdit ? 'w-full justify-between gap-2' : 'w-full'} `}>
        <button onClick={props.handleCancel} className={`${isDesktop ? 'MediumIndigoOutlinedButton text-[14px] ' : 'MediumIndigoOutlinedButton w-1/2 text-[14px]'}`}>Cancel</button>
        <Button
                    fontSizeDesktop="14px"
                    width={!isDesktop ? "50%" : props?.isEdit ? '300px':"300px"}
                     height="40px"
                    fontWeight="500"
                    borderRadius="8px"
                    bgColor="#07213A"
                    onclick={props.handleUpdate}
                    loading={props.isLoading}
                    disabled={props.isLoading}
                    color="white"
                    padding="8px 16px"
                    fontSize="12px"
                  >
                   {props?.isEdit ? "Update Itinerary":"Continue"}
                  </Button>
        {/* <button onClick={props.handleUpdate} className={`MediumIndigoButton ${!isDesktop ? 'w-1/2' : ''}`}>Update</button> */}
    </div>
  )
}

export default Buttons