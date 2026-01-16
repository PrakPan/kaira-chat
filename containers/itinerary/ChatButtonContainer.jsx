import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styled from 'styled-components';
import { setUnreadMessages } from '../../store/actions/chatState';
import Button from "../../components/ui/button/Index";

const NotificationDot = styled.div`
  position: absolute;
  top: 7px;
  right: 19px;
  width: 16px;
`;

function ChatButtonContainer({ onOpenChat }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const chatState = useSelector((state) => state.chatState);
  const hasUnreadMessages = chatState?.hasUnreadMessages || false;

  

  const handleClick = () => {
    onOpenChat();
    router.push(
      {
        pathname: `/itinerary/${router.query.id}/`,
        query: { ...router.query, drawer: "chat" },
      },
      undefined,
      { scroll: false }
    );
    dispatch(setUnreadMessages(false));
  };

  return (
    <div className="relative">
      <Button borderWidth="0px" onclick={handleClick}>
        <Image
          src={"/assets/chatbot/chatbot-avaatar.svg"}
          alt="ticket"
          width={80}
          height={80}
        />
      </Button>
      {hasUnreadMessages && (
        <NotificationDot>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle opacity="0.2" cx="12" cy="12" r="11" fill="#FA3530" stroke="white" strokeWidth="2"/>
            <circle opacity="0.4" cx="12" cy="12" r="8" fill="#FA3530"/>
            <circle cx="12" cy="12" r="6" fill="#FA3530"/> 
          </svg>
        </NotificationDot>
      )}
    </div>
  );
}

export default ChatButtonContainer;