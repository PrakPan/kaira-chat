import React, { memo } from "react";
import { Modal, Box, Backdrop, IconButton } from "@mui/material";
import useChat from "../hook/UseChat";
import styled from "styled-components";
import moment from "moment";
import NoDataLayouteOne from "../../NoDataLayouts/NoDataLayouteOne";
import LoadingLayoutsOne from "../../LoadingLayouts/LoadingLayoutsOne";
import Image from "next/image";

const Container = styled.div`
padding:20px;
`

const Heading = styled.div`
font-size: 20px;
font-weight: 600;
`

const ListContainer = styled.div`
height: calc(96vh - 100px);
    overflow-y: auto;
`

const DateGroup = styled.div`
    margin-bottom: 20px;
`;

const DateHeader = styled.div`
    font-size: 13px;
    font-weight: 400;
    color: #6E757A;
    margin-bottom: 8px;
    padding: 0 4px;
`;

const ChatItem = styled.div`
    padding: 10px 12px;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;
    margin-bottom: 4px;
    transition: all 0.2s ease;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &:hover {
        background: #e9ecef;
        border-color: #dee2e6;
    }

    &.active {
        background: #F0F0F0;
    }
`;

const noDataObj = {
    "message": "No Chat History Found !",
    "class": "center"
}

const loadingObj = {
    "message": "Please wait, fetching chat history..."
}

const formatChatDate = (date) => {
    const now = moment();
    const chatDate = moment(date);
    const diffInDays = now.diff(chatDate, 'days');
    
    if (diffInDays === 0) {
        return 'Today';
    } else if (diffInDays === 1) {
        return 'Yesterday';
    } else if (diffInDays <= 7) {
        return 'Last Week';
    } else {
        return chatDate.format('MMM DD, YYYY');
    }
};

const groupChatsByDate = (chatHistoryList) => {
    const groups = {
        today: [],
        yesterday: [],
        lastWeek: [],
        older: []
    };

    chatHistoryList.forEach(item => {
        const now = moment();
        const chatDate = moment(item.created_at);
        const diffInDays = now.diff(chatDate, 'days');
        
        if (diffInDays === 0) {
            groups.today.push(item);
        } else if (diffInDays === 1) {
            groups.yesterday.push(item);
        } else if (diffInDays <= 7) {
            groups.lastWeek.push(item);
        } else {
            groups.older.push(item);
        }
    });

    return groups;
};

function HistoryList() {
    const { chatBotContainerRef, handleOpenChatHistory, newSessionStart, isOpenChatHistoryDrawer, chatHistoryList, showChatHistoryById, sessionId, isloadingChatHistory } = useChat();

    const openNwChat=()=>{
        newSessionStart();
        handleOpenChatHistory();
    }
    const groupedChats = groupChatsByDate(chatHistoryList);

    return (
        <Modal
            open={isOpenChatHistoryDrawer}
            onClose={handleOpenChatHistory}
            container={chatBotContainerRef.current}
            disablePortal
            BackdropComponent={Backdrop}
            BackdropProps={{
                sx: {
                    backgroundColor: "rgba(0,0,0,0.4)",
                    position: "absolute",
                },
            }}
            style={{ position: "absolute"}}
        >
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: '400px',
                    height: "100%",
                    bgcolor: "background.paper",
                    boxShadow: 3,
                    p: 0,
                    borderRadius: "16px",
                    border: "1px solid #dcdcdc"
                }}
            >
                <Container>
                    <div className="flex justify-end mb-[16px]">
                        <IconButton onClick={handleOpenChatHistory} color="#000">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="black" />
                            </svg>
                        </IconButton>
                    </div>
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                        <Heading>Chat History</Heading>
                        <button className="MediumIndigoOutlinedButton" onClick={openNwChat}>New Chat</button>
                    </div>
                    <ListContainer>
                        {isloadingChatHistory && <LoadingLayoutsOne {...loadingObj} />}
                        {(!isloadingChatHistory && chatHistoryList.length === 0) && <NoDataLayouteOne {...noDataObj} />}
                        {(!isloadingChatHistory && chatHistoryList.length > 0) && (
                            <>
                                {groupedChats.today.length > 0 && (
                                    <DateGroup>
                                        <DateHeader>Today</DateHeader>
                                        {groupedChats.today.map((item, idx) => (
                                            <ChatItem 
                                                key={idx} 
                                                onClick={() => showChatHistoryById(item.id)} 
                                                className={sessionId === item.id ? 'active' : ''}
                                            >
                                                <span>{item?.name || moment(item.created_at).format("hh:mm A")}</span>
                                                <Image src="/delete.svg" width={16} height={16} className="text-[#D43E29]"/>
                                            </ChatItem>
                                        ))}
                                    </DateGroup>
                                )}

                                {groupedChats.yesterday.length > 0 && (
                                    <DateGroup>
                                        <DateHeader>Yesterday</DateHeader>
                                        {groupedChats.yesterday.map((item, idx) => (
                                            <ChatItem 
                                                key={idx}
                                                onClick={() => showChatHistoryById(item.id)} 
                                                className={sessionId === item.id ? 'active' : ''}
                                            >
                                                <span>{item?.name || moment(item.created_at).format("hh:mm A")}</span>
                                                <Image src="/delete.svg" width={16} height={16} className="text-[#D43E29]"/>
                                            </ChatItem>
                                        ))}
                                    </DateGroup>
                                )}

                                {groupedChats.lastWeek.length > 0 && (
                                    <DateGroup>
                                        <DateHeader>Last Week</DateHeader>
                                        {groupedChats.lastWeek.map((item, idx) => (
                                            <ChatItem 
                                                key={idx}
                                                onClick={() => showChatHistoryById(item.id)} 
                                                className={sessionId === item.id ? 'active' : ''}
                                            >
                                                <span>{item?.name || moment(item.created_at).format("MMM DD")}</span>
                                                <Image src="/delete.svg" width={16} height={16} className="text-[#D43E29]"/>
                                            </ChatItem>
                                        ))}
                                    </DateGroup>
                                )}

                                {groupedChats.older.length > 0 && (
                                    <DateGroup>
                                        <DateHeader>Older</DateHeader>
                                        {groupedChats.older.map((item, idx) => (
                                            <ChatItem 
                                                key={idx}
                                                onClick={() => showChatHistoryById(item.id)} 
                                                className={sessionId === item.id ? 'active' : ''}
                                            >
                                                <span>{item?.name || moment(item.created_at).format("MMM DD, YYYY")}</span>
                                               <Image src="/delete.svg" width={16} height={16} className="text-[#D43E29]"/>
                                            </ChatItem>
                                        ))}
                                    </DateGroup>
                                )}
                            </>
                        )}
                    </ListContainer>
                </Container>
            </Box>
        </Modal>
    );
}

export default HistoryList;
