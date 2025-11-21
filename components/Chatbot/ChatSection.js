import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import useChat from './hook/UseChat';
import Markdown from 'react-markdown';
import styles from "../../styles/Chatbot.module.css";
import ProductSlider from './product-slider/ProductSlider';
import media from '../../components/media';
import Image from 'next/image';
import useCachedImage from '../../hooks/useCachedImage';
import { authShowLogin } from '../../store/actions/auth';
import { useDispatch, useSelector } from 'react-redux';

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

const LoginButton = styled.button`
    background: #F7E700;
    padding: 10px 16px;
    width:131px;
    height:40px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
`;

const ChatMessage = React.memo(({ item, cachedAvatar }) => {
    const isUser = item.is_bot === false;
    const { finalized_status } = useSelector((state) => state.ItineraryStatus);
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
    const dispatch = useDispatch();
    let isPageWide = media("(min-width: 768px)");
    const { conversations, isTyping, currentBotMessage,lastProductSliderPosition } = useChat();
    const { finalized_status } = useSelector((state) => state.ItineraryStatus);
    const scrollRef = useRef(null);
    const cachedAvatar = useCachedImage(
        "/assets/chatbot/chatbot-avaatar.svg",
        "chatbot-avatar",
        24 * 60 * 60 * 1000     
    );

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

    const handleShowLogin=()=>{
        dispatch(authShowLogin());
    }


    return (
        <Container ref={scrollRef} className={styles.chatWrapper}>
            <div className="chat-section" >
                {!localStorage.getItem("access_token")?<div className='flex items-start gap-2 '>
                    {cachedAvatar &&
                        <Image
                            src={cachedAvatar}
                            alt="ticket"
                            width={26}
                            height={26}
                        />
                    }
                    <div>
                        <div className="Body2R_14">I can see you're not logged in. Please log in to continue </div>
                        <div className="Body2R_14">chatting and unlock your personalized travel experience.</div>
                        <LoginButton onClick={handleShowLogin} className='mt-[24px]'>
                            Login/Signup
                        </LoginButton>
                    </div>
                </div>:
                <>
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
                        < ChatMessage key={idx} item={chatObj} cachedAvatar={cachedAvatar} ></ChatMessage>
                ))}

                {currentBotMessage && (
                    < ChatMessage item={{ 'is_bot': true, 'message': currentBotMessage }} cachedAvatar={cachedAvatar}></ChatMessage>
                )}

                {isTyping && <div className={styles.typingIndicator}>  <span className={styles.thinking}>{conversations.length > 0 ? "" :  "Analyzing your Itinerary"}    <div className={styles.typingDots}>
                    <span></span><span></span><span></span>
                </div></span></div>}
                {finalized_status=="PENDING" && <div className={styles.typingIndicator}><span className={styles.thinking}>Fetching your itinerary<div className={styles.typingDots}><span></span><span></span><span></span></div> </span></div>}
                </>
                }
                
            </div>
        </Container>
    );
}

export default ChatSection;
