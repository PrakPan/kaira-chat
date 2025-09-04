import React from 'react'
import { Heading1SB } from '../../new-ui/headings'
import Image from 'next/image'
import { MediumIndigoButton } from '../../new-ui/Buttons'
import Login from '../../modals/Login'
import { useDispatch, useSelector } from 'react-redux'
import { authCloseLogin, authShowLogin } from '../../../store/actions/auth'
import { useRouter } from 'next/router'

const SlideFive = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const showLogin = useSelector((state) => state.auth.showLogin)
  const onHide = () => dispatch(authCloseLogin());
  const handleLogin = () => {
    dispatch(authShowLogin());
  }
  return (
    <div className='-mt-[22px] flex flex-col items-center gap-[74px]'>
      <Heading1SB className='text-[#6E757A]'>Just one last step — sign up and we'll whip up your itinerary!</Heading1SB>
      <Image src={'/checkmark.svg'} width={128} height={128} />
      <MediumIndigoButton className='!w-[232px] text-white' onClick={handleLogin}>Proceed to Login</MediumIndigoButton>
      <div id="login" className="width-[100%] z-[1650]">
        <Login
          show={showLogin}
          onhide={onHide}
          zIndex={"3300"}
          onSuccess={props.completeItineraryCreate}
        />
      </div>
    </div>
  )
}

export default SlideFive