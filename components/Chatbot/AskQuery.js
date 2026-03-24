import React, { useRef, useState } from "react";
import styled from "styled-components";
import useChat from "./hook/UseChat";
import Dictate from "./Dictate";
import Image from "next/image";
import { useAnalytics } from "../../hooks/useAnalytics";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
const Container = styled.div`
  border-radius: 12px;
  padding: 12px;
  
  @media screen and (max-width: 767px) {
    margin-bottom: 0px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 25;
    background: #fff;
    border-top: 1px solid #e5e7eb;
    border-radius: 0;
    padding: 12px 16px 16px 16px;
  }
`;

const QueryContainer = styled.div`
  border-radius: 12px;
  border: 1px solid #d7d7d7;
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
`;

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
  display: flex;
  margin-bottom: 10px;
  gap: 10px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const SingleChips = styled.button`
  border-radius: 50px;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  font-family: Montserrat;
  font-weight: 500;
  font-size: 12px;
  background: #fff;
  color: #1889ed;
  white-space: nowrap;
`;

const SubmitButton = styled.button`
  background: #07213A;
  height: 32px;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
`;

function AskQuery() {
  const { sendMessage, quickReplies, disableQuerySection } = useChat();
  const textareaRef = useRef(null);
  const [query, setQuery] = useState("");
  const [trackUserTyping, setUserTyping] = useState("");
  const [isSubmitDisabled, setSubmitDisabled] = useState(true);
  const dictateRef = useRef();
  const {trackChatMessageSent} = useAnalytics();
  const router = useRouter();
  const {id} = useSelector(state=>state.auth);
  const {customer} = useSelector(state=>state.Itinerary)

  const handleSubmitQuery = (input) => {
    const userMsg = { is_bot: false, message: input || query.trim() };
    sendMessage(userMsg);
    trackChatMessageSent(router.query.id,userMsg);
    setQuery("");
    setSubmitDisabled(true);
    dictateRef.current.stop();
    if (textareaRef.current) {
      textareaRef.current.style.height = "1.5rem";
    }
  };

  const handleInput = (e) => {
    const newValue = e.target.value;
    setQuery(newValue);
    setUserTyping(newValue);
    changeTextareaSize(newValue);
  };

  const changeTextareaSize = (currentValue) => {
    const textarea = textareaRef.current;
    const queryValue = currentValue !== undefined ? currentValue : query;
    setSubmitDisabled(queryValue.trim() === "");

    if (textarea) {
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;
      const lineHeight = 24;
      const maxHeight = lineHeight * 3;
      textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
      textarea.scrollTop = textarea.scrollHeight;
    }
  };

  const handleTranscriptChange = (transcript) => {
    const newQuery = `${trackUserTyping} ${transcript}`;
    setQuery(newQuery);
    changeTextareaSize();
  };

  const handleQuickReplies = (item) => {
    handleSubmitQuery(item);
  };

  const stopDictation = () => {
    setUserTyping(query);
  };

  return (
    <GrowTextAreaBox>
      <Container>
        <ChipsContainer className="scroll-x-hidden">
          {quickReplies.map((item, index) => (
            <>
              <SingleChips key={index} onClick={() => handleQuickReplies(item)}>
                {item}
              </SingleChips>
            </>
          ))}
        </ChipsContainer>
        <QueryContainer>
          <form>
            <AutoGrowTextarea
              ref={textareaRef}
              rows={1}
              placeholder="Ask anything..."
              value={query}
              // disabled={ id != customer}
              onChange={handleInput}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (e.shiftKey) {
                    return;
                  } else {
                    e.preventDefault();
                    if (!isSubmitDisabled && !disableQuerySection) {
                      handleSubmitQuery();
                    }
                  }
                }
              }}
            />
          </form>
          <div className="flex items-center justify-end">
            {/* <div>
              {" "}
              <img src="/assets/chatbot/add-icon.png" />{" "}
            </div> */}
            <div className="flex items-center gap-2">
              <div>
                {" "}
                <Dictate
                  ref={dictateRef}
                  stopDictation={stopDictation}
                  onTranscriptChange={handleTranscriptChange}
                  // disabled={id != customer}
                />{" "}
              </div>
              <div className="flex">
                <SubmitButton
                  disabled={isSubmitDisabled || disableQuerySection}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmitQuery();
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <g clip-path="url(#clip0_9587_10060)">
    <path d="M15.4109 0.588091C15.1719 0.346176 14.8745 0.169994 14.5475 0.0765683C14.2205 -0.0168576 13.875 -0.0243699 13.5442 0.0547573L2.87755 2.30142C2.26327 2.38567 1.68471 2.63974 1.20702 3.03503C0.729331 3.43032 0.371492 3.95113 0.1738 4.5388C-0.0238923 5.12647 -0.0535854 5.75767 0.0880645 6.3613C0.229714 6.96494 0.537081 7.51704 0.97555 7.95542L2.12088 9.10009C2.18287 9.16206 2.23203 9.23565 2.26555 9.31664C2.29907 9.39763 2.31629 9.48444 2.31622 9.57209V11.6841C2.31769 11.981 2.38605 12.2739 2.51622 12.5408L2.51088 12.5454L2.52822 12.5628C2.72356 12.9555 3.0426 13.2732 3.43622 13.4668L3.45355 13.4841L3.45822 13.4788C3.72512 13.6089 4.01793 13.6773 4.31488 13.6788H6.42688C6.60358 13.6786 6.77311 13.7486 6.89822 13.8734L8.04288 15.0181C8.3499 15.3285 8.71532 15.5751 9.11807 15.7436C9.52083 15.9122 9.95295 15.9993 10.3896 16.0001C10.7534 15.9996 11.1147 15.9402 11.4595 15.8241C12.0418 15.6329 12.5591 15.2828 12.953 14.8132C13.3469 14.3437 13.6018 13.7734 13.6889 13.1668L15.9389 2.47676C16.0221 2.14318 16.0172 1.7937 15.9246 1.4626C15.8321 1.13149 15.655 0.830137 15.4109 0.588091ZM3.06488 8.15876L1.91888 7.01409C1.65203 6.75366 1.465 6.42252 1.37974 6.05953C1.29448 5.69654 1.31454 5.31675 1.43755 4.96476C1.55681 4.60364 1.77729 4.28437 2.07275 4.04493C2.36821 3.80549 2.72623 3.65595 3.10422 3.61409L13.6649 1.39076L3.64822 11.4088V9.57209C3.64923 9.30965 3.59819 9.04961 3.49806 8.80702C3.39794 8.56442 3.2507 8.34409 3.06488 8.15876ZM12.3789 12.9388C12.3277 13.307 12.1749 13.6537 11.9376 13.9398C11.7003 14.2261 11.388 14.4405 11.0356 14.559C10.6833 14.6775 10.3049 14.6955 9.94284 14.6109C9.58083 14.5263 9.24956 14.3425 8.98622 14.0801L7.83955 12.9334C7.65446 12.7473 7.43431 12.5998 7.19183 12.4993C6.94935 12.3988 6.68935 12.3474 6.42688 12.3481H4.59022L14.6082 2.33342L12.3789 12.9388Z" fill="white"/>
  </g>
  <defs>
    <clipPath id="clip0_9587_10060">
      <rect width="16" height="16" fill="white"/>
    </clipPath>
  </defs>
</svg>
                </SubmitButton>
              </div>
            </div>
          </div>
        </QueryContainer>
      </Container>
    </GrowTextAreaBox>
  );
}

export default AskQuery;
