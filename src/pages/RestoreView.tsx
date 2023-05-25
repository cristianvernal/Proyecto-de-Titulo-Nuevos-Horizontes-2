import React from "react";
import styled from "styled-components/macro";
import { NavLink } from "react-router-dom";

import { Helmet } from "react-helmet-async";

import {
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Button,
  ButtonGroup,
  Card as MuiCard,
  CardContent,
  Divider as MuiDivider,
  Grid,
  Link,
  TextField,
  Typography,
} from "@material-ui/core";

import { spacing } from "@material-ui/system";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/reducers/rootReducer";
import { IAuthState } from "../redux/reducers/authReducer";
import { ResetPasswordUser } from "../redux/actions/usersActions";

const Card = styled(MuiCard)(spacing);

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const ContentCard = React.memo(() => {
  const dispatch = useDispatch();
  const { user } = useSelector<RootState, IAuthState>(
    (state) => state.authReducer
  );
  return (
    <Card mb={6}>
      {user?.id}
      <CardContent>
        <ButtonGroup color="primary" aria-label="outlined primary button group">
          <Button
            onClick={() => dispatch(ResetPasswordUser({ Email: user?.email }))}
          >
            Restaurar
          </Button>
        </ButtonGroup>
      </CardContent>
    </Card>
  );
});

export const RestoreView = () => {
  return (
    <React.Fragment>
      <Helmet title="Blank" />
      <Typography variant="h3" gutterBottom display="inline">
        Restaurar Contraseña
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} exact to="/inicio">
          Inicio
        </Link>
        <Typography>My View</Typography>
      </Breadcrumbs>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <ContentCard />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
