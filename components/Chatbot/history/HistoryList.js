import React, { memo } from "react";
import { Modal, Box, Backdrop, IconButton } from "@mui/material";
import useChat from "../hook/UseChat";
import styled from "styled-components";
import moment from "moment";

const Container = styled.div`
padding:20px;
`

const Heading = styled.div`
font-size: 20px;
font-weight: 600;
margin-bottom: 10px;
padding-bottom: 10px;
border-bottom: 1px solid #eee;
`

const ListContainer = styled.div`
height: calc(96vh - 100px);
    overflow-y: auto;
`

const SingleItem = styled.li`
    padding: 6px 8px;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    margin-bottom: 5px;
    background: #f5f5f5;
    list-style:none;

    &:hover{
    background:#eaeaea;
    };

    &.active {
    background:#07213A;
    color: #fff
    }
`

function HistoryList() {
    const { chatBotContainerRef, handleOpenChatHistory, isOpenChatHistoryDrawer, chatHistoryList, showChatHistoryById, sessionId } = useChat();

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
            style={{ position: "absolute" }}
        >
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: '300px',
                    height: "100%",
                    bgcolor: "background.paper",
                    boxShadow: 3,
                    p: 2,
                    borderRadius: "16px",
                    border: "1px solid #dcdcdc"
                }}
            >
                <Container>
                    <Heading>Chat History  <IconButton className="float-right" onClick={handleOpenChatHistory} color="#000">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="black" />
                        </svg>
                    </IconButton></Heading>
                    <ListContainer>
                        {chatHistoryList.map((item, idx) =>
                            <>
                                <SingleItem onClick={() => showChatHistoryById(item.id)} className={sessionId === item.id ? 'active' : ''} key={idx} >{moment(item.created_at).format("Do MMM, YYYY hh:mm A")} </SingleItem>
                            </>
                        )}

                    </ListContainer>
                </Container>
            </Box>
        </Modal>
    );
}

export default HistoryList;
