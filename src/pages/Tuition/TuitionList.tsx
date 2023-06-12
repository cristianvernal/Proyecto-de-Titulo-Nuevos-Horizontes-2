import React from "react";
import styled from "styled-components/macro";
import { NavLink } from "react-router-dom";
import { useState } from 'react';
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
import { TutorList } from '../Tutors/TutorList';

const Card = styled(MuiCard)(spacing);

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
interface Alumno {
  matriculaPagada: boolean;
  arancelMensual: number;
}

function PaginaAlumno() {
  const [alumno, setAlumno] = useState<Alumno>({
    matriculaPagada: false,
    arancelMensual: 0
  });

  const handlePagoMatricula = () => {
    setAlumno((prevAlumno) => ({
      ...prevAlumno,
      matriculaPagada: true
    }));
  };

  const handlePagoArancel = () => {
    setAlumno((prevAlumno) => ({
      ...prevAlumno,
      arancelMensual: prevAlumno.arancelMensual + 1
    }));
  };

  return (
    <div>
      <Typography variant="h2">Estado de pagos del alumno</Typography>
      <Typography>Matrícula pagada: {alumno.matriculaPagada ? 'Sí' : 'No'}</Typography>
      <Typography>Arancel mensual: {alumno.arancelMensual}</Typography>

      {!alumno.matriculaPagada && (
        <Button variant="contained" onClick={handlePagoMatricula}>
          Pagar matrícula
        </Button>
      )}

      <Button variant="contained" onClick={handlePagoArancel}>
        Pagar arancel mensual
      </Button>
    </div>
  );
}

export const TuitionList = () => {
  return (
    <React.Fragment>
      <Helmet title="Blank" />
      <Typography variant="h3" gutterBottom display="inline">
        Matriculas
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        
        <Typography>Matriculas</Typography>
      </Breadcrumbs>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <PaginaAlumno />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
