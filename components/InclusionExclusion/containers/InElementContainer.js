import React from 'react'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io'
import { ColElementContainer, LinkComp, MainHeading, RowElementContainer, SubHeading } from '../InclusionExclusionStyled'

const InElementContainer = (props) => {
  return (
    <RowElementContainer   style={{ paddingBottom: '10px' }}>
        <RowElementContainer>
          <IoMdCheckmarkCircleOutline
            style={{ fontWeight: '300', fontSize: '2rem', color: 'green' }}
          />

            <ColElementContainer style={{ paddingLeft: '12px' }}>
            <MainHeading size={'1.2rem'}>
              Stay ({props.info.meta_info.number_of_adults} Adults)
            </MainHeading>
            <ColElementContainer  >
              {props.Idxs.map(
                (idx, index) =>
                    (index < 3 ?
                    <SubHeading size={'0.9rem'}>
                    {props.info.costings_breakdown.[idx.id].detail.name}
                  </SubHeading>
                    : null)  
              )}
            
    
            </ColElementContainer>
          </ColElementContainer>
        </RowElementContainer>

        <LinkComp>View all</LinkComp>
      </RowElementContainer>
   
  )
}

export default InElementContainer