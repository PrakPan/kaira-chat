import Header from './Header';
import styled from 'styled-components';
import AskQuery from './AskQuery';
import ChatSection from './ChatSection';
import { ChatProvider } from './context/ChatContext';
import { useRouter } from "next/router";

const Container = styled.div`
  padding:  ${(props) => (props.ispopup ? '0px 20px' : '20px')};
  box-shadow: ${(props) => (props.ispopup ? 'none' : '0px 4px 24px 0px #B9B2B240')}; ;
  position: relative;
  height: ${(props) => (props.ispopup ? '93vh' : '90vh')};
  border-radius: 16px;
`;

function ChatBot(props) {
  const router = useRouter();
  const bookingId = router.query.id;
  return (
    <ChatProvider bookingId={bookingId} >
      <Container ispopup={props.showAsPopup}>
        <Header />
        <ChatSection />
        <AskQuery />
      </Container>
    </ChatProvider>
  );
}

export default ChatBot;
