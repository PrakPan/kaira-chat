import React from 'react';
import styled from 'styled-components';


const P = styled.p`
    
   
      font-weight: 300;
      text-align: center;
      @media screen and (min-width: 768px) {
        text-align: left;
       font-size:1.25rem ;
        /* font-size: ${props => props.theme.fontsizes.desktop.text.three}; */
      }
    `;
    const Li = styled.li`
     font-size: 1.25rem;
     /* font-size: ${props => props.theme.fontsizes.desktop.text.three};   */
      font-weight: 300;
  
    `;
const TextBox= (props) => {
    
    if(props.type === "list"){
      let list=[];
      for(var i=0; i<props.data.length ; i ++){
        list.push(<Li className="font-nunito">{props.data[i]}</Li>)
      }
      return(
        <div className="font-opensans">
          <ul>
            {list}
          </ul>
        </div>
      );
    }
    else if(props.type==="text")
    return(
        <div>
          <P className="font-nunito" dangerouslySetInnerHTML={{__html: props.text }}></P>
        </div>
  ); 
}

export default TextBox;
