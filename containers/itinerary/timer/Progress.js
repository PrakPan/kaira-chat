
import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import ImageLoader from '../../../components/ImageLoader';
const ProgressContainer = styled.div`
    margin: 1rem 0;
`;

const Progress = (props) => {
    const [progress, setProgress] = useState(0);
  const [load, setLoad] = useState(false);
    const messages = [
      "Finding the ideal route for you",
      "Compiling the best stays and activities", 
        "Negotiating for the best pricing",


    ];
    // const gifs = ['media/gifs/Activity-300x300.gif', 'media/gifs/nrgotiate-300x300.gif', 'media/gifs/Route-300x300.gif', 'media/gifs/Route-300x300.gif'];
    // const gifs = [GIF, GIF2, GIF3];

   
    return (
      <ProgressContainer>
           {/* <ImageLoader url={gifs[progress]} width="8rem" dimensions={{width: 300, height: 300}} style={{width: '8rem', display: 'block', margin: '2rem auto 0.5rem auto'}}></ImageLoader> */}
           {/* {progress === 0 ? <img src={gifs[0]} style={{width: '8rem', display: 'block', margin: '2rem auto 0.5rem auto'}}></img> : null} */}
           {/* {progress === 1 ?<img src={gifs[1]} style={{width: '8rem', display: 'block', margin: '2rem auto 0.5rem auto'}}></img>: null} */}
           {/* {progress === 2 ?<img src={gifs[2]} style={{width: '8rem', display: 'block', margin: '2rem auto 0.5rem auto'}}></img>: null} */}
           {/* <img src={combinedGIF} style={{width: '8rem', display: 'block', margin: '2rem auto 0.5rem auto'}} onLoad={() => setLoad(true)}></img> */}

            <p className="font-nunito" style={{textAlign: 'center', fontWeight: '300', letterSpacing: '1px'}}>
              {/* <span className="font-quote" style={{margin: '0rem 0.25rem 0 0', fontSize: '1.25rem'}}>&#8220;</span> */}
            {load ? <em className="font-lexend">{messages[progress]}</em> : null}
            {/* <span className="font-quote"  style={{margin: '-1rem 0 0 0.25rem', fontSize: '1.25rem'}}>&#8221;</span> */}
            </p>
      </ProgressContainer>
    );
  }

export default React.memo(Progress);