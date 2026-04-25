
import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import MicIcon from '@mui/icons-material/Mic';
import StopCircleTwoToneIcon from '@mui/icons-material/StopCircleTwoTone';
import styled from 'styled-components';


const Button = styled.button` 
   width: 32px;
   height: 32px;
   border-radius: 50%;
   background: #eee;
   display: flex;
   align-items: center;
   justify-content: center; 

   &.stop {
      background: #BF3535;
      color:#fff;
   }
`

const Dictate = forwardRef((props, ref) => {
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();



    const startListening = async () => {
        if(props?.disabled){
            return;
        }
        try {
            const micPermission = await navigator.permissions.query({ name: 'microphone' });

            if (micPermission.state === 'granted' || micPermission.state === 'prompt') {
                SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
                return;
            }

            if (micPermission.state === 'denied') {
                alert(
                    'Microphone access is blocked. Please enable it from browser settings:\n' +
                    '1. Click the lock icon near the address bar.\n' +
                    '2. Set "Microphone" to "Allow".\n' +
                    '3. Refresh the page.'
                );
                return;
            }
        } catch (err) {
            console.error('Mic permission check failed:', err);
            SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
        }
    };


    const stopListening = () => {
        SpeechRecognition.stopListening();
        resetTranscript();
        props.stopDictation();
    }

    useImperativeHandle(ref, () => ({
        stop: stopListening
    }));

    useEffect(() => {
        if (props.onTranscriptChange && listening) {
            props.onTranscriptChange(transcript)
        }
    }, [transcript, props.onTranscriptChange])

    if (!browserSupportsSpeechRecognition) {
        return <span></span>;
    }


    return (
        <>
            {!listening && <Button onClick={startListening}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <g clip-path="url(#clip0_9587_10057)">
    <path d="M10.0026 16.6667C11.7701 16.6647 13.4646 15.9617 14.7145 14.7119C15.9643 13.462 16.6673 11.7675 16.6693 10V6.66667C16.6693 4.89856 15.9669 3.20286 14.7166 1.95262C13.4664 0.702379 11.7707 0 10.0026 0C8.23449 0 6.5388 0.702379 5.28856 1.95262C4.03832 3.20286 3.33594 4.89856 3.33594 6.66667V10C3.33792 11.7675 4.04094 13.462 5.29075 14.7119C6.54056 15.9617 8.2351 16.6647 10.0026 16.6667ZM10.0026 1.66667C11.1831 1.66886 12.3248 2.08822 13.226 2.85066C14.1272 3.61311 14.7299 4.66955 14.9276 5.83333H12.5026C12.2816 5.83333 12.0696 5.92113 11.9133 6.07741C11.7571 6.23369 11.6693 6.44565 11.6693 6.66667C11.6693 6.88768 11.7571 7.09964 11.9133 7.25592C12.0696 7.4122 12.2816 7.5 12.5026 7.5H15.0026V9.16667H12.5026C12.2816 9.16667 12.0696 9.25446 11.9133 9.41074C11.7571 9.56702 11.6693 9.77899 11.6693 10C11.6693 10.221 11.7571 10.433 11.9133 10.5893C12.0696 10.7455 12.2816 10.8333 12.5026 10.8333H14.9276C14.7317 11.9979 14.1295 13.0554 13.2279 13.8181C12.3263 14.5807 11.1835 14.9992 10.0026 14.9992C8.82167 14.9992 7.67895 14.5807 6.77731 13.8181C5.87567 13.0554 5.27347 11.9979 5.0776 10.8333H7.5026C7.72362 10.8333 7.93558 10.7455 8.09186 10.5893C8.24814 10.433 8.33594 10.221 8.33594 10C8.33594 9.77899 8.24814 9.56702 8.09186 9.41074C7.93558 9.25446 7.72362 9.16667 7.5026 9.16667H5.0026V7.5H7.5026C7.72362 7.5 7.93558 7.4122 8.09186 7.25592C8.24814 7.09964 8.33594 6.88768 8.33594 6.66667C8.33594 6.44565 8.24814 6.23369 8.09186 6.07741C7.93558 5.92113 7.72362 5.83333 7.5026 5.83333H5.0776C5.27533 4.66955 5.87804 3.61311 6.77925 2.85066C7.68045 2.08822 8.82214 1.66886 10.0026 1.66667Z" fill="#374957"/>
    <path d="M19.1667 10C18.9457 10 18.7337 10.0878 18.5774 10.2441C18.4211 10.4004 18.3333 10.6123 18.3333 10.8333C18.3311 12.8218 17.5402 14.7282 16.1342 16.1342C14.7282 17.5402 12.8218 18.3311 10.8333 18.3333H9.16667C7.17829 18.3309 5.27204 17.54 3.86604 16.134C2.46005 14.728 1.66909 12.8217 1.66667 10.8333C1.66667 10.6123 1.57887 10.4004 1.42259 10.2441C1.26631 10.0878 1.05435 10 0.833333 10C0.61232 10 0.400358 10.0878 0.244078 10.2441C0.0877974 10.4004 0 10.6123 0 10.8333C0.00286706 13.2636 0.969559 15.5935 2.68802 17.312C4.40648 19.0304 6.7364 19.9971 9.16667 20H10.8333C13.2636 19.9971 15.5935 19.0304 17.312 17.312C19.0304 15.5935 19.9971 13.2636 20 10.8333C20 10.6123 19.9122 10.4004 19.7559 10.2441C19.5996 10.0878 19.3877 10 19.1667 10Z" fill="#374957"/>
  </g>
  <defs>
    <clipPath id="clip0_9587_10057">
      <rect width="20" height="20" fill="white"/>
    </clipPath>
  </defs>
</svg></Button>}
            {listening && <Button className="stop" onClick={stopListening}><StopCircleTwoToneIcon style={{ fontSize: '20px', width: '20px', height: '20px' }} /></Button>}
        </>
    );
});
export default Dictate;
