import React, { useState, useEffect, useRef } from 'react';
import Header from './Header';
import styled from 'styled-components';
import AskQuery from './AskQuery';
import ChatSection from './ChatSection';
import { ChatProvider } from './context/ChatContext';
import { useRouter } from "next/router";

const Container = styled.div`
  padding: 20px;
  box-shadow: 0px 4px 24px 0px #B9B2B240;
  position: relative;
  height: 90vh;
  border-radius: 16px;
`;

function ChatBot() {
  const router = useRouter();
  const bookingId = router.query.id;
  console.log(bookingId, "inside the indexjs");
  return (
    <ChatProvider bookingId={bookingId} >
      <Container>
        <Header />
        <ChatSection />
        <AskQuery />
      </Container>
    </ChatProvider>
  );
}

export default ChatBot;
