import React from "react";
import styled from "styled-components/macro";
import { NavLink } from "react-router-dom";

import { Helmet } from "react-helmet-async";

import {
  Breadcrumbs as MuiBreadcrumbs,
  Button,
  Card as MuiCard,
  CardContent,
  Divider as MuiDivider,
  Grid,
  Link,
  Typography,
} from "@material-ui/core";

import { spacing } from "@material-ui/system";

const Card = styled(MuiCard)(spacing);

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const ContentCard = () => {
  return (
    <Card mb={6}>
      <CardContent>
        <Typography variant="h6" gutterBottom></Typography>
        <Typography variant="body2" gutterBottom>
          Empty card
        </Typography>
      </CardContent>
    </Card>
  );
};

export const Dashboard = () => (
  <React.Fragment>
    <Helmet title="Inicio" />
    <Grid container>
      <Grid style={{ width: "100vw" }} item xs={12} sm={6}>
        <Typography
          style={{ marginLeft: "3" }}
          variant="h3"
          gutterBottom
          display="inline"
        >
          Formularios COVID
        </Typography>

        <Breadcrumbs aria-label="Breadcrumb" mt={2}>
          <Typography>Formularios COVID</Typography>
        </Breadcrumbs>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Button variant="contained" color="primary">
          Crear formulario
        </Button>
      </Grid>
    </Grid>
    <Breadcrumbs aria-label="Breadcrumb" mt={2}>
      <Link component={NavLink} exact to="/">
        Dashboard
      </Link>
      <Link component={NavLink} exact to="/">
        Pages
      </Link>
      <Typography>Blank</Typography>
    </Breadcrumbs>
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ContentCard />
      </Grid>
    </Grid>
  </React.Fragment>
);
