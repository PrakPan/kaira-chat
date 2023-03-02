import CloseIcon from '@mui/icons-material/Close';
import styled from "styled-components";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { Box } from '@material-ui/core';

import Lottie from 'react-lottie'
import animationData from '../../../public/assets/skeleton_square.json'
import SkeletonCard from '../../ui/button/SkeletonCard';

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
        

        <SkeletonCard width={"468px"} height={"188px"} />
    
      <SkeletonCard height={'100px'} width={'325px'} />


        <Box>
          <SkeletonCard
            width={"140px"}
            height={"20px"}
            mb={"10px"}
          />
          <SkeletonCard
            width={"468px"}
            height={"84px"}
          />
        </Box>

        <Box>
          <SkeletonCard
            width={"200px"}
            height={"20px"}
            mb={"10px"}
          />
          <SkeletonCard
            width={"468px"}
            height={"120px"}
          />
        </Box>

        <Box>
          <SkeletonCard
            width={"140px"}
            height={"20px"}
            mb={"10px"}
          />
          <SkeletonCard
            width={"468px"}
            height={"100px"}
          />
        </Box>


        <SkeletonCard width={'468px'} height={'150px'} />
      </Stack>
    );
}

export default POIDetailsSkeleton