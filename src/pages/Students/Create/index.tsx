import { green, red } from "@material-ui/core/colors";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import { spacing } from "@material-ui/system";
import { Download, Eye, MinusSquare, Search } from "react-feather";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import styled from "styled-components/macro";

import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import RegionesComunas from "../../../constants/RegionesComunas.json";
import * as yup from "yup";
import {
  Breadcrumbs as MuiBreadcrumbs,
  Divider as MuiDivider,
  Button,
  Grid,
  TextField,
  Card as MuiCard,
  Typography,
  CardHeader,
  CardContent,
  Link,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} 
from "@material-ui/core";
import { AddStudent, setAddStudentInital } from "../../../redux/actions/studentActions";
import { RootState } from "../../../redux/reducers/rootReducer";
import { StudentState } from "../../../redux/reducers/studentReducer";
import { FormState } from "../../../models/form_state";
import { Student } from "../../../models/Student";
import { getColleges } from "../../../redux/actions/collegeActions";
import { CollegeState } from "../../../redux/reducers/collegeReducer";
import { getGrades } from "../../../redux/actions/gradeActions";
import { GradeState } from "../../../redux/reducers/gradeReducer";
import { getTutors } from "../../../redux/actions/tutorActions";
import { TutorState } from "../../../redux/reducers/tutorReducer";



