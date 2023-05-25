import {
  Breadcrumbs as MuiBreadcrumbs,
  Card as MuiCard,
  CardContent,
  Divider as MuiDivider,
  Grid,
  Link,
  Typography,
} from "@material-ui/core";
import { spacing } from "@material-ui/system";
import React from "react";
import { Helmet } from "react-helmet-async";
import { NavLink } from "react-router-dom";
import styled from "styled-components/macro";

const Card = styled(MuiCard)(spacing);

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const ContentCard = React.memo(() => {
  return (
    <Card mb={6}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Empty card
        </Typography>
        <Typography variant="body2" gutterBottom>
          Empty card
        </Typography>
      </CardContent>
    </Card>
  );
});

export const Blank = () => (
  <React.Fragment>
    <Helmet title="Titulo Página" />
    <Typography variant="h3" gutterBottom display="inline">
      Blank
    </Typography>

    <Breadcrumbs aria-label="Breadcrumb" mt={2}>
      <Link component={NavLink} exact to="/">
        Dashboard
      </Link>
      <Link component={NavLink} exact to="/">
        Pages
      </Link>
      <Typography>Blank</Typography>
    </Breadcrumbs>

    <Divider my={6} />

    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ContentCard />
      </Grid>
    </Grid>
  </React.Fragment>
);
