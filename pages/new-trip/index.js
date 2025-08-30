import React from 'react'
import TailoredForm from "../../components/tailoredform/Index"
import NavigationMenu from '../../components/revamp/home/NavigationMenu'
const NewTrip = () => {
  return (
    <div className='h-[100vh] w-[100vw]'>

      <NavigationMenu />
      <div className="flex-1 overflow-auto  md:px-[16px] max-w-[1440px] mx-auto w-full">
        <TailoredForm />
      </div>
    </div>
  )
}

export default NewTrip