import React from 'react'
import TailoredForm from "../../components/tailoredform/Index"
import NavigationMenu from '../../components/revamp/home/NavigationMenu'
import TrustFactor from '../../components/tailoredform/TrustFactor'
const NewTrip = () => {
  return (
    <div>
      <NavigationMenu />
      <div className='h-[calc(100vh_-_144px)] w-[100vw] bg-primary-cornsilk overflow-y-auto'>

        <div className="flex-1 md:px-[16px] max-w-[1440px] mx-auto w-full">
          <TailoredForm />
        </div>
        <div className='fixed bottom-0 w-100 z-[1] bg-primary-cornsilk'>
          <TrustFactor />
        </div>
      </div>
    </div>
  )
}

export default NewTrip