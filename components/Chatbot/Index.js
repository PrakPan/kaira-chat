import Header from './Header';
import styled from 'styled-components';
import AskQuery from './AskQuery';
import ChatSection from './ChatSection';
import { ChatProvider } from './context/ChatContext';
import { useRouter } from "next/router";
import HistoryList from './history/HistoryList';
import useChat from './hook/UseChat';


const Container = styled.div`
  padding: ${(props) => (props.ispopup ? '0px 16px' : '20px')};
  // box-shadow: ${(props) => (props.ispopup ? 'none' : '0px 4px 24px 0px #B9B2B240')};
  position: relative;
  height: ${(props) => (props.ispopup ? '100vh' : '96vh')};
  // border-radius: 16px;
  overflow-y: hidden;
  
  @media screen and (max-width: 767px) {
    height: 100vh;
    padding: 8px;
    border-radius: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
`;

// Outer wrapper
function ChatBot(props) {
  const router = useRouter();
  const itinearyId = router.query.id;

  return (


      <ChatProvider itinearyId={itinearyId}>
      <ChatBotContent ispopup={props.showAsPopup} hideDrawer={props?.hideDrawer} />
      </ChatProvider>
      
  );
}


// Inner wrapper 
function ChatBotContent({ ispopup, hideDrawer }) {
  const { chatBotContainerRef } = useChat();

  return (
    <Container ref={chatBotContainerRef} ispopup={ispopup}>
      <Header hideDrawer={hideDrawer}/>
      <ChatSection />
      <AskQuery />
      <HistoryList />
    </Container>
  );
}

export default ChatBot;
