import {
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Button,
  Card as MuiCard,
  CardContent,
  CardHeader,
  Collapse,
  Divider as MuiDivider,
  Fade,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import { spacing } from "@material-ui/system";
import React, { useEffect, useState } from "react";
import {
  Download,
  Edit,
  MinusSquare,
  Plus,
  Search,
  Trash,
} from "react-feather";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components/macro";
import { NewConfirmDialog } from "../components/NewConfirmDialog";
import { TableSkeleton } from "../components/TableSkeleton";
import { TABLE_LIMITS, TABLE_LIMIT_DEFAULT } from "../constants";
import { useTable } from "../hooks/useTable";
import {
  getMoreUsers,
  deleteUser,
  getUsers,
  getUsersFiltered,
  setSelectedUser,
} from "../redux/actions/usersActions";
import { RootState } from "../redux/reducers/rootReducer";
import { IUsersState } from "../redux/reducers/usersReducer";
import { useStyles } from "../theme/useStyles";
import { cleanString, timesStampFormattedsimple } from "../utils/utils";

const Card = styled(MuiCard)(spacing);

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const orderByUsers = ["Nombre", "Fecha", "Cargo"];

interface filterProps {
  changeOrder: (value: any) => void;
}

const ContentCard = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const [openDelete, setOpenDelete] = useState(false);
  const [deleteSubject, setDeleteSubject] = useState(undefined);
  const [sortBy, setSortBy] = useState("Nombre_lower");

  const handleDeleteUser = (user: any) => {
    setOpenDelete(false);
    dispatch(deleteUser(user));
  };

  const handleGoToEditUser = (user: any) => {
    dispatch(setSelectedUser(user));
    history.push(`/editar/${user.id}`);
  };

  const handleGoCreateUser = () => {
    history.push(`/crear`);
  };

  const handleChangeOrder = (order: any) => {
    console.log(order);

    dispatch(getUsers(order));
  };

  const { limit, page, handleLimitChange, handlePageChange } = useTable({
    limit: TABLE_LIMIT_DEFAULT,
    onLimitChange: (e, newLimit) => {
      if (newLimit > users.length) {
        dispatch(getUsers(newLimit));
      }
    },
    onPageChange: (newPage, oldPage, limit) => {
      if (users.length < totalDocs && newPage > oldPage) {
        dispatch(getMoreUsers(limit));
      }
    },
  });

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const { totalDocs, users } = useSelector<RootState, IUsersState>(
    (state) => state.usersReducer
  );

  return (
    <>
      <CardHeader
        action={
          <>
            <Button
              startIcon={<Plus />}
              style={{ backgroundColor: "#bef67a" }}
              variant="contained"
              onClick={handleGoCreateUser}
            >
              Nuevo Usuario
            </Button>
          </>
        }
      />
      <Card mb={6}>
        {/* FILTRO INICIO */}

        <CardContent>
          <TableContainer className={classes.tableContainer}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Fecha Creación</TableCell>
                  <TableCell>Cargo</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {true ? (
                  users
                    .slice(page * limit, page * limit + limit)
                    .map((data) => (
                      <Fade key={data.id} in={true}>
                        <TableRow hover className={classes.styledRow}>
                          <TableCell>
                            {data?.Nombre + " " + data?.Apellido}
                          </TableCell>
                          <TableCell>
                            {data?.FechaIngreso
                              ? timesStampFormattedsimple(
                                  data?.FechaIngreso.toDate()
                                )
                              : ""}
                          </TableCell>
                          <TableCell>{data?.Cargo}</TableCell>
                          <TableCell align="center">
                            <Box display="flex" justifyContent="flex-start">
                              <Tooltip title="Editar">
                                <IconButton
                                  color="primary"
                                  size="small"
                                  onClick={() => handleGoToEditUser(data)}
                                >
                                  <Edit />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Eliminar">
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    setDeleteSubject(data);
                                    setOpenDelete(true);
                                  }}
                                >
                                  <Trash color="red" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      </Fade>
                    ))
                ) : (
                  <TableSkeleton colSpan={10} limit={10} />
                )}
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
        <NewConfirmDialog
          open={openDelete}
          onClose={() => setOpenDelete(false)}
          title="¿Desea eliminar al usuario?"
          onConfirm={() => handleDeleteUser(deleteSubject)}
          onConfirmText={"Eliminar"}
        />
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
  const [valueCargo, setValueCargo] = useState<any>(null);

  const handleChangeNombre = (e: any) => {
    setValueNombre(e.target.value);
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
                changeOrder("FechaIngreso");
              } else if (newValue === "Cargo") {
                changeOrder("Cargo");
              } else {
                changeOrder("Nombre_lower");
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
                  filtersList["Nombre_lower"] = cleanString(valueNombre);

                  if (!valueNombre) {
                    delete filtersList["Nombre_lower"];
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
                      if (valueCreacionStart && valueCreacionEnd) {
                        dispatch(getUsersFiltered(filtersList));
                      }
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
                      setValueCargo("");
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

export const Users = () => (
  <React.Fragment>
    <Helmet title="Usuarios" />
    <Typography variant="h3" gutterBottom display="inline">
      Usuarios Registrados
    </Typography>

    <Breadcrumbs aria-label="Breadcrumb" mt={2}>
      <Typography>Listado</Typography>
    </Breadcrumbs>

    <Divider my={6} />

    <Grid container spacing={3}>
      <Grid item xs={12}>
        <ContentCard />
      </Grid>
    </Grid>
  </React.Fragment>
);
