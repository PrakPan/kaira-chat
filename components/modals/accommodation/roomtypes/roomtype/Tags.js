import React from 'react';
import styled from 'styled-components';
const Container = styled.div`
display: flex;
gap: 0.25rem;
@media screen and (min-width: 768px){
    
}
`;

const Tag = styled.div`
    background-color: hsl(0,0%,95%);
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    border-radius: 5px;
`;
const Tags = (props) => {
  

  return(
      <Container>
           {props.data.room_view.length ? <Tag className='font-lexend'>{props.data.room_view[0].ViewName}</Tag> : <Tag className='font-lexend'>{'No View'}</Tag>}
           <Tag  className='font-lexend'>250 sq ft</Tag>
           {props.data.bed_type.length ? <Tag  className='font-lexend'>{props.data.bed_type[0].BedName}</Tag> : null}
     </Container>
  );

}

export default Tags;