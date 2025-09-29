import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import useChat from './hook/UseChat';
import Markdown from 'react-markdown';
import styles from "../../styles/Chatbot.module.css";
import ProductSlider from './product-slider/ProductSlider';
import media from '../../components/media';
import Image from 'next/image';
import useCachedImage from '../../hooks/useCachedImage';

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
   box-sizing: border-box;
`;

const MessageWrapper = styled.div`
  display: flex;
  justify-content: ${(props) => (props.isUser ? 'flex-end' : 'flex-start')};
  align-items: flex-start;
  gap: 10px;
`;

const Message = styled.div`
    background:  ${(props) => (props.isUser ? '#F2F2F2' : '')};
    border-radius: 7px;
    padding: ${(props) => (props.isUser ? ' 6px 12px' : '')};
    font-family: Montserrat;
    font-weight: 400;
    font-size: 14px;
    word-break: break-word;
    max-width: 80%;
    margin-bottom:15px
`;

const ChatMessage = React.memo(({ item }) => {
    const isUser = item.is_bot === false;
    const cachedAvatar = useCachedImage(
        "/assets/chatbot/chatbot-avaatar.svg",
        "chatbot-avatar",
        24 * 60 * 60 * 1000     
    );
    return (
        <MessageWrapper isUser={isUser}>
            
            {!isUser && cachedAvatar &&
                <Image
                    src={cachedAvatar}
                    alt="ticket"
                    width={26}
                    height={26}
                    className='mt-[8px]'
                />
            }
            
            <Message isUser={isUser}>
                <Markdown>{item.message}</Markdown>
            </Message>
        </MessageWrapper>
    );
});

function ChatSection(props) {
    let isPageWide = media("(min-width: 768px)");
    const { conversations, isTyping, currentBotMessage,lastProductSliderPosition } = useChat();
    const scrollRef = useRef(null);


    useEffect(() => {
        const scrollToBottom = () => {
            if (scrollRef.current) {
                scrollRef.current.scrollTo({
                    top: scrollRef.current.scrollHeight,
                    behavior: 'smooth',
                });
            }
        };

        const observer = new MutationObserver(() => {
            scrollToBottom();
        });

        if (scrollRef.current) {
            observer.observe(scrollRef.current, {
                childList: true,
                subtree: true,
            });
            scrollToBottom();
        }

        return () => {
            observer.disconnect();
        };
    }, []);


    return (
        <Container ref={scrollRef} className={styles.chatWrapper}>
            <div className="chat-section" >
                {conversations.map((chatObj, idx) => (
                    chatObj?.type && chatObj?.data?.length > 0 ?
                        <div key={idx} style={{ width: isPageWide ? "calc(50vw - 160px)" : 'calc(100vw - 50px)' }}>
                            <ProductSlider data={chatObj?.data}
                                type={chatObj?.type}
                                slidesPerView={4}
                                navigationButtons={true}
                                pageDots={false}
                                position={chatObj.position}
                                isDisabled={chatObj.position < lastProductSliderPosition}
                            />
                        </div>
                        :
                        < ChatMessage key={idx} item={chatObj} ></ChatMessage>
                ))}

                {currentBotMessage && (
                    < ChatMessage item={{ 'is_bot': true, 'message': currentBotMessage }}></ChatMessage>
                )}

                {isTyping && <div className={styles.typingIndicator}> <div className={styles.typingDots}>
                    <span></span><span></span><span></span>
                </div> <span className={styles.thinking}>Bot is thinking...</span></div>}
            </div>
        </Container>
    );
}

export default ChatSection;
