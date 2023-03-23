import React from 'react'
import ImageLoader from '../../../components/ImageLoader'
import { Container, Timecontainer, TransferInfo, TransparentButton, TransportContainer } from './New_itenaryStyled'

const TransferElements = (props) => {
  return (
    <Container>
        <Timecontainer>
            <div>{props.time}</div>
            <div>{props.heading}</div>
            <div>
                <TransparentButton>

                </TransparentButton>
            </div>
        </Timecontainer>
        <TransportContainer>
            <div>

              <ImageLoader url={props.icon} leftalign dimensions={{width: 200, height: 200}} width="1.25rem" widthmobile="1.25rem" ></ImageLoader>
            </div>
            <div>
                <div>{props.transfers.routes[0].legs[0].origin.shortName} - {props.transfers.routes[0].legs[0].destination.shortName}</div>
                <div>Buration: </div>
            </div>
        </TransportContainer>
        <TransferInfo>
    {props.text     }
        </TransferInfo>
    </Container>
  )
}

export default TransferElements