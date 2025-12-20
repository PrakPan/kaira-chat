import React, { useRef, useState } from "react";
import styled from "styled-components";
import useChat from "./hook/UseChat";
import Dictate from "./Dictate";
import Image from "next/image";
import { useAnalytics } from "../../hooks/useAnalytics";
import { useRouter } from "next/router";
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
  background: #ffd602;
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
  <path d="M6.91792 9.06916L3.08847 7.5179C2.95685 7.46661 2.86198 7.38837 2.80386 7.2832C2.74574 7.17801 2.71667 7.07031 2.71667 6.96011C2.71667 6.84992 2.74851 6.74184 2.81219 6.63585C2.87587 6.52987 2.97352 6.45124 3.10514 6.39995L12.2318 2.98261C12.3507 2.93266 12.466 2.92289 12.5775 2.9533C12.689 2.98372 12.7854 3.03949 12.8665 3.12061C12.9476 3.20172 13.0034 3.29805 13.0338 3.4096C13.0642 3.52113 13.0543 3.63633 13.0042 3.7552L9.57349 12.8777C9.52334 13.0065 9.44559 13.103 9.34026 13.1674C9.23494 13.2318 9.1271 13.264 9.01676 13.264C8.90641 13.264 8.79809 13.2337 8.69177 13.1732C8.58546 13.1127 8.507 13.0169 8.45638 12.8858L6.91792 9.06916Z" fill="black"/>
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
