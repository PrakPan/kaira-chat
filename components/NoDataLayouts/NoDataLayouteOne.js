import styled from 'styled-components'

const Container = styled.div`
          display: flex;

          &.center {
           justify-content: center;
           align-items:center; 
           height:100%;
          }
`

const Heading = styled.div`
    color: #eb4040;
    font-weight: 600;
`

function NoDataLayouteOne(props) {
    return (
        <>
            <Container className={props.class}>
                <Heading> {props.message} </Heading>
            </Container>
        </>
    )
}

export default NoDataLayouteOne;