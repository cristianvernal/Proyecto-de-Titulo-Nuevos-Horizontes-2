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
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Carousel from 'react-bootstrap/Carousel';

const Card = styled(MuiCard)(spacing);

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const ContentCard = React.memo(() => {
  return (
<div>

    <Navbar bg="primary" expand="lg" variant="dark" sticky="top">
      <Container fluid>
        <Navbar.Brand href="#">Colegio Nuevos Horizontes</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
            >
            <Nav.Link href="#action1">Inicio</Nav.Link>
            <Nav.Link href="#action2">Sobre nosotros</Nav.Link>
          </Nav>
            <Button variant="success">Ingresar</Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  <br />
    <Carousel>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://picsum.photos/id/237/300/100"
          alt="First slide"
          />
        <Carousel.Caption>
          <h3>First slide label</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://picsum.photos/id/23/300/100"
          alt="Second slide"
          />

        <Carousel.Caption>
          <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://picsum.photos/id/29/300/100"
          alt="Third slide"
          />

        <Carousel.Caption>
          <h3>Third slide label</h3>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
          </div>
  );     
});

export const IndexList = () => (
  <React.Fragment>
    <Helmet title="Titulo Página" />

    <Breadcrumbs aria-label="Breadcrumb" mt={2}></Breadcrumbs>

    <Divider my={6} />

    <Grid container spacing={6}>
      <Grid item xs={12}>
        <ContentCard />
      </Grid>
    </Grid>
  </React.Fragment>
);
