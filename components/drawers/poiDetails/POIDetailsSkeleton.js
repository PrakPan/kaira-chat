import CloseIcon from '@mui/icons-material/Close';
import styled from "styled-components";
import Stack from "@mui/material/Stack";
import { Box } from '@material-ui/core';
import media from '../../../components/media'
import Lottie from 'react-lottie'
import animationData from '../../../public/assets/skeleton_square.json'
import SkeletonCard from '../../ui/SkeletonCard';
import {TbArrowBack} from 'react-icons/tb'
const POIDetailsSkeleton = (props) => {
  const LoadingBox = styled.div`
    background-color: #eeede7;
    border-radius: 10px;
    width: ${(props) => props.width};
    height: ${(props) => props.height};
    margin-top : ${(props) => props.mt};
    margin-bottom : ${(props) => props.mb};
  `;
  const Title = styled.p`
    font-weight: 800;
    font-size: 20px;
  `;
  let isPageWide = media('(min-width: 768px)')

    return (
      <Stack spacing={1} padding="16px" width={isPageWide ? "500px" : "360px"}>
        <div onClick={props.handleCloseDrawer}>
          <TbArrowBack
            style={{ height: "32px", width: "32px" }}
            cursor={"pointer"}
          />
        </div>

        <SkeletonCard width={isPageWide?"468px" : "100%"} height={"188px"} />
        <Title>{props.name}</Title>
        <SkeletonCard height={"100px"} width={"325px"} />

        <Box>
          <SkeletonCard width={"140px"} height={"20px"} mb={"10px"} />
          <SkeletonCard width={isPageWide?"468px" : "100%"} height={"84px"} />
        </Box>

        <Box>
          <SkeletonCard width={"200px"} height={"20px"} mb={"10px"} />
          <SkeletonCard width={isPageWide?"468px" : "100%"} height={"120px"} />
        </Box>

        <Box>
          <SkeletonCard width={"140px"} height={"20px"} mb={"10px"} />
          <SkeletonCard width={isPageWide?"468px" : "100%"} height={"100px"} />
        </Box>

        <SkeletonCard width={isPageWide?"468px" : "100%"} height={"150px"} />
      </Stack>
    );
}

export default POIDetailsSkeleton