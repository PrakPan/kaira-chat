import React from 'react'
import { Heading1SB } from '../../new-ui/headings'
import Image from 'next/image'
import { MediumIndigoButton } from '../../new-ui/Buttons'
import Login from '../../modals/Login'
import { useDispatch, useSelector } from 'react-redux'
import { authCloseLogin, authShowLogin } from '../../../store/actions/auth'
import { useRouter } from 'next/router'
import Button from "../../ui/button/Index"
import useMediaQuery from '../../../hooks/useMedia'
const SlideFive = (props) => {
  const dispatch = useDispatch();
  const isPageWide = useMediaQuery("(min-width:767px)");
  const router = useRouter();
  const handleLogin = () => {
    dispatch(authShowLogin());
  }
  return (
    <div className='-mt-[22px] flex flex-col items-center gap-[74px] mt-2xl'>
      {/* <div className='tex-center text-[#6E757A]'>Just one last step — sign up and we'll whip up your itinerary!</div> */}
      <Image src={'/checkmark.svg'} width={128} height={128} />

      <div className='flex gap-md flex-col items-center justify-center text-center'>
        <div className='text-lg font-600'> Your trip is being planned </div>
        <div className='text-md font-400 leading-xl text-spacegrey'>Our AI is crafting the perfect itinerary based on your preferences. You will receive that soon.</div>
        {!localStorage.getItem("access_token") ? <Button
          fontSize="1rem"
          fontWeight="500"
          margin="30px 0"
          borderRadius="8px"
          bgColor="#07213A"
          onclick={handleLogin}
          loading={props.isloading}
          disabled={props.isloading}
          height="50px"
          color="white"
          width={`300px`}
        >
          Proceed to Login
        </Button> : <Button
          fontSize="1rem"
          fontWeight="500"
          margin="30px 0"
          borderRadius="8px"
          bgColor="#07213A"
          onclick={()=>router.push("/")}
          loading={props.isloading}
          disabled={props.isloading}
          height="50px"
          color="white"
          width={`300px`}
        >
          Back to Home 
        </Button>}
      </div>
    </div>
  )
}

export default SlideFive