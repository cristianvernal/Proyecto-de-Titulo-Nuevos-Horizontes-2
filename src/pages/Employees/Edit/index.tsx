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
import { Employee } from "../../../models/Employee";
import { EmployeeState } from "../../../redux/reducers/employeeReducer";
import { AddEmployee, EditEmployee, setAddEmployeeInital, setEditEmployeeInital} from "../../../redux/actions/employeeActions";
import { getColleges } from "../../../redux/actions/collegeActions";
import { CollegeState } from "../../../redux/reducers/collegeReducer";
import * as rutUtils from "rut.js";

const Card = styled(MuiCard)(spacing);

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const EmployeeForm = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { employeeId } = useParams<{ employeeId: string }>();
  const {
    edit: { selected, state },
  } = useSelector<RootState, EmployeeState>((state) => state.employeeReducer);

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    dispatch(setEditEmployeeInital());
    setOpen(false);
    history.push("/trabajadores");
  };

  useEffect(() => {
    dispatch(getColleges());
  }, []);


  const { colleges } = useSelector<RootState, CollegeState>(
    (state) => state.collegeReducer
  );

  const {
    handleSubmit,
    values,
    handleChange,
    touched,
    setFieldValue,
    errors,
    setValues,
  } = useFormik<Partial<Employee>>({
    initialValues: {
        Nombre: "",
        ApPaterno: "",
        ApMaterno: "",
        Rut: "",
        Telefono: "",
        Edad: 0,
        Direccion: "",
        CollegeId: "",
    },
    onSubmit: (values) => {
      dispatch(EditEmployee(values));
    },
    validationSchema: yup.object({
        Nombre: yup.string().required("Este campo es obligatorio"),
        ApPaterno: yup.string().required("Este campo es obligatorio"),
        ApMaterno: yup.string().required("Este campo es obligatorio"),
        Rut: yup
        .string()
        .min(11)
        .required("Rut es requerido")
        .test({
          name: "Rut",
          message: "Rut no válido",
          test: (value) => {
            if (!value) return false;
            return rutUtils.validate(value);
          },
        }),
        Telefono: yup.number().min(6).required("Este campo es obligatorio"),
        Edad: yup.number().max(90).required("Este campo es obligatorio"),
        Direccion: yup.string().required("Este campo es obligatorio"),
        CollegeId: yup.string().required("Este campo es requerido"),
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
                  onChange={(e) => {
                    e.target.value = rutUtils.format(e.target.value);
                    handleChange(e);
                  }}
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
                  value={values.Direccion}
                  helperText={touched.Direccion && errors.Direccion}
                  error={touched.Direccion && Boolean(errors.Direccion)}
                />
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
        <DialogTitle>{"Trabajador Editado"}</DialogTitle>
        <DialogContent>
          {"El trabajador se ha editado con éxito"}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose()}>Aceptar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export const editEmployeeForm = () => {
  return (
    <React.Fragment>
      <Helmet title="Trabajadores" />
      <Typography variant="h3" gutterBottom display="inline">
        Editar Trabajador
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} exact to="/trabajadores">
          Trabajadores
        </Link>
        <Typography>Editar trabajadores</Typography>
      </Breadcrumbs>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <EmployeeForm />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
