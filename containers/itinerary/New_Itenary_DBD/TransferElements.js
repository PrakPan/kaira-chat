import React from 'react'
import ImageLoader from '../../../components/ImageLoader'
import { Container,Line, Timecontainer, TransferInfo, TransparentButton, TransportContainer } from './New_itenaryStyled'
import { convertNumToTime } from '../../../helper/convertNumToTime'
import { formatNumber } from '../../../helper/formatNumber'
const TransferElements = (props) => {
  return (
    <>
    <Container>
        <Timecontainer>
            <div>{props.time}</div>
            <div>{props.heading}</div>
            <div>
            {props.meta ?  <TransparentButton>
                {props.modes?`${props.modes} From `:null } ₹{formatNumber(props.meta.estimated_cost)}
                </TransparentButton>: null }
              
            </div>
        </Timecontainer>
        <TransportContainer>
            <div style={{paddingRight: '10px'}}>

              <ImageLoader url={props.icon}  leftalign dimensions={{width: 200, height: 200}} width="1.25rem" widthmobile="1.25rem" ></ImageLoader>
            </div>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <div>{props.transfers.routes[0]?.legs[0].origin.shortName} - {props.transfers.routes[0]?.legs[0].destination.shortName}</div>
                {props.meta ? <div>Duration: {convertNumToTime(props.meta.duration)}</div> : null } 
            </div>
        </TransportContainer>
        <TransferInfo>
    {props.text     }
        </TransferInfo>
        
    </Container>
    <Line></Line>
    <Container style={{fontSize: '14px', fontWeight: '500'}}>
      <TransportContainer>
      <div>{props.time}</div>
      <div style={{paddingLeft: '10px'}}>

              <ImageLoader url={props.icon}  leftalign dimensions={{width: 200, height: 200}} width="1.25rem" widthmobile="1.25rem" ></ImageLoader>
            </div>
      </TransportContainer>
    
    <div >Arrive in {props.newcity.city_name}</div>
    
    </Container>
    <Line></Line>
    </>
    
  )
}

export default TransferElements