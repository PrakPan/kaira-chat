
import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
const ProgressContainer = styled.div`
    margin: 1rem 0;
`;

const Progress = (props) => {
    const [progress, setProgress] = useState(0);
  
    const messages = [
      "Finding the ideal route for you",
      "Compiling the best stays and activities", 
        "Negotiating for the best pricing",


    ];
    // const gifs = ['media/gifs/Activity-300x300.gif', 'media/gifs/nrgotiate-300x300.gif', 'media/gifs/Route-300x300.gif', 'media/gifs/Route-300x300.gif'];
    // const gifs = [GIF, GIF2, GIF3];

    useEffect(() => {
       const progressId = 
       setInterval(function(){
     if(progress === 2) setProgress(0)
      else setProgress(progress+1);
    }, 1500);
 return () => {
    clearInterval(progressId);
    // clearInterval(timerId)
}      });

    return (
      <ProgressContainer>
           {/* <img src={GIF2} style={{width: '8rem', display: 'block', margin: '2rem auto 0.5rem auto'}}></img> */}
            <p className="font-nunito" style={{textAlign: 'center', fontWeight: '300', letterSpacing: '1px'}}>
            <em className="font-lexend">{'Negotiating for the best pricing'}</em> 
            </p>
      </ProgressContainer>
    );
  }

export default React.memo(Progress);