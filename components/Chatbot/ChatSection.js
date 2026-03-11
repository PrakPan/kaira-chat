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
   height: calc(100% - 225px);
   margin-top: 10px;
   padding: 0px;
   overflow-y: auto;
   display: flex;
   flex-direction: column;
   gap: 10px;
   flex: 1;
   scroll-behavior: smooth;
   font-family: Montserrat;
   box-sizing: border-box;
   
   @media screen and (max-width: 767px) {
     flex: 1;
     height: auto;
     margin-top: 0;
     padding: 16px 16px 180px 16px;
     overflow-y: auto;
     overflow-x: hidden;
   }
   
   -ms-overflow-style: none;
   scrollbar-width: none;
   &::-webkit-scrollbar {
     display: none;
   }
`;

const MessageWrapper = styled.div`
  display: flex;
  justify-content: ${(props) => (props.isUser ? 'flex-end' : 'flex-start')};
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 16px;
`;

const Message = styled.div`
    background: ${(props) => (props.isUser ? '#fffaf5' : 'transparent')};
    border-radius: ${(props) => (props.isUser ? '12px' : '0')};
    padding: ${(props) => (props.isUser ? '10px 16px' : '0')};
    font-family: Inter, sans-serif;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: #0d0d0d;
    word-break: break-word;
    max-width: ${(props) => (props.isUser ? '85%' : '98%')};

    p {
      margin: 5px 0;
      font-size: 16px;
      line-height: 24px;
      opacity: 0.9;
    }

    ul {
      list-style-type: disc;
      padding-left: 20px;
      margin: 8px 0;
    }

    ol {
      list-style-type: decimal;
      padding-left: 20px;
      margin: 8px 0;
    }

    li {
      font-size: 16px;
      line-height: 24px;
      opacity: 0.9;
      margin: 4px 0;
    }

    strong, b {
      font-weight: 600;
      opacity: 1;
    }

    h1, h2, h3, h4, h5, h6 {
      font-size: 16px;
      font-weight: 600;
      margin: 8px 0 4px 0;
      line-height: 1.4;
    }

    code {
      background: #f5f5f5;
      padding: 2px 4px;
      border-radius: 3px;
      font-size: 14px;
    }

    a {
      color: #007bff;
      text-decoration: underline;
    }

    blockquote {
      border-left: 3px solid #ddd;
      padding-left: 12px;
      margin: 8px 0;
      color: #666;
    }
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


const ChatMessage = React.memo(({ item, cachedAvatar,isPageWide }) => {
    const isUser = item.is_bot === false;

    return (
        <MessageWrapper isUser={isUser}>
            <div
                className={!isUser ? 'chatWrapper' : ''}
                style={{
  background: isUser ? '#fffaf5' : 'transparent',
  borderRadius: isUser ? '12px' : '0',
  padding: isUser ? '10px 16px' : '0',
  fontFamily: "'Inter', sans-serif",
  fontWeight: 400,
  fontSize: isPageWide ? 16 : 14,   
  lineHeight: '24px',
  color: isUser ? '#0d0d0d' : '#374151',
  wordBreak: 'break-word',
  maxWidth: isUser ? '85%' : '98%',
}}
            >
               <Markdown components={{
  p: ({ children }) => (
    <p style={{ margin: '0.5px 0', fontSize: isPageWide ? 16 : 14, lineHeight: '24px', opacity: isUser ? 1 : 0.9, fontWeight: 400, color: isUser ? '#0d0d0d' : '#374151' }}>
      {children}
    </p>
  ),
  li: ({ children }) => (
    <li style={{ fontSize: isPageWide ? 16 : 14, lineHeight: '24px', opacity: 0.9, margin: '4px 0', fontWeight: 400 }}>
      {children}
    </li>
  ),
  strong: ({ children }) => (
    <strong style={{ fontWeight: 600, opacity: 1 }}>{children}</strong>
  ),
}}>
  {item.message}
</Markdown>
            </div>
        </MessageWrapper>
    );
});

function ChatSection(props) {
    const dispatch = useDispatch();
    let isPageWide = media("(min-width: 768px)");
    const { conversations, isTyping, currentBotMessage, lastProductSliderPosition } = useChat();
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

    const handleShowLogin = () => {
        dispatch(authShowLogin());
    }

    return (
        <Container ref={scrollRef}>
            <div className="chat-section">

                {!isPageWide && (
                    <div className="flex gap-[10px] items-start mb-4 pb-4 border-b border-gray-200">
                        {cachedAvatar && (
                            <Image
                                src={cachedAvatar}
                                alt="ticket"
                                width={48}
                                height={48}
                                className="mt-[6px]"
                            />
                        )}
                        <div>
                            <p className="text-[20px] font-semibold mb-0">
                                Hey, I'm Kaira — Your AI Travel Buddy.
                            </p>
                            <p className="text-[14px] font-normal opacity-50 mb-0">
                                Ready to plan your perfect trip? Let's customize your itinerary together!
                            </p>
                        </div>
                    </div>
                )}

                {!localStorage.getItem("access_token") ? (
                    <div className='flex items-start gap-2'>
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
                    </div>
                ) : (
                    <>
                        {conversations.map((chatObj, idx) => (
                            chatObj?.type && chatObj?.data?.length > 0 ?
                                <div key={idx} style={{ width: isPageWide ? "calc(50vw - 160px)" : 'calc(100vw - 50px)' }}>
                                    <ProductSlider
                                        data={chatObj?.data}
                                        type={chatObj?.type}
                                        slidesPerView={4}
                                        navigationButtons={true}
                                        pageDots={false}
                                        position={chatObj.position}
                                        isDisabled={chatObj.position < lastProductSliderPosition}
                                    />
                                </div>
                                :
                                <ChatMessage key={idx} item={chatObj} cachedAvatar={cachedAvatar} isPageWide={isPageWide} />
                        ))}

                        {currentBotMessage && (
                            <ChatMessage item={{ 'is_bot': true, 'message': currentBotMessage }} cachedAvatar={cachedAvatar} />
                        )}

                        {isTyping && (
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 16 }}>
                                {cachedAvatar && (
                                    <Image
                                        src={cachedAvatar}
                                        alt="ticket"
                                        width={26}
                                        height={26}
                                        className='mt-[2px] flex-shrink-0'
                                    />
                                )}
                                <div className={styles.typingIndicator} style={{ background: 'transparent', padding: '4px 0' }}>
                                    <span className={styles.thinking}>
                                        {conversations.length > 0 ? "" : "Analyzing your Itinerary"}
                                        <div className={styles.typingDots}>
                                            <span></span><span></span><span></span>
                                        </div>
                                    </span>
                                </div>
                            </div>
                        )}

                        {finalized_status === "PENDING" && (
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 16 }}>
                                {cachedAvatar && (
                                    <Image
                                        src={cachedAvatar}
                                        alt="ticket"
                                        width={26}
                                        height={26}
                                        className='mt-[2px] flex-shrink-0'
                                    />
                                )}
                                <div className={styles.typingIndicator} style={{ background: 'transparent', padding: '4px 0' }}>
                                    <span className={styles.thinking}>
                                        Fetching your itinerary
                                        <div className={styles.typingDots}>
                                            <span></span><span></span><span></span>
                                        </div>
                                    </span>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </Container>
    );
}

export default ChatSection;