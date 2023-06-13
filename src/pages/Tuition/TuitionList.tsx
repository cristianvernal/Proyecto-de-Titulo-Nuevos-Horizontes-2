import React, {useEffect}from "react";
import styled from "styled-components/macro";
import { NavLink, useHistory } from "react-router-dom";
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
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Fade,
  FormGroup,
  FormControlLabel,
  Switch,
} from "@material-ui/core";

import { spacing } from "@material-ui/system";
import { TutorList } from '../Tutors/TutorList';
import { Table } from "react-bootstrap";
import { useTable } from "../../hooks/useTable";
import { TABLE_LIMIT_DEFAULT } from "../../constants";
import { usersReducer } from "../../redux/reducers/usersReducer";
import { getMoreStudents, getStudents } from "../../redux/actions/studentActions";
import { useStyles } from "../../theme/useStyles";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/reducers/rootReducer";
import { StudentState } from "../../redux/reducers/studentReducer";
import { TableSkeleton } from "../../components/TableSkeleton";
import { Student } from "../../models/Student";
import { FormState } from "../../models/form_state";

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
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const [currentFilter, setCurrentFilter] = useState<any>({});

  const { limit, page, handleLimitChange, handlePageChange } = useTable({
    limit: TABLE_LIMIT_DEFAULT || 5,
    onLimitChange: (e, newLimit) => {
      if (newLimit > usersReducer.length) {
        if (currentFilter) {
        }
        dispatch(getStudents(newLimit));
      }
    },
    onPageChange: (newPage, oldPage, limit) => {
      if (students.length < totalDocs && newPage > oldPage) {
        dispatch(getMoreStudents(limit));
      }
    },
  });



  useEffect(() => {
    dispatch(getStudents());
  }, []);

  const {students, state, totalDocs,
    delete: { state: deleteState },
  } = useSelector<RootState, StudentState>((state) => state.studentReducer);
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
    <Card>
      <CardContent>
        <TableContainer className={classes.tableContainer}>
          <Table size="small" striped>
            <TableHead>
              <TableRow>
                <TableCell align="left">Estudiante</TableCell>
                <TableCell align="left">Rut</TableCell>
                <TableCell align="left">Matricula</TableCell>
                <TableCell align="center">Arancel</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {(state === FormState.Submitting ||
                  state === FormState.Initial) && (
                  <TableSkeleton colSpan={10} limit={10} />
                )}
                {state === FormState.Success &&
                  students
                  .slice(page * limit, page * limit + limit)
                  .map((data:Student) =>(
                    <Fade key={data.id} in={true}>
                      <TableRow hover className={classes.styledRow}>
                        <TableCell align="left">
                        {`${data?.Nombres} ${data?.Apellidos}`}
                        </TableCell>
                        <TableCell align="left">{data?.Rut}</TableCell>
                        <TableCell align="center">
                        <FormGroup>
                        <FormControlLabel control={<Switch defaultChecked />} label="Pagado" />
                        </FormGroup>
                        </TableCell>
                        <TableCell align="center">
                          <Button style={{
                backgroundColor: "#007ac9",
                color: "#fff",
                marginInlineEnd: 20,
                marginLeft: 10,
              }}>Pagar</Button>
                        </TableCell>
                      </TableRow>
                    </Fade>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
    // <div>
    //   <Typography variant="h2">Estado de pagos del alumno</Typography>
    //   <Typography>Matrícula pagada: {alumno.matriculaPagada ? 'Sí' : 'No'}</Typography>
    //   <Typography>Arancel mensual: {alumno.arancelMensual}</Typography>

    //   {!alumno.matriculaPagada && (
    //     <Button variant="contained" onClick={handlePagoMatricula}>
    //       Pagar matrícula
    //     </Button>
    //   )}

    //   <Button variant="contained" onClick={handlePagoArancel}>
    //     Pagar arancel mensual
    //   </Button>
    // </div>
  );
}

export const TuitionList = () => {
  return (
    <React.Fragment>
      <Helmet title="Matriculas" />
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
