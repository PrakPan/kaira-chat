
import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import styled from 'styled-components';


// Matches `.chat-icon-btn` from the chat-active-v2.html reference:
// 28×28 transparent square button with ink-4 glyph, ink hover with bg-2,
// 7px corner radius, and a 15×15 SVG. Recording state swaps to coral-deep
// (the design-system red accent) with a soft halo + pulse.
const Button = styled.button`
  width: 28px;
  height: 28px;
  background: transparent;
  border: 0;
  border-radius: 7px;
  color: #8a93a6;
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: color 0.15s ease, background 0.15s ease;
  padding: 0;
  flex-shrink: 0;

  &:hover { color: #0b1220; background: #fafaf5; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }

  svg { width: 15px; height: 15px; display: block; }

  &.stop {
    color: #e85a4f;
    background: #fff4e8;
    box-shadow: 0 0 0 2px rgba(232, 90, 79, 0.18);
    animation: dictatePulse 1.2s ease-in-out infinite;
  }
  &.stop:hover { color: #c84439; background: #ffe6d3; }

  @keyframes dictatePulse {
    0%, 100% { box-shadow: 0 0 0 2px rgba(232, 90, 79, 0.18); }
    50%      { box-shadow: 0 0 0 4px rgba(232, 90, 79, 0.05); }
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
        // Auth/ownership gate — mirror MessageInputBox's textarea/attach/send.
        // A blocked user (logged-out, or viewing someone else's itinerary) must
        // not be able to dictate either; surface the same prompt instead.
        if (props?.requireAuth) {
            props.onAuthRequired?.();
            return;
        }
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


    // Matches the `.chat-icon-btn[title="Voice"]` SVG from chat-active-v2.html:
    // a stroked microphone capsule with the curved base + stand stem. Uses
    // `currentColor` so the Button's color tokens drive it.
    const MicIconSvg = (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="9" y="2" width="6" height="12" rx="3" />
            <path d="M19 10a7 7 0 0 1-14 0M12 19v3" />
        </svg>
    );

    // Recording state shares the mic glyph (so the active state still reads
    // as a mic) but the Button's `.stop` class swaps the surface to coral
    // with the soft pulsing halo defined in styled-components above.
    return (
        <>
            {!listening && (
                <Button type="button" onClick={startListening} title="Voice" aria-label="Start dictation" disabled={props?.disabled}>
                    {MicIconSvg}
                </Button>
            )}
            {listening && (
                <Button type="button" className="stop" onClick={stopListening} title="Stop dictation" aria-label="Stop dictation">
                    {MicIconSvg}
                </Button>
            )}
        </>
    );
});
export default Dictate;
