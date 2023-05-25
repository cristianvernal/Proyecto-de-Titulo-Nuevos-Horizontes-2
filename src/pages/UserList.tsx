import {
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Button, Card as MuiCard,
  CardContent,
  CardHeader,
  Chip,
  Collapse,
  Divider as MuiDivider,
  Fade,
  Grid,
  IconButton, Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from "@material-ui/core";
import { green, red } from "@material-ui/core/colors";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import { spacing } from "@material-ui/system";
import React, { useEffect, useState } from "react";
import { Download, Eye, MinusSquare, Search } from "react-feather";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components/macro";
import { TableSkeleton } from "../components/TableSkeleton";
import { TABLE_LIMITS, TABLE_LIMIT_DEFAULT } from "../constants";
import { useTable } from "../hooks/useTable";
import { FormState } from "../models/form_state";
import {
  getMoreUsers,
  getUsers,
  getUsersFiltered,
  setSelectedUser
} from "../redux/actions/usersActions";
import { RootState } from "../redux/reducers/rootReducer";
import { IUsersState, usersReducer } from "../redux/reducers/usersReducer";
import { useStyles } from "../theme/useStyles";
import {
  cleanString,
  exportToCsv,
  timesStampFormattedsimple
} from "../utils/utils";




const Card = styled(MuiCard)(spacing);

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const orderByUsers = ["Nombre", "Fecha", "Tipo usuario"];

interface filterProps {
  changeOrder: (value: any) => void;
}

const ContentCard = () => {
  const classes = useStyles();
  const dispatch = useDispatch(); //fn para llamar las funciones de backend
  const history = useHistory();
  const activo = green[300];
  const bloqueado = red[300];
  const [sortBy, setSortBy] = useState("Nombre_lower"); //setea una variable de estado
  const [subjectData, setSubjectData] = useState<any>(null);
  const [currentFilter, setCurrentFilter] = useState<any>({});

  const handleGoToViewUser = (data: any) => {
    dispatch(setSelectedUser(data));
    history.push(`/ListaUsuarios/${data.id}/ver`);
  };
  const handleChangeOrder = (order: any) => {
    dispatch(getUsers(limit, order));
  };

  const { limit, page, handleLimitChange, handlePageChange } = useTable({
    limit: TABLE_LIMIT_DEFAULT || 5,
    onLimitChange: (e, newLimit) => {
      if (newLimit > usersReducer.length) {
        if (currentFilter) {
        }
        dispatch(getUsers(newLimit));
      }
    },
    onPageChange: (newPage, oldPage, limit) => {
      if (users.length < totalDocs && newPage > oldPage) {
        dispatch(getMoreUsers(limit));
      }
    },
  });

  useEffect(() => { //por cada cambio de la pag va a ejecutar lo que esta en el comando
    dispatch(getUsers());
  }, []);

  const { users, state, totalDocs } = useSelector<RootState, IUsersState>( //traer datos almacenados en la base de datos
    (state) => state.usersReducer
  );

  console.log(users)
  return (
    <>
      <CardHeader
        action={
          <Button
            startIcon={<Download />}
            style={{
              backgroundColor: "#007ac9",
              color: "#fff",
              marginInlineEnd: 20,
            }}
            variant="contained"
            onClick={() =>
              exportToCsv(
                "usuarios.csv",
                users,
                [
                  "Nombre",
                  "Apellido",
                  "Email",
                  "Telefono",
                  "FechaCreacion",
                  "Direccion",
                  "Estado",
                  "TipoUsuario"
                ],
                [
                  "Nombre",
                  "Apellido",
                  "Email",
                  "Telefono",
                  "Fecha De Registro",
                  "Direccion",
                  "Estado",
                  "Tipo Usuario"
                ]
              )
            }
          >
            Exportar CSV
          </Button>
        }
      />
      <Card mb={6}>
        <FilterSection //filtros
          changeOrder={(order) => {
            setSortBy(order);
            handleChangeOrder(order);
          }}
        />
        <CardContent> 
          <TableContainer className={classes.tableContainer}> 
            <Table size="small" stickyHeader>
              <TableHead> 
                <TableRow>
                  <TableCell align="left">Nombre</TableCell>
                  <TableCell align="left">Apellido</TableCell>
                  <TableCell align="left">Fecha</TableCell>
                  <TableCell align="left">Tipo Usuario</TableCell>
                  <TableCell align="center">Estado</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(state === FormState.Submitting ||
                  state === FormState.Initial) && (
                  <TableSkeleton colSpan={10} limit={10} />
                )}
                {state === FormState.Success &&
                  users
                    .slice(page * limit, page * limit + limit)
                    .map((data) => (
                      <Fade key={data.id} in={true}>
                        <TableRow hover className={classes.styledRow}>
                          <TableCell align="left">{data?.Nombre}</TableCell>
                          <TableCell align="left">{data?.Apellido}</TableCell>
                          <TableCell align="left">
                            {timesStampFormattedsimple(
                              data?.FechaCreacion.toDate()
                            )}
                          </TableCell>
                          <TableCell align="left">
                            {data?.TipoUsuario}
                          </TableCell>
                          <TableCell align="center">
                            {data?.Estado === "Activo" ? (
                              <Chip
                                label="Activo"
                                style={{ backgroundColor: activo, width: 150 }}
                              />
                            ) : (
                              <Chip
                                label="Bloqueado"
                                style={{
                                  backgroundColor: bloqueado,
                                  width: 150,
                                }}
                              />
                            )}
                          </TableCell>
                          <TableCell align="center">
                            <Box style={{ justifyContent: "flex-start" }}>
                              <Tooltip title="Ver">
                                <IconButton
                                  color="primary"
                                  size="small"
                                  onClick={() => handleGoToViewUser(data)}
                                >
                                  <Eye />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      </Fade>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={totalDocs}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handleLimitChange}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={TABLE_LIMITS}
          />
        </CardContent>
      </Card>
    </>
  );
};

const FilterSection: React.FC<filterProps> = ({ changeOrder }) => {
  const dispatch = useDispatch();

  const [openFilter, setOpenFilters] = useState(false);
  const [filtersList, setValueFiltersList] = React.useState<any>({});
  const [valueCreacionStart, setValueCreacionStart] = useState<any>(null);
  const [valueCreacionEnd, setValueCreacionEnd] = useState<any>(null);
  const [valueNombre, setValueNombre] = useState("");
  const [valueApellido, setValueApellido] = useState("");
  const [valueCargo, setValueCargo] = useState<any>(null);

  const handleChangeNombre = (e: any) => {
    setValueNombre(e.target.value);
  };
  const handleChangeApellido = (e: any) => {
    setValueApellido(e.target.value);
  };
  return (
    <CardContent>
      <Grid container justify="space-between">
        <Grid item>
          <Button size="large" onClick={() => setOpenFilters(!openFilter)}>
            Filtros {openFilter ? <ExpandLess /> : <ExpandMore />}
          </Button>
        </Grid>
        <Grid item>
          <Autocomplete
            id="orderby"
            size="small"
            options={orderByUsers}
            style={{ width: 170 }}
            onChange={(event: any, newValue: string | null) => {
              if (newValue === "Fecha") {
                changeOrder("FechaCreacion");
              } else if (newValue === "TipoUsuario") {
                changeOrder("TipoUsuario");
              } else {
                changeOrder("Nombre");
              }
            }}
            renderInput={(params) => (
              <TextField {...params} label="Ordenar por" variant="outlined" />
            )}
          />
        </Grid>
      </Grid>
      <Collapse in={openFilter} timeout="auto" unmountOnExit>
        <Grid container spacing={1} style={{ marginTop: 20 }}>
          <Grid item xs={12} sm={2}>
            <TextField
              id="outlined-basic"
              size="small"
              label="Nombre"
              variant="outlined"
              fullWidth
              value={valueNombre}
              onChange={handleChangeNombre}
              onKeyPress={(ev) => {
                if (ev.key === "Enter") {
                  filtersList["Nombre"] = cleanString(valueNombre);

                  if (!valueNombre) {
                    delete filtersList["Nombre"];
                  }

                  if (Object.keys(filtersList).length > 0) {
                    dispatch(getUsersFiltered(filtersList));
                  } else {
                    dispatch(getUsers());
                  }

                  ev.preventDefault();
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
          <TextField
              id="outlined-basic"
              size="small"
              label="Apellido"
              variant="outlined"
              fullWidth
              value={valueApellido}
              onChange={handleChangeApellido}
              onKeyPress={(ev) => {
                if (ev.key === "Enter") {
                  filtersList["Apellido"] = cleanString(valueApellido);

                  if (!valueApellido) {
                    delete filtersList["Apellido"];
                  }

                  if (Object.keys(filtersList).length > 0) {
                    dispatch(getUsersFiltered(filtersList));
                  } else {
                    dispatch(getUsers());
                  }

                  ev.preventDefault();
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              id="creacion-start"
              label="Fecha Creación: Inicio"
              size="small"
              type="datetime-local"
              value={valueCreacionStart}
              onChange={(event) => {
                setValueCreacionStart(event.target.value);
                filtersList["endAt"] = event.target.value;
              }}
              fullWidth
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              id="creacion-start"
              label="Fecha Creación: Final"
              size="small"
              type="datetime-local"
              value={valueCreacionEnd}
              onChange={(event) => {
                setValueCreacionEnd(event.target.value);
                filtersList["startAt"] = event.target.value;
              }}
              fullWidth
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={1}>
            <Box display="flex">
              <Box mt={1} order={1}>
                <Tooltip title="Buscar">
                  <IconButton
                    size="small"
                    aria-label="Filtrar"
                    onClick={() => {
                      if (valueNombre) {
                        filtersList["Nombre"] = valueNombre;
                      }
                      // if (valueCreacionStart && valueCreacionEnd) {
                      dispatch(getUsersFiltered(filtersList));
                      // }
                    }}
                  >
                    <Search />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box mt={1} order={2}>
                <Tooltip title="Limpiar">
                  <IconButton
                    size="small"
                    aria-label="Borrar filtro"
                    onClick={() => {
                      setValueNombre("");
                      setValueCreacionStart("");
                      setValueCreacionEnd("");
                      setValueFiltersList({});
                      dispatch(getUsers());
                    }}
                  >
                    <MinusSquare />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Collapse>
    </CardContent>
  );
};
export const UserList = () => {
  return (
    <React.Fragment>
      <Helmet title="Usuarios" />
      <Typography variant="h3" gutterBottom display="inline">
        Lista de Usuarios
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Typography>Lista de Usuarios</Typography>
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
