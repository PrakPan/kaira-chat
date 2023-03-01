import CloseIcon from '@mui/icons-material/Close';
import styled from "styled-components";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { Box } from '@material-ui/core';


const POIDetailsSkeleton = (props) => {
    return (
      <Stack spacing={1} padding="16px" width="500px">
        <CloseIcon height={23} cursor={"pointer"} onClick={props.handleCloseDrawer} />
        <Skeleton variant="rounded" width={468} height={188} />

        <Skeleton variant="rounded" width={468} height={100} />

        <Box>
          <Skeleton variant="text" width={140} sx={{ fontSize: "18px" }} />
          <Skeleton variant="rounded" width={468} height={84} />
        </Box>

        <Box>
          <Skeleton variant="text" width={140} sx={{ fontSize: "18px" }} />
          <Skeleton variant="rounded" width={468} height={84} />
        </Box>

        <Box>
          <Skeleton variant="text" width={140} sx={{ fontSize: "25px" }} />
          <Skeleton variant="rounded" width={468} height={100} />
        </Box>
      </Stack>
    );
}

export default POIDetailsSkeleton