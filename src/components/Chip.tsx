import styled from "styled-components/macro";
import { Chip as MuiChip } from "@material-ui/core";
import { spacing } from "@material-ui/system";
import { green, red } from "@material-ui/core/colors";

export const Chip: any = styled(MuiChip)`
  ${spacing};
  background: ${(props: any) => props.activated && green[500]};
  background: ${(props: any) => props.desactivated && red[500]};
  color: ${(props) => props.theme.palette.common.white};
  min-width: 90px;
`;
