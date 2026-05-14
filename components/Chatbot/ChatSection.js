import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import useChat from './hook/UseChat';
import Markdown from 'react-markdown';
import styles from "../../styles/Chatbot.module.css";
import ProductSlider from './product-slider/ProductSlider';
import media from '../../components/media';
import { authShowLogin } from '../../store/actions/auth';
import { useDispatch, useSelector } from 'react-redux';

// ─── Styled Components ────────────────────────────────────────────────────────

const Container = styled.div`
  height: calc(100% - 225px);
  margin-top: 10px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  scroll-behavior: smooth;
  font-family: 'Inter', sans-serif;
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

// User bubble — exact match from ChatKitPanel MessageBubble
const UserBubble = styled.div`
  max-width: 85%;
  background: #f8fafc;
  color: #0d0d0d;
  padding: 10px 16px;
  border-radius: 12px;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  word-break: break-word;
`;

// Quick reply chips — exact match from ChatKitPanel SingleChips
const SingleChips = styled.button`
  border-radius: 6px;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  font-family: Montserrat;
  font-weight: 500;
  font-size: 12px;
  background: #fff;
  color: #6e757a;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  flex-shrink: 0;
  &:hover {
    border-color: #1889ed;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoginButton = styled.button`
  width: 136px;
  height: 44px;
  background: #f7e700;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  border: none;
  color: #111;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
`;

// ─── Thinking Dots — exact match from MessageBubble ───────────────────────────

const ThinkingDots = () => (
  <div style={{
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '12px 16px',
    alignSelf: 'flex-start',
    marginTop: 4,
  }}>
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: '#111',
          display: 'inline-block',
          animation: 'thinkPulse 1.4s infinite ease-in-out',
          animationDelay: `${[-0.32, -0.16, 0][i]}s`,
        }}
      />
    ))}
    <style>{`
      @keyframes thinkPulse {
        0%, 80%, 100% { transform: scale(0.4); opacity: 0.3; }
        40%            { transform: scale(1);   opacity: 1; }
      }
    `}</style>
  </div>
);

// ─── WelcomeState — exact match from ChatKitPanel ────────────────────────────

const WelcomeState = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: '0 24px 80px',
    userSelect: 'none',
  }}>
    <div style={{
      width: 112,
      height: 112,
      borderRadius: '50%',
      marginBottom: 28,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      background: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)',
    }}>
      <span style={{ fontSize: 48 }} role="img" aria-label="travel">🌍</span>
    </div>
    <h2 style={{
      fontSize: 22,
      fontWeight: 600,
      color: '#111827',
      marginBottom: 8,
      letterSpacing: '-0.3px',
      fontFamily: "'Inter', sans-serif",
      margin: '0 0 8px 0',
    }}>
      Planning a trip today?
    </h2>
    <p style={{
      fontSize: 13,
      color: '#9ca3af',
      textAlign: 'center',
      maxWidth: 280,
      lineHeight: '1.6',
      fontFamily: "'Inter', sans-serif",
      margin: 0,
    }}>
      I'm Kaira — your AI travel companion. Ask me anything about destinations,
      itineraries, routes, or local tips.
    </p>
  </div>
);

// ─── ChatMessage — uses chatWrapper class for exact CSS match ─────────────────

const ChatMessage = React.memo(({ item }) => {
  const isUser = item.is_bot === false;

  if (isUser) {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <UserBubble>{item.message}</UserBubble>
      </div>
    );
  }

  // Bot message — exact structure from ChatKitPanel MessageBubble
  // Uses .chatWrapper class so all CSS rules apply (font-size: 16px, opacity: 0.9, etc.)
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, width: '98%' }}>
        <div className="chatWrapper" style={{ padding: '10px 16px', color: '#374151', minWidth: '98%' }}>
          <Markdown
            components={{
              p: ({ children }) => <p>{children}</p>,
              li: ({ children }) => <li>{children}</li>,
              strong: ({ children }) => <strong>{children}</strong>,
              h1: ({ children }) => <h1>{children}</h1>,
              h2: ({ children }) => <h2>{children}</h2>,
              h3: ({ children }) => <h3>{children}</h3>,
              ul: ({ children }) => <ul>{children}</ul>,
              ol: ({ children }) => <ol>{children}</ol>,
              a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>,
              code: ({ children }) => <code>{children}</code>,
              blockquote: ({ children }) => <blockquote>{children}</blockquote>,
            }}
          >
            {item.message}
          </Markdown>
        </div>
      </div>
    </div>
  );
});

// ─── Main ChatSection ─────────────────────────────────────────────────────────

function ChatSection(props) {
  const dispatch = useDispatch();
  let isPageWide = media('(min-width: 768px)');
  const { conversations, isTyping, currentBotMessage, lastProductSliderPosition, quickReplies, sendMessage } = useChat();
  const { finalized_status } = useSelector((state) => state.ItineraryStatus);
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
      observer.observe(scrollRef.current, { childList: true, subtree: true });
      scrollToBottom();
    }

    return () => observer.disconnect();
  }, []);

  const handleShowLogin = () => dispatch(authShowLogin());
  const isLoggedIn = !!localStorage.getItem('access_token');

  const handleQuickReply = (reply) => {
    if (isTyping) return;
    const value = typeof reply === 'string' ? reply : (reply.value ?? reply.label ?? String(reply));
    sendMessage?.(value);
  };

  return (
    <Container ref={scrollRef}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

        {!isLoggedIn ? (
          /* ── Not logged in ── */
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, width: '98%' }}>
              <div className="chatWrapper" style={{ padding: '10px 16px', color: '#374151', minWidth: '98%' }}>
                <p>
                  I can see you're not logged in. Please log in to continue chatting and unlock your personalized travel experience.
                </p>
                <LoginButton onClick={handleShowLogin} style={{ marginTop: 16 }}>
                  Login/Signup
                </LoginButton>
              </div>
            </div>
          </div>
        ) : (
          <>
           

            {/* ── Conversation messages ── */}
            {conversations.map((chatObj, idx) =>
              chatObj?.type && chatObj?.data?.length > 0 ? (
                <div
                  key={idx}
                  style={{
                    width: isPageWide ? 'calc(50vw - 160px)' : 'calc(100vw - 50px)',
                    marginBottom: 8,
                  }}
                >
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
              ) : (
                <ChatMessage key={idx} item={chatObj} />
              )
            )}

            {/* ── Streaming bot message ── */}
            {currentBotMessage && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, width: '98%' }}>
                  <div className="chatWrapper" style={{ padding: '10px 16px', color: '#374151', minWidth: '98%' }}>
                    <Markdown
                      components={{
                        p: ({ children }) => <p>{children}</p>,
                        li: ({ children }) => <li>{children}</li>,
                        strong: ({ children }) => <strong>{children}</strong>,
                      }}
                    >
                      {currentBotMessage}
                    </Markdown>
                  </div>
                </div>
              </div>
            )}

            {/* ── Typing dots ── */}
            {isTyping && !currentBotMessage && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, width: '98%' }}>
                  <div style={{ padding: '10px 16px' }}>
                    <ThinkingDots />
                  </div>
                </div>
              </div>
            )}

            {/* ── Fetching itinerary ── */}
            {finalized_status === 'PENDING' && !isTyping && conversations.length === 0 && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 16 }}>
                <div style={{ padding: '10px 16px', fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 8 }}>
                  {/* Fetching your itinerary */}
                  <ThinkingDots />
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