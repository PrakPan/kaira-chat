import React from 'react'

function StepsProgress(props) {
    console.log(props)
    return (
<div>
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
      x2={((props.slideIndex ) / props.totalSlides) * 100} 
      y2="10"
      stroke="#F7E700"
      strokeWidth="8"
    
    />
 
  </svg>
</div>


    )
}

export default StepsProgress;