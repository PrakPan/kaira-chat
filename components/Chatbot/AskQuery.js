import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import useChat from './hook/UseChat';
import Dictate from './Dictate';

const Container = styled.div`
  background: #F7F5F5;
  border-radius: 12px;
  padding: 12px;
`;

const QueryContainer = styled.div`
  border-radius: 12px;
  border: 1px solid #D7D7D7;
  padding: 16px 16px 8px 16px;
  background: #fff;
`;


const GrowTextAreaBox = styled.div`
    width: calc(100% - 40px);
    height: auto;
    position: absolute;
    background: #fff;
    bottom: 20px;
    overflow: hidden;
`

const AutoGrowTextarea = styled.textarea`
  width: 100%;
  font-size: 14px;
  background: #fff;
  line-height: 1.5rem; /* 24px */
  resize: none;
  overflow-y: auto;
  border: none;
  min-height: 1.5rem;
  max-height: calc(1.5rem * 3);
  box-sizing: border-box;
  font-family: Montserrat;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #aaa;
  }
`;


const ChipsContainer = styled.div`
   display:flex;
   margin-bottom: 10px;
   gap: 10px;
   flex-wrap: wrap;
`


const SingleChips = styled.button`
    border-radius: 50px;
    padding: 8px 12px;
    border: 1px solid #E0E0E0;
    font-family: Montserrat;
    font-weight: 500;
    font-size: 12px;
    background : #fff;
    color: #1889ED;
    white-space: nowrap
`

const SubmitButton = styled.button`
  &:disabled {      
   filter: grayscale(1);
    cursor: not-allowed;
  }
`


function AskQuery() {
    const { sendMessage, quickReplies, disableQuerySection } = useChat();
    const textareaRef = useRef(null);
    const [query, setQuery] = useState("");
    const [trackUserTyping, setUserTyping] = useState("");
    const [isSubmitDisabled, setSubmitDisabled] = useState(true);
    const dictateRef = useRef();

    const handleSubmitQuery = (input) => {
        const userMsg = { sender: "user", msg: input || query.trim() };
        sendMessage(userMsg);
        setQuery("");
        setSubmitDisabled(true);
        dictateRef.current.stop();
        if (textareaRef.current) {
            textareaRef.current.style.height = "1.5rem";
        }
    }

    const handleInput = (e) => {
        setQuery(e.target.value);
        setUserTyping(e.target.value);
        changeTextareaSize();
    };

    const changeTextareaSize = () => {
        const textarea = textareaRef.current;
        const queryValue = query;
        setSubmitDisabled(queryValue.trim() === "");

        if (textarea) {
            textarea.style.height = "auto";
            const scrollHeight = textarea.scrollHeight;
            const lineHeight = 24;
            const maxHeight = lineHeight * 3;
            textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
            textarea.scrollTop = textarea.scrollHeight;
        }
    }

    const handleTranscriptChange = (transcript) => {
        const newQuery = `${trackUserTyping} ${transcript}`
        setQuery(newQuery);
        changeTextareaSize();
    }

    const handleQuickReplies = (item) => {
        handleSubmitQuery(item);
    }

    const stopDictation = () => {
        setUserTyping(query);
    }

    return (
        <GrowTextAreaBox>
            <Container>
                <ChipsContainer>
                    {quickReplies.map((item, index) => <>
                        <SingleChips key={index} onClick={() => handleQuickReplies(item)} >
                            {item}
                        </SingleChips>
                    </>)}
                </ChipsContainer>
                <QueryContainer>
                    <form>
                        <AutoGrowTextarea
                            ref={textareaRef}
                            rows={1}
                            placeholder="Ask anything..."
                            value={query}
                            onChange={handleInput}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey && !disableQuerySection) {
                                    e.preventDefault();
                                    if (!isSubmitDisabled) {
                                        handleSubmitQuery();
                                    }
                                }
                            }}
                        />
                    </form>
                    <div className='flex items-center justify-between'>
                        <div> <img src="/assets/chatbot/add-icon.png" /> </div>
                        <div className="flex items-center gap-2">
                            <div> <Dictate ref={dictateRef} stopDictation={stopDictation} onTranscriptChange={handleTranscriptChange} /> </div>
                            <div className='flex'>
                                <SubmitButton disabled={isSubmitDisabled || disableQuerySection} onClick={(e) => {
                                    e.preventDefault();
                                    handleSubmitQuery()
                                }}><img src="/assets/chatbot/query-submit.png" /></SubmitButton>
                            </div>
                        </div>
                    </div>
                </QueryContainer>
            </Container>
        </GrowTextAreaBox>
    );
}

export default AskQuery;