const Card = styled(MuiCard)(spacing);

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const StudentForm = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { add } = useSelector<RootState, StudentState>(
    (state) => state.studentReducer
  );

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    dispatch(setAddStudentInital());
    setOpen(false);
    history.push("/estudiantes");
  };

  useEffect(() => {
    if (add?.state === FormState.Success) {
      handleOpen();
    }
  }, [add?.state]);


  useEffect(() => {
    dispatch(getColleges());
    dispatch(getGrades());
    dispatch(getTutors());
  }, []);

  const { colleges } = useSelector<RootState, CollegeState>(
    (state) => state.collegeReducer
  );

  const { grades } = useSelector<RootState, GradeState>(
    (state) => state.gradeReducer
  );

  const { tutors } = useSelector<RootState, TutorState>(
    (state) => state.tutorReducer
  );


  console.log("formulario estudiante")
  const { handleSubmit, values, handleChange, touched, setFieldValue, errors } =
    useFormik<Partial<Student>>({
      initialValues: {
        Nombres: "",
        Apellidos: "",
        Rut: "",
        Tutor: "",
        FechaNacimiento: "",
        Edad: 0,
        Direccion: "",
        CollegeId: "",
        GradeId: "",
      },
      onSubmit: (values) => {
        dispatch(AddStudent(values));
      },
      validationSchema: yup.object({
        Nombres: yup.string().required("Este campo es obligatorio"),
        Apellidos: yup.string().required("Este campo es obligatorio"),        
        Tutor: yup.string().required("Este campo es obligatorio"),
        Rut: yup.string().required("Este campo es obligatorio"),
        FechaNacimiento: yup.string().required("Este campo es obligatorio"),
        Edad: yup.number().required("Este campo es obligatorio"),
        Direccion: yup.string().required("Este campo es obligatorio"),
        GradeId: yup.string().required("Este campo es obligatorio"),
        CollegeId: yup.string().required("Este campo es requerido"),
      }),
    });

  return (
    <>
      <CardHeader />
      <Card mb={6}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              <Grid item xs={3}>
                <TextField
                  id="Nombres"
                  label="Nombres"
                  onChange={handleChange}
                  value={values.Nombres}
                  helperText={touched.Nombres && errors.Nombres}
                  error={touched.Nombres && Boolean(errors.Nombres)}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  id="Apellidos"
                  label="Apellidos"
                  onChange={handleChange}
                  value={values.Apellidos}
                  helperText={touched.Apellidos && errors.Apellidos}
                  error={touched.Apellidos && Boolean(errors.Apellidos)}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  id="FechaNacimiento"
                  label="Fecha de Nacimiento"
                  onChange={handleChange}
                  value={values.FechaNacimiento}
                  helperText={touched.FechaNacimiento && errors.FechaNacimiento}
                  error={touched.FechaNacimiento && Boolean(errors.FechaNacimiento)}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  id="Rut"
                  label="Rut"
                  onChange={handleChange}
                  value={values.Rut}
                  helperText={touched.Rut && errors.Rut}
                  error={touched.Rut && Boolean(errors.Rut)}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  id="Tutor"
                  label="Tutor"
                  onChange={handleChange}
                  value={values.Tutor}
                  helperText={touched.Tutor && errors.Tutor}
                  error={touched.Tutor && Boolean(errors.Tutor)}
                />
              </Grid>

              
              <Grid item xs={3}>
                <TextField
                  id="Direccion"
                  label="Direccion"
                  onChange={handleChange}
                  value={values.Direccion}
                  helperText={touched.Direccion && errors.Direccion}
                  error={touched.Direccion && Boolean(errors.Direccion)}
                />
              </Grid>
             
              
              <Grid item xs={3}>
                <Box display="flex" style={{ flexDirection: "column" }}>
                  <Box>
                    <Typography variant="caption">Curso</Typography>
                  </Box>
                </Box>
                <Box >
          <FormControl
            style={{minWidth: 177}}
            /*fullWidth={true}*/
            error={touched.GradeId && Boolean(errors.GradeId)}
          >
            <Select
              id="GradeId"
              autoComplete="on"
              name="GradeId"
              
              value={values.GradeId}
              onChange={(e) => {
                handleChange(e);
              }}
              inputProps={{
                name: "GradeId",
                id: "GradeId",
              }}
            >
              {grades.map((grade) => (
                <MenuItem
                  key={grade.id}
                  value={grade.id}
                >{`${grade.Grado}`}</MenuItem>
              ))}
            </Select>
            <FormHelperText>
              {touched.GradeId && errors.GradeId}
            </FormHelperText>
          </FormControl>
        </Box>
              </Grid>


              <Grid item xs={3}>
                <Box display="flex" style={{ flexDirection: "column" }}>
                  <Box>
                    <Typography variant="caption">Colegio</Typography>
                  </Box>
                </Box>
                <Box >
          <FormControl
            style={{minWidth: 177}}
            /*fullWidth={true}*/
            error={touched.CollegeId && Boolean(errors.CollegeId)}
          >
            <Select
              id="CollegeId"
              autoComplete="on"
              name="CollegeId"
              
              value={values.CollegeId}
              onChange={(e) => {
                handleChange(e);
              }}
              inputProps={{
                name: "CollegeId",
                id: "CollegeId",
              }}
            >
              {colleges.map((college) => (
                <MenuItem
                  key={college.id}
                  value={college.id}
                >{`${college.Nombre}`}</MenuItem>
              ))}
            </Select>
            <FormHelperText>
              {touched.CollegeId && errors.CollegeId}
            </FormHelperText>
          </FormControl>
        </Box>
              </Grid>


              <Grid item xs={4}>
                <Button
                  type="submit"
                  variant="contained"
                  style={{
                    backgroundColor: "#007ac9",
                    color: "#fff",
                    marginLeft: 6,
                  }}
                >
                  Guardar
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
      <Dialog open={open} onClose={handleClose}>
        {" "}
        {/* son cuadros de dialogos */}
        <DialogTitle>{"Alumno agregado"}</DialogTitle>
        <DialogContent>
          {"La acción se ha realizado con exito"}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose()}>Aceptar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export const createStudentForm = () => {
  return (
    <React.Fragment>
      <Helmet title="Estudiantes" />
      <Typography variant="h3" gutterBottom display="inline">
        Lista de Estudiantes
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} exact to="/estudiantes">
          Lista de Estudiantes
        </Link>
        <Typography>Crear estudiante</Typography>
      </Breadcrumbs>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <StudentForm />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
