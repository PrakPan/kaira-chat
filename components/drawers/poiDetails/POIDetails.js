import React from 'react'
import CloseIcon from "@mui/icons-material/Close";
import { Box } from "@material-ui/core";
import Stack from "@mui/material/Stack";
import styled from 'styled-components'
const POIDetails = (props) => {
    const Image = styled.img`
        width : 468px;
        height : 188px;
        border-radius : 12px
    `
    const Title = styled.p`
       font-weight : 600;
       font-size : 20px;
       height : 30px
    `


  return (
    <Stack padding="16px" width="500px">
      <CloseIcon
              height={23}
              mb={23}
        cursor={"pointer"}
        onClick={props.handleCloseDrawer}
      />
          <Image src={props.data.image} />
          <Title>{props.data.name}</Title>

      </Stack>
  );
}

export default POIDetails