import React from 'react';
import styled from 'styled-components'
import InfiniteScroll from 'react-infinite-scroll-component';


const Container  = styled.div`
overflow: auto;
 height: 65vh;
width: 100%;
@media screen and (min-width: 768px) {
    height: 80vh;

}
`;

const InfiniteScroller = (props) =>{
   const _nextHandler = () => {

   }
     return(
        <Container               id="scrollableDiv"
        >
            <InfiniteScroll

  dataLength={props.dataLength} //This is important field to render the next data
  next={props.next}
  hasMore={props.hasMore}
  loader={<div>loading</div> }
  scrollableTarget="scrollableDiv"
  endMessage={
     <div></div>
  }
  
>
{props.children}
</InfiniteScroll>
         </Container>
    );
 }

export default  (InfiniteScroller);