import React, { useEffect, useState } from "react";
import styled from "styled-components/macro";
import { NavLink, useHistory, useParams } from "react-router-dom";

import { Helmet } from "react-helmet-async";

import {
  Avatar,
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Button,
  Card as MuiCard,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  Divider as MuiDivider,
  Grid,
  Link,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import { red, green } from "@material-ui/core/colors";

import { fontWeight, spacing } from "@material-ui/system";
import {
  getUsers,
  setSelectedUser,
  AddSuscripcion,
  getUser,
  ResetPasswordUser,
  unlockedUser,
  blockedUser,
} from "../redux/actions/usersActions";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/reducers/rootReducer";
import { IUsersState } from "../redux/reducers/usersReducer";
import { timesStampFormattedsimple } from "../utils/utils";
import { NewConfirmDialog } from "../components/NewConfirmDialog";
import { number } from "yup/lib/locale";
import { IAuthState } from "../redux/reducers/authReducer";
import { useFormik } from "formik";
import * as yup from "yup";
import { position } from "polished";
import { ModalInput } from "../components/ModalInput";

const Card = styled(MuiCard)(spacing);

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const FechaActual = new Date();
const ContentCard = () => {
  const { format, addDays } = require("date-fns");
  const history = useHistory();
  const { userId } = useParams<any>();
  const dispatch = useDispatch();
  const activo = green[300];
  const bloqueado = red[300];
  const [openBlocked, setOpenBlocked] = useState(false);
  const [openUnbloqued, setOpenUnblocked] = useState(false);
  const [modal, setModal] = useState<boolean>(false);
  const [inputModal, setInputModal] = useState("");

  const openCloseModal = () => {
    setModal(!modal);
  };

  const handleAccepInput = (value: number) => {
    dispatch(AddSuscripcion(userId, value));
    history.push("/usuarios");
  };

  const handleBloquedUser = (user: any) => {
    setOpenBlocked(false);
    alert("Bloqueando usuario");
  };

  const handleUnbloquedUser = (user: any) => {
    setOpenBlocked(false);
    alert("Bloqueando usuario");
  };
  const { user } = useSelector<RootState, IAuthState>(
    (state) => state.authReducer
  );
  const {
    edit: { selectedUser },
    users,
  } = useSelector<RootState, IUsersState>((state) => state.usersReducer);

  useEffect(() => {
    if (!selectedUser) {
      dispatch(getUser(userId));
    }
  }, [selectedUser, userId]);

  return (
    <>
      <CardHeader
        action={
          <Box display="flex" flexDirection="flex">
            {selectedUser?.TipoUsuario === "Oferente" ? (
              <Button
                variant="contained"
                style={{
                  marginRight: 4,
                  backgroundColor: "#007ac9",
                  color: "white",
                }}
                onClick={openCloseModal}
              >
                {" "}
                Agregar Dias de Suscripcion
              </Button>
            ) : (
              ""
            )}

            {selectedUser?.Estado === "Activo" ? (
              <Button
                variant="contained"
                style={{ backgroundColor: bloqueado, marginRight: 5 }}
                onClick={() => {
                  setOpenBlocked(true);
                }}
              >
                {" "}
                Bloquear Usuario
              </Button>
            ) : (
              <Button
                variant="contained"
                style={{ backgroundColor: activo }}
                onClick={() => {
                  setOpenUnblocked(true);
                }}
              >
                {" "}
                Desbloquear Usuario
              </Button>
            )}
          </Box>
        }
      />
      <Card mb={6}>
        <CardContent>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={12}>
              <Typography variant="h5">Informcaión del Usuario</Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Nombre"
                value={selectedUser?.Nombre}
                fullWidth={true}
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Apellido"
                value={selectedUser?.Apellido}
                InputProps={{
                  readOnly: true,
                }}
                fullWidth={true}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Fecha de Creacion"
                value={timesStampFormattedsimple(
                  selectedUser?.FechaCreacion.toDate()
                )}
                InputProps={{
                  readOnly: true,
                }}
                fullWidth={true}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Telefono"
                value={selectedUser?.Telefono}
                InputProps={{
                  readOnly: true,
                }}
                fullWidth={true}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Direccion"
                multiline
                value={selectedUser?.Direccion}
                InputProps={{
                  readOnly: true,
                }}
                fullWidth={true}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Email"
                value={selectedUser?.Email}
                InputProps={{
                  readOnly: true,
                }}
                fullWidth={true}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              {selectedUser?.TipoUsuario === "Oferente" &&
              selectedUser?.Suscripcion ? (
                <>
                  <label style={{ alignItems: "center" }}>
                    <b>Suscripcion Hasta </b>
                  </label>
                  <TextField
                    value={timesStampFormattedsimple(
                      selectedUser?.Suscripcion?.SuscripcionHasta.toDate()
                    )}
                    InputProps={{
                      readOnly: true,
                    }}
                    fullWidth={true}
                    variant="outlined"
                  />
                </>
              ) : (
                ""
              )}
            </Grid>
            <Grid item xs={12} sm={12}>
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#007ac9",
                  color: "#fff",
                  marginLeft: 6,
                }}
                onClick={() =>
                  dispatch(ResetPasswordUser({ Email: user?.email }))
                }
              >
                Solicitar cambio de contraseña
              </Button>
            </Grid>
          </Grid>
          <NewConfirmDialog
            open={openBlocked}
            onClose={() => setOpenBlocked(false)}
            title="¿Desea Bloquear este usuario?"
            onConfirm={() =>{
              dispatch(blockedUser(userId));
              history.push("/usuarios")
            }}
            onConfirmText={"Bloquear"}
          />
          <NewConfirmDialog
            open={openUnbloqued}
            onClose={() => setOpenUnblocked(false)}
            title="¿Desea Desbloquear este usuario?"
            onConfirm={() => {
              dispatch(unlockedUser(userId));
              history.push("/usuarios")
            }}
            onConfirmText={"Desbloquear"}
          />
          <ModalInput
            value={inputModal}
            title="Cuantos dias quieres Agregar"
            open={modal}
            onClose={openCloseModal}
            onAccept={handleAccepInput}
          />
        </CardContent>
      </Card>
    </>
  );
};

export const ViewUser = () => {
  return (
    <React.Fragment>
      <Helmet title="Blank" />
      <Typography variant="h3" gutterBottom display="inline">
        Vista de Usuario
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} exact to="/usuarios">
          Lista Usuarios
        </Link>
        <Typography>Datos Usuario</Typography>
      </Breadcrumbs>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <ContentCard />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
function dispatch(arg0: any) {
  throw new Error("Function not implemented.");
}
