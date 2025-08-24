
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
        return <span>Browser doesn't support speech recognition.</span>;
    }


    return (
        <>
            {!listening && <Button onClick={startListening}><MicIcon style={{ fontSize: '20px', width: '20px', height: '20px' }} /></Button>}
            {listening && <Button className="stop" onClick={stopListening}><StopCircleTwoToneIcon style={{ fontSize: '20px', width: '20px', height: '20px' }} /></Button>}
        </>
    );
});
export default Dictate;
