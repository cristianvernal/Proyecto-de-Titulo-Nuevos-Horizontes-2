import React from "react";
import styled from "styled-components/macro";
import { Link } from "react-router-dom";

import { Helmet } from "react-helmet-async";

import { Button as MuiButton, Typography } from "@material-ui/core";
import { spacing } from "@material-ui/system";

const Button = styled(MuiButton)(spacing);

const Wrapper = styled.div`
  padding: ${(props) => props.theme.spacing(6)}px;
  text-align: center;
  background: transparent;

  ${(props) => props.theme.breakpoints.up("md")} {
    padding: ${(props) => props.theme.spacing(10)}px;
  }
`;

function Page404() {
  return (
    <Wrapper>
      <Helmet title="404 Error" />
      <Typography component="h1" variant="h1" align="center" gutterBottom>
        404
      </Typography>
      <Typography component="h2" variant="h5" align="center" gutterBottom>
        Página no encontrada.
      </Typography>
      <Typography component="h2" variant="body1" align="center" gutterBottom>
        La página que busacabas podria haber sido removida.
      </Typography>

      <Button
        component={Link}
        to="/auth/sign-in"
        variant="contained"
        color="secondary"
        mt={2}
      >
        Regresar al administrador
      </Button>
    </Wrapper>
  );
}

export default Page404;
