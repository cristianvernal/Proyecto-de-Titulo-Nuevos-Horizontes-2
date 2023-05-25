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
import {
  AddCollege,
  setAddCollegeInital,
} from "../../../redux/actions/collegeActions";
import { RootState } from "../../../redux/reducers/rootReducer";
import { CollegeState } from "../../../redux/reducers/collegeReducer";
import { FormState } from "../../../models/form_state";

const Card = styled(MuiCard)(spacing);

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const CollegeForm = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { add } = useSelector<RootState, CollegeState>(
    (state) => state.collegeReducer
  );

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    dispatch(setAddCollegeInital());
    setOpen(false);
    history.push("/establecimientos");
  };

  useEffect(() => {
    if (add?.state === FormState.Success) {
      handleOpen();
    }
  }, [add?.state]);

  const { handleSubmit, values, handleChange, touched, setFieldValue, errors } =
    useFormik<Partial<College>>({
      initialValues: {
        Nombre: "",
        Direccion: "",
        Telefono: 0,
        Region: "",
        Comuna: "",
      },
      onSubmit: (values) => {
        dispatch(AddCollege(values));
      },
      validationSchema: yup.object({
        Nombre: yup.string().required("Este campo es obligatorio"),
        Direccion: yup.string().required("Este campo es obligatorio"),
        Telefono: yup.number().min(6).required("Este campo es obligatorio"),
        Region: yup.string().required("Este campo es obligatorio"),
        Comuna: yup.string().required("Este campo es obligatorio"),
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
                  id="Direccion"
                  label="Direccion"
                  onChange={handleChange}
                  value={values.Direccion}
                  helperText={touched.Direccion && errors.Direccion}
                  error={touched.Direccion && Boolean(errors.Direccion)}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  id="Telefono"
                  label="Telefono"
                  onChange={handleChange}
                  value={values.Telefono}
                  helperText={touched.Telefono && errors.Telefono}
                  error={touched.Telefono && Boolean(errors.Telefono)}
                />
              </Grid>
              <Grid item xs={3}>
                <Box display="flex" style={{ flexDirection: "column" }}>
                  <Box>
                    <Typography variant="caption">{"Región"}</Typography>
                  </Box>
                </Box>
                <Box>
                  <FormControl
                    fullWidth
                    error={touched.Region && Boolean(errors.Region)}
                  >
                    <Select
                      id="Region"
                      name="Region"
                      value={values.Region}
                      onChange={(e) => {
                        handleChange(e);
                      }}
                    >
                      {RegionesComunas.regiones?.map((region: any) => (
                        <MenuItem key={region.region} value={region.region}>
                          {region.region}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {touched.Region && errors.Region}
                    </FormHelperText>
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box display="flex" style={{ flexDirection: "column" }}>
                  <Box>
                    <Typography variant="caption">{"Comuna"}</Typography>
                  </Box>
                </Box>
                <Box>
                  <FormControl
                    fullWidth
                    error={touched.Comuna && Boolean(errors.Comuna)}
                  >
                    <Select
                      id="Comuna"
                      name="Comuna"
                      value={values.Comuna}
                      onChange={(e) => {
                        handleChange(e);
                      }}
                    >
                      {values.Region &&
                        RegionesComunas.regiones
                          .find((x) => x.region === values.Region)
                          ?.comunas.map((comuna: any) => (
                            <MenuItem key={comuna} value={comuna}>
                              {comuna}
                            </MenuItem>
                          ))}
                    </Select>
                    <FormHelperText>
                      {touched.Comuna && errors.Comuna}
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
        <DialogTitle>{"Establecimiento Creado"}</DialogTitle>
        <DialogContent>
          {"El establecimiento se ha creado con éxito"}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose()}>Aceptar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export const createCollegeForm = () => {
  return (
    <React.Fragment>
      <Helmet title="Establecimientos" />
      <Typography variant="h3" gutterBottom display="inline">
        Lista de Establecimientos
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} exact to="/establecimientos">
          Lista de Establecimientos
        </Link>
        <Typography>Crear establecimiento</Typography>
      </Breadcrumbs>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <CollegeForm />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
