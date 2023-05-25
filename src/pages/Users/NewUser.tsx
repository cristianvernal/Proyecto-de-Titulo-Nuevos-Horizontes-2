import {
  Breadcrumbs as MuiBreadcrumbs,
  Button,
  Card as MuiCard,
  CardContent,
  Divider as MuiDivider,
  Grid,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { spacing } from "@material-ui/system";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import * as rutUtils from "rut.js";
import styled from "styled-components/macro";
import * as yup from "yup";
import { createUser } from "../../redux/actions/usersActions";
import { RootState } from "../../redux/reducers/rootReducer";
import { timesStampFormattedsimple } from "../../utils/utils";

const Card = styled(MuiCard)(spacing);

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const ContentCard = () => {
  const tipoPermisosOptions: any[] = [
    { Nombre: "Administración", Tipo: "Admin" },
    { Nombre: "Supervisión", Tipo: "Jefe" },
    { Nombre: "Terreno", Tipo: "Usuario" },
  ];

  const dispatch = useDispatch();
  const history = useHistory();

  const [valPermiso, setValPermiso] = useState<string | null>(null);
  const [valCargo, setValCargo] = useState<string | null>(null);

  const { handleSubmit, values, handleChange, touched, errors } = useFormik({
    initialValues: {
      Activo: true,
      Nombre: "",
      Apellido: "",
      Email: "",
      Contrasenia: "",
      Rut: "",
      Edad: "",
      Telefono: "",
      FechaIngreso: new Date(),
      Area: "",
      TipoPermisos: "",
    },
    onSubmit: (values) => {
      values.Telefono = "+569" + values.Telefono;
      dispatch(createUser(values));
      history.push(`/usuarios/listado`);
    },
    validationSchema: yup.object({
      Nombre: yup.string().required("Nombre requerido"),
      Apellido: yup.string().required("Apellido requerido"),
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
      Edad: yup
        .number()
        .positive("Debe ser edad válida")
        .required("Edad es requerida"),
      Telefono: yup
        .number()
        .required("Es requerido")
        .test("len", "Número no válido", (val: any) => {
          try {
            return val.toString().length === 8;
          } catch {
            return false;
          }
        })
        .required("Número es requerido"),
      Email: yup.string().email("Email no válido").required("Email requerido"),
      Contrasenia: yup.string().required("Contraseña requerida"),
      Area: yup.string().required("Área requerida"),
    }),
  });

  return (
    <Card mb={6}>
      <CardContent>
        <form noValidate onSubmit={handleSubmit}>
          <Grid container justify="center" spacing={3}>
            <Grid container item xs={12} sm={8} spacing={3}>
              <Grid item sm={12}>
                <Typography variant="h6" gutterBottom>
                  Información personal
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="Nombre"
                  label="Nombre"
                  value={values.Nombre}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  error={touched.Nombre && Boolean(errors.Nombre)}
                  helperText={touched.Nombre && errors.Nombre}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="Apellido"
                  label="Apellido"
                  value={values.Apellido}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  error={touched.Apellido && Boolean(errors.Apellido)}
                  helperText={touched.Apellido && errors.Apellido}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  id="Edad"
                  label="Edad"
                  type="number"
                  value={values.Edad}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  error={touched.Edad && Boolean(errors.Edad)}
                  helperText={touched.Edad && errors.Edad}
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  id="Rut"
                  label="Rut"
                  value={values.Rut}
                  onChange={(e) => {
                    e.target.value = rutUtils.format(e.target.value);
                    handleChange(e);
                  }}
                  variant="outlined"
                  fullWidth
                  error={touched.Rut && Boolean(errors.Rut)}
                  helperText={touched.Rut && errors.Rut}
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  id="Telefono"
                  label="Teléfono"
                  value={values.Telefono}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  error={touched.Telefono && Boolean(errors.Telefono)}
                  helperText={touched.Telefono && errors.Telefono}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">+569</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item sm={12}>
                <Typography variant="h6" gutterBottom>
                  Datos cuenta
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  id="Email"
                  label="Email"
                  type="email"
                  value={values.Email}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  error={touched.Email && Boolean(errors.Email)}
                  helperText={touched.Email && errors.Email}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  id="Contrasenia"
                  label="Contraseña"
                  name="Contrasenia"
                  value={values.Contrasenia}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  error={touched.Contrasenia && Boolean(errors.Contrasenia)}
                  helperText={touched.Contrasenia && errors.Contrasenia}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Grid item sm={12} container spacing={3}>
                <Grid item sm={12}>
                  <Typography variant="h6" gutterBottom>
                    Datos organizacionales
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    id="Area"
                    label="Área"
                    value={values.Area}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                    error={touched.Area && Boolean(errors.Area)}
                    helperText={touched.Area && errors.Apellido}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    id="FechaIngreso"
                    type="text"
                    label="Fecha Ingreso"
                    value={timesStampFormattedsimple(values.FechaIngreso)}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                    inputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item></Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item container justify="flex-end" sm={12}>
            <Button variant="contained" type="submit" color="primary">
              Guardar
            </Button>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export const NewUser = React.memo(() => {
  return (
    <React.Fragment>
      <Helmet title="Nuevo Usuario" />
      <Typography variant="h3" gutterBottom display="inline">
        Nuevo Usuario
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} exact to="/usuarios/listado">
          Listado
        </Link>
        <Typography>Crear usuario</Typography>
      </Breadcrumbs>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <ContentCard />
        </Grid>
      </Grid>
    </React.Fragment>
  );
});
