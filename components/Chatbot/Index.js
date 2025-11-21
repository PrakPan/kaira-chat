import Header from './Header';
import styled from 'styled-components';
import AskQuery from './AskQuery';
import ChatSection from './ChatSection';
import { ChatProvider } from './context/ChatContext';
import { useRouter } from "next/router";
import HistoryList from './history/HistoryList';
import useChat from './hook/UseChat';


const Container = styled.div`
  padding: ${(props) => (props.ispopup ? '0px 20px' : '20px')};
  box-shadow: ${(props) => (props.ispopup ? 'none' : '0px 4px 24px 0px #B9B2B240')};
  position: relative;
  height: ${(props) => (props.ispopup ? '93vh' : '96vh')};
  border-radius: 16px;
`;

// Outer wrapper
function ChatBot(props) {
  const router = useRouter();
  const itinearyId = router.query.id;

  return (
  
      <ChatBotContent ispopup={props.showAsPopup} />
      
  );
}


// Inner wrapper 
function ChatBotContent({ ispopup }) {
  const { chatBotContainerRef } = useChat();

  return (
    <Container ref={chatBotContainerRef} ispopup={ispopup}>
      <Header />
      <ChatSection />
      <AskQuery />
      <HistoryList />
    </Container>
  );
}

export default ChatBot;
