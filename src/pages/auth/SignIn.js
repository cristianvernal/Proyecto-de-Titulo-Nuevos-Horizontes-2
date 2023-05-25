import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components/macro";
import { Helmet } from "react-helmet-async";
import * as Yup from "yup";
import { Formik } from "formik";
import { signIn } from "../../redux/actions/authActions";

import {
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  TextField as MuiTextField,
  Box,
  Typography,
  Snackbar,
} from "@material-ui/core";
import { spacing } from "@material-ui/system";
import { Alert as MuiAlert } from "@material-ui/lab";
import logo from "../../vendor/icon.png";
import { closeSnack } from "../../redux/actions/uiActions";
import { FormState } from "../../models/form_state";

const Alert = styled(MuiAlert)(spacing);

const TextField = styled(MuiTextField)(spacing);

const Wrapper = styled(Paper)`
  padding: ${(props) => props.theme.spacing(6)}px;
  ${(props) => props.theme.breakpoints.up("md")} {
    padding: ${(props) => props.theme.spacing(10)}px;
  }
`;

// const BigAvatar = styled(Avatar)`
//   width: 92px;
//   height: 92px;
//   text-align: center;
//   margin: 0 auto ${(props) => props.theme.spacing(5)}px;
// `;

function SignIn() {
  const dispatch = useDispatch();
  const history = useHistory();

  const { user, resetPassStateSetPass } = useSelector((state) => state.authReducer);
  const {
    snack: { snackState, open, text },
  } = useSelector((state) => state.uiReducer);
  useEffect(() => {
    if (user) {
      const lastPath = localStorage.getItem("lastPath") || "/";
      history.replace(lastPath);
    }
  }, [user, history]);

  const saveEmail = (email) => {
    localStorage.setItem("Demandapp-userEmail", email);
  };

  const removeEmail = () => {
    localStorage.removeItem("Demandapp-userEmail");
  };

  const formikRef = React.useRef(null);
  const [checked, setChecked] = React.useState(false);

  useEffect(() => {
    const storageEmail = localStorage.getItem("Demandapp-userEmail");
    formikRef?.current?.setFieldValue("email", storageEmail);

    setChecked(Boolean(storageEmail));
  }, []);

  return (
    <Wrapper>
      <Helmet title="Inicio de Sesión" />
      {/* <Box m={2} display="flex" justifyContent="center">
        <img src={logo} style={{ maxHeight: 60 }} alt="img-logo" />
      </Box> */}

      <Typography component="h1" variant="h4" align="center" gutterBottom>
        Administrador Nuevos Horizontes
      </Typography>
      <Formik
        initialValues={{
          email: "", // ignaciok98@gmail.com
          password: "", // 123456
          submit: false,
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email("Debe ser un email válido")
            .max(255)
            .required("Email es requerido"),
          password: Yup.string().max(255).required("Contraseña es requerida"),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          if (checked) {
            saveEmail(values.email);
          }
          try {
            await dispatch(
              signIn({ email: values.email, password: values.password })
            );
            history.push("/establecimientos");
          } catch (error) {
            const message = error.message || "Something went wrong";

            setStatus({ success: false });
            setErrors({ submit: message });
            setSubmitting(false);
          }
        }}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          values,
        }) => (
          <form noValidate onSubmit={handleSubmit}>
            {errors.submit && (
              <Alert mt={2} mb={1} severity="warning">
                {errors.submit}
              </Alert>
            )}
            <TextField
              type="email"
              name="email"
              label="Dirección de Email"
              value={values.email}
              error={Boolean(touched.email && errors.email)}
              fullWidth
              helperText={touched.email && errors.email}
              onBlur={handleBlur}
              onChange={handleChange}
              my={2}
            />
            <TextField
              type="password"
              name="password"
              label="Contraseña"
              value={values.password}
              error={Boolean(touched.password && errors.password)}
              fullWidth
              helperText={touched.password && errors.password}
              onBlur={handleBlur}
              onChange={handleChange}
              my={2}
            />
            {/* TODO: dejar funcionando el recordarme */}
            <FormControlLabel
              control={
                <Checkbox
                  value="remember"
                  checked={checked}
                  onChange={(event) => {
                    !checked ? saveEmail(values.email) : removeEmail();
                    setChecked(!checked);
                  }}
                  color="primary"
                />
              }
              label="Recordarme"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isSubmitting}
            >
              Iniciar Sesión
            </Button>
            <Button
              component={Link}
              to="/auth/reset-password"
              fullWidth
              color="primary"
            >
              Recuperar contraseña
            </Button>
          </form>
        )}
      </Formik>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={(event, reason) => {
          if (reason === "clickaway") {
            return;
          }
          dispatch(closeSnack());
        }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          elevation={6}
          variant="filled"
          severity={
            resetPassStateSetPass === FormState.Success ? "success" : "error"
          }
        >
          {text}
        </Alert>
      </Snackbar>
    </Wrapper>
  );
}

export default SignIn;
