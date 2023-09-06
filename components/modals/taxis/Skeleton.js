import React from 'react'
import styled from 'styled-components';
const Container = styled.div`
  min-height: 40vh;
  overflow-x: hidden;
  width: 97%;
  position: relative;
  margin: auto;
`;
const SkeletonContainer = styled.div`
  min-height: 40vh;
  border-radius: 10px;
  margin-bottom: 0.5rem;
  display: grid;
  grid-template-columns: 7.5rem auto;
`;
function Skeleton() {
  return (
      <Container>
          <SkeletonContainer className='border'>
              <div
          className="center-dv"
          style={{
            padding: "0.75rem 0rem",
            borderColor: "rgba(238, 238, 238, 1)",
            borderWidth: "1px",
            borderStyle: "none solid none none",
          }}
              >
                  <div style={{border : '1px solid red'}}></div>
              </div>
              <div></div>
          </SkeletonContainer>
    </Container>
  )
}

export default Skeleton