import { green, red } from "@material-ui/core/colors";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import { spacing } from "@material-ui/system";
import { Download, Eye, MinusSquare, Search } from "react-feather";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory, useParams } from "react-router-dom";
import styled from "styled-components/macro";

import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { College } from "../../../models/College";
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
} from "@material-ui/core";
import { RootState } from "../../../redux/reducers/rootReducer";
import { FormState } from "../../../models/form_state";
import { Tutor } from "../../../models/Tutor";
import { TutorState } from "../../../redux/reducers/tutorReducer";
import { AddTutor, EditTutor, setAddTutorInital, setEditTutorInital } from "../../../redux/actions/tutorActions";
import { getStudents } from "../../../redux/actions/studentActions";
import { StudentState } from "../../../redux/reducers/studentReducer";

const Card = styled(MuiCard)(spacing);

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const TutorForm = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { tutorId } = useParams<{ tutorId: string }>();
  const {
    edit: { selected, state },
  } = useSelector<RootState, TutorState>((state) => state.tutorReducer);

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    dispatch(setEditTutorInital());
    setOpen(false);
    history.push("/apoderados");
  };

  useEffect(() => {
    dispatch(getStudents());
  }, []);

  const { students } = useSelector<RootState, StudentState>(
    (state) => state.studentReducer
  );


  const {
    handleSubmit,
    values,
    handleChange,
    touched,
    setFieldValue,
    errors,
    setValues,
  } = useFormik<Partial<Tutor>>({
    initialValues: {
        Nombre: "",
        ApPaterno: "",
        ApMaterno: "",
        Rut: "",
        Telefono: 0,
        Edad: 0,
        Direccion: "",
    },
    onSubmit: (values) => {
      dispatch(EditTutor(values));
    },
    validationSchema: yup.object({
        Nombre: yup.string().required("Este campo es obligatorio"),
        ApPaterno: yup.string().required("Este campo es obligatorio"),
        ApMaterno: yup.string().required("Este campo es obligatorio"),
        Rut: yup.string().required("Este campo es obligatorio"),
        Telefono: yup.number().min(6).required("Este campo es obligatorio"),
        Edad: yup.number().max(90).required("Este campo es obligatorio"),
        Direccion: yup.string().required("Este campo es obligatorio"),
    }),
  });

  useEffect(() => {
    if (selected) {
      setValues({
        id: selected?.id,
        Nombre: selected?.Nombre,
        ApPaterno: selected?.ApPaterno,
        ApMaterno: selected?.ApMaterno,
        Rut: selected?.Rut,
        Telefono: selected?.Telefono,
        Edad: selected?.Edad,
        Direccion: selected?.Direccion,
      });
    }
    if (state === FormState.Success) {
      handleOpen();
    }
  }, [selected, state]);
  return (
    <>
      <CardHeader />
      <Card mb={6}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              <Grid item xs={3}>
                <TextField
                  id="Nombre"
                  label="Nombre"
                  onChange={handleChange}
                  value={values.Nombre}
                  helperText={touched.Nombre && errors.Nombre}
                  error={touched.Nombre && Boolean(errors.Nombre)}
                />
              </Grid>

              <Grid item xs={3}>
                <TextField
                  id="ApPaterno"
                  label="Apellido Paterno"
                  onChange={handleChange}
                  value={values.ApPaterno}
                  helperText={touched.ApPaterno && errors.ApPaterno}
                  error={touched.ApPaterno && Boolean(errors.ApPaterno)}
                />
              </Grid>

              <Grid item xs={3}>
                <TextField
                  id="ApMaterno"
                  label="Apellido Materno"
                  onChange={handleChange}
                  value={values.ApMaterno}
                  helperText={touched.ApMaterno && errors.ApMaterno}
                  error={touched.ApMaterno && Boolean(errors.ApMaterno)}
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
                  id="Telefono"
                  label="Teléfono"
                  onChange={handleChange}
                  value={values.Telefono}
                  helperText={touched.Telefono && errors.Telefono}
                  error={touched.Telefono && Boolean(errors.Telefono)}
                />
              </Grid>

              <Grid item xs={3}>
                <TextField
                  id="Edad"
                  label="Edad"
                  onChange={handleChange}
                  value={values.Edad}
                  helperText={touched.Edad && errors.Edad}
                  error={touched.Edad && Boolean(errors.Edad)}
                />
              </Grid>

              <Grid item xs={3}>
                <TextField
                  id="Direccion"
                  label="Dirección"
                  onChange={handleChange}
                  value={values.Edad}
                  helperText={touched.Direccion && errors.Direccion}
                  error={touched.Direccion && Boolean(errors.Direccion)}
                />
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
        <DialogTitle>{"Apoderado Editado"}</DialogTitle>
        <DialogContent>
          {"El apoderado se ha editado con éxito"}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose()}>Aceptar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export const editTutorForm = () => {
  return (
    <React.Fragment>
      <Helmet title="Apoderados" />
      <Typography variant="h3" gutterBottom display="inline">
        Lista de Apoderados
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} exact to="/apoderados">
          Lista de Apoderados
        </Link>
        <Typography>Editar apoderados</Typography>
      </Breadcrumbs>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <TutorForm />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
