import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import useChat from './hook/UseChat';
import Markdown from 'react-markdown';
import styles from "../../styles/Chatbot.module.css";

const Container = styled.div`
   height: calc(100% - 270px);
   margin-top: 10px;
   padding: 10px 0px;
   overflow-y: auto;
   display: flex;
   flex-direction: column;
   gap: 10px;
   flex: 1;
   scroll-behavior: smooth;
   font-family: Montserrat;
`;

const MessageWrapper = styled.div`
  display: flex;
  justify-content: ${(props) => (props.isUser ? 'flex-end' : 'flex-start')};
`;

const Message = styled.div`
    background:  ${(props) => (props.isUser ? '#F2F2F2' : '#FAFAFA')};
    border-radius: 7px;
    padding: 6px 12px;
    font-family: Montserrat;
    font-weight: 400;
    font-size: 14px;
    word-break: break-word;
    max-width: 80%;
    margin-bottom:15px
`;

const ChatMessage = React.memo(({ item }) => {
    const isUser = item.sender === 'user';
    return (
        <MessageWrapper isUser={isUser}>
            <Message isUser={isUser}>
                <Markdown>{item.msg}</Markdown>
            </Message>
        </MessageWrapper>
    );
});

function ChatSection(props) {
    const { conversations, isTyping, currentBotMessage } = useChat();

    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [conversations, currentBotMessage, isTyping]);

    return (
        <Container ref={scrollRef} className={styles.chatWrapper}>
            <div className="chat-section">
                {conversations.map((chatObj, idx) => (
                    < ChatMessage key={idx} item={chatObj} ></ChatMessage>
                ))}

                {currentBotMessage && (
                    < ChatMessage item={{ 'sender': 'bot', 'msg': currentBotMessage }}></ChatMessage>
                )}

                {isTyping && <div className={styles.typingIndicator}> <div className={styles.typingDots}>
                    <span></span><span></span><span></span>
                </div> <span className={styles.thinking}>Bot is thinking...</span></div>}
            </div>

        </Container>
    );
}

export default ChatSection;
