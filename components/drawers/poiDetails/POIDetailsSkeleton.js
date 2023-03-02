import CloseIcon from '@mui/icons-material/Close';
import styled from "styled-components";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { Box } from '@material-ui/core';


const POIDetailsSkeleton = (props) => {
  const LoadingBox = styled.div`
    background-color: #eeede7;
    border-radius: 10px;
    width: ${(props) => props.width};
    height: ${(props) => props.height};
    margin-top : ${(props) => props.mt};
    margin-bottom : ${(props) => props.mb};
  `;

    return (
      <Stack spacing={1} padding="16px" width="500px">
        <div onClick={props.handleCloseDrawer}>
          <CloseIcon height={23} cursor={"pointer"} />
        </div>

        <LoadingBox variant="rounded" width="468px" height="188px"></LoadingBox>

        <LoadingBox variant="rounded" width="468px" height="100px"></LoadingBox>

        <Box>
          <LoadingBox
            variant="rounded"
            width="140px"
            height="20px"
            mb="10px"
          ></LoadingBox>
          <LoadingBox
            variant="rounded"
            width="468px"
            height="84px"
          ></LoadingBox>
        </Box>

        <Box>
          <LoadingBox
            variant="rounded"
            width="140px"
            height="20px"
            mb="10px"
          ></LoadingBox>
          <LoadingBox
            variant="rounded"
            width="468px"
            height="84px"
          ></LoadingBox>
        </Box>

        <Box>
          <LoadingBox
            variant="rounded"
            width="140px"
            height="20px"
            mb="10px"
          ></LoadingBox>
          <LoadingBox
            variant="rounded"
            width="468px"
            height="100px"
          ></LoadingBox>
        </Box>
      </Stack>
    );
}

export default POIDetailsSkeleton