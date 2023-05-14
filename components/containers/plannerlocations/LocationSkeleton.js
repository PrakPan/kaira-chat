import React from 'react'
import styled from 'styled-components'
import SkeletonCard from '../../ui/SkeletonCard'

const DesktopContainer = styled.div`
display : grid;
grid-template-columns : repeat(6,1fr);
gap : 1rem;
margin-inline : 8px;
`

const MobileContainer = styled.div`
display : grid;
grid-template-columns : 1fr 1fr;
gap : 0.6rem;
margin : 1rem;
`

const DesktopCard = Array(6).fill(<SkeletonCard      
   width={"auto"}
   height={'35vh'}
   borderRadius={'0.5rem'}
  lottieDimension = {'35vh'}
   />)

   const MobileCard = Array(4).fill(<SkeletonCard      
      width={"auto"}
      height={'35vh'}
      borderRadius={'0.5rem'}
     lottieDimension = {'35vh'}
      />)

const DesktopSkeleton = (props) => {

    return (
      <DesktopContainer>
        {DesktopCard.map((e, i) => (
          <div key={i}>{e}</div>
        ))}
      </DesktopContainer>
    );
}

export const MobileSkeleton = (props)=>{
   return (
     <MobileContainer>
       {MobileCard.map((e, i) => (
         <div key={i}>{e}</div>
       ))}
     </MobileContainer>
   );
}



export default DesktopSkeleton