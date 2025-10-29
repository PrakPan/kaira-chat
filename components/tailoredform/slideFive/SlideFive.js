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
  const handleLogin = () => {
    dispatch(authShowLogin());
  }
  return (
    <div className='-mt-[22px] flex flex-col items-center gap-[74px]'>
      <Heading1SB className='text-[#6E757A]'>Just one last step — sign up and we'll whip up your itinerary!</Heading1SB>
      <Image src={'/checkmark.svg'} width={128} height={128} />
      <Button
                    fontSize="1rem"
                    width={"auto"}
                    padding="8px"
                    fontWeight="500"
                    margin="30px 0"
                    borderRadius="8px"
                    bgColor="#07213A"
                    onclick={handleLogin}
                    loading={props.isloading}
                    disabled={props.isloading}
                    height="40px"
                    color="white"
                  >
                    Proceed to Login
                  </Button>
    </div>
  )
}

export default SlideFive