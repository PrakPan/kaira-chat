import React from 'react'

function StepsProgress({ slideIndex, totalSlides, steps }) {

  return (
    <div style={{ width: '100%' }}>
      <svg width="100%" height="20" viewBox="0 0 100 20" preserveAspectRatio="none">
        <line
          x1="0"
          y1="10"
          x2="100"
          y2="10"
          stroke="#F0F0F0"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <line
          x1="0"
          y1="10"
          x2={(slideIndex / totalSlides) * 100}
          y2="10"
          stroke="#F7E700"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </svg>


    <div className='flex gap-sm justify-between mt-sm max-ph:hidden'>
        {steps.map((step, index) => (
          <div 
          className={`bg-text-white text-sm font-400 leading-sm-md ${slideIndex >= index + 1 ? 'text-text-spacegrey' : 'text-text-disabled'} `}
            key={index}
            style={{
              textAlign: 'center',
              width: `${100 / totalSlides}%`
            }}
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  )
}

export default StepsProgress;