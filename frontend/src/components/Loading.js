import styled from "@emotion/styled";
import { CircularProgress } from "@mui/material";

const Loading = styled(CircularProgress)(({ theme }) => ({
  margin: theme.spacing(8),
}));

export default Loading;
