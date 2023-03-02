import React from 'react';
import {Modal} from 'react-bootstrap';
// import Personalise from '../../containers/personaliseform/Index';
import styled from 'styled-components';
// const Body=styled(Modal.Body)`
//     border-style: solid;
//     border-color: #f7e700;
//     border-width: 0.5rem;
//     position: relative;
//   `;

const Details = (props) => {
  

  return(
      <div>
        {/* <Modal show={props.showPersonaliseModal}  onHide={props.handlePersonaliseClose} size="xl"> */}
        <Modal centered  show={props.show} size="md" onHide={props.hide} className="detals-modal">
            {/* <Modal.Header closeButton style={{borderStyle: "solid solid none solid", borderColor: "#F7e700", borderWidth: "0.5rem"}}></Modal.Header> */}
            <div className="">
                {
                    props.children
                }
            </div>
      </Modal>
      </div>
  );

}

export default Details;