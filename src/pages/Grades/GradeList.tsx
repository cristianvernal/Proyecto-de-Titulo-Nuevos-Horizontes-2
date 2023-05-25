import {
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Button,
  Card as MuiCard,
  CardContent,
  CardHeader,
  Chip,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { green, red } from "@material-ui/core/colors";
import { Edit, ExpandLess, ExpandMore, Person } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import { spacing } from "@material-ui/system";
import React, { useEffect, useState } from "react";
import { Download, Eye, MinusSquare, Search, Trash } from "react-feather";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components/macro";
import { TableSkeleton } from "../../components/TableSkeleton";
import { TABLE_LIMITS, TABLE_LIMIT_DEFAULT } from "../../constants";
import { FormState } from "../../models/form_state";
import {
  getMoreUsers,
  getUsers,
  getUsersFiltered,
  setSelectedUser,
} from "../../redux/actions/usersActions";
import { RootState } from "../../redux/reducers/rootReducer";
import { IUsersState, usersReducer } from "../../redux/reducers/usersReducer";
import { useStyles } from "../../theme/useStyles";
import {
  cleanString,
  exportToCsv,
  timesStampFormattedsimple,
} from "../../utils/utils";
import { useTable } from "../../hooks/useTable";
import {
  addGrade,
  deleteGrade,
  getGrades,
  getMoreGrades,
  setAddGradeInital,
  setDeleteGradeInital,
  setEditGradeInital,
  updateGrade,
} from "../../redux/actions/gradeActions";
import { GradeState } from "../../redux/reducers/gradeReducer";
import { Grade } from "../../models/Grade";
import { ModalGrades } from "../../components/ModalGrades";
import { Employee } from '../../models/Employee';
import { EmployeeState } from "../../redux/reducers/employeeReducer";
import { GetTeachers } from "../../redux/actions/employeeActions";

const Card = styled(MuiCard)(spacing);

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const orderByUsers = ["Nombre", "Fecha", "Tipo usuario"];

interface filterProps {
  changeOrder: (value: any) => void;
}

const ContentCard = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const activo = green[300];
  const bloqueado = red[300];
  const [sortBy, setSortBy] = useState("Nombre_lower");
  const [subjectData, setSubjectData] = useState<any>(null);
  const [currentFilter, setCurrentFilter] = useState<any>({});
  const [openCreateEditModal, setOpenCreateEditModal] = useState(false);
  const [selected, setSelected] = useState<Grade | null>(null);
  const [openDeleteModal, setopenDeleteModal] = useState(false);
  const [modalState, setModalState] = useState({
    open: false,
    action: "",
    state: "",
  });

  const handleCloseStateModal = () => {
    setModalState({
      open: false,
      action: "",
      state: "",
    });
    dispatch(setAddGradeInital());
    dispatch(setDeleteGradeInital());
    dispatch(setEditGradeInital());
  };

  const handleOpenEdit = (selected: Grade) => {
    setSelected(selected);
    setOpenCreateEditModal(true);
  };

  const handleOpenDeleteModal = (data: Grade) => {
    setSelected(data);
    setopenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setopenDeleteModal(false);
  };

  const handleDelete = () => {
    dispatch(deleteGrade(selected! && selected.id));
    handleCloseDeleteModal();
  };

  const handleOpenCreateModal = () => {
    setOpenCreateEditModal(true);
  };

  const handleCloseCreateModal = () => {
    setOpenCreateEditModal(false);
  };

  const handleCreate = (values: any) => {
    dispatch(addGrade(values));
    handleCloseCreateModal();
  };

  const handleEdit = (values: Partial<Grade>) => {
    dispatch(updateGrade(values));
    handleCloseCreateModal();
  };

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
        dispatch(getGrades(newLimit));
      }
    },
    onPageChange: (newPage, oldPage, limit) => {
      if (grades.length < totalDocs && newPage > oldPage) {
        dispatch(getMoreGrades(limit));
      }
    },
  });

  const {employees:Teachers} = useSelector <RootState, EmployeeState>(
    (state) => state.employeeReducer
  );

  useEffect(() => {
    dispatch(getGrades());
    dispatch(GetTeachers());
  }, []);

  const {
    grades,
    state,
    totalDocs,
    add: { state: addState },
    delete: { state: deleteState },
    edit: { state: editState },
  } = useSelector<RootState, GradeState>((state) => state.gradeReducer);

  useEffect(() => {
    if (addState === FormState.Success) {
      setModalState({
        open: true,
        action: "Creado",
        state: "con éxito",
      });
    }
    if (editState === FormState.Success) {
      setModalState({
        open: true,
        action: "Editado",
        state: "con éxito",
      });
    }

    if (deleteState === FormState.Success) {
      setModalState({
        open: true,
        action: "Eliminado",
        state: "con éxito",
      });
    }
  }, [addState, deleteState, editState]);
  return (
    <>
      <CardHeader
        action={
          <>
            <Button
              startIcon={<AddIcon />}
              style={{
                backgroundColor: "#007ac9",
                color: "#fff",
                marginInlineEnd: 20,
                marginLeft: 10,
              }}
              onClick={() => handleOpenCreateModal()}
            >
              Agregar curso
            </Button>
          </>
        }
      />
      <Card mb={6}>
        <FilterSection
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
                  <TableCell align="left">Grado</TableCell>
                  <TableCell align="center">Paralelo</TableCell>
                  <TableCell align="center">Profesor</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(state === FormState.Submitting ||
                  state === FormState.Initial) && (
                  <TableSkeleton colSpan={10} limit={10} />
                )}
                {state === FormState.Success &&
                  grades

                    .slice(page * limit, page * limit + limit)
                    .map((data: Grade) => (
                      <Fade key={data.id} in={true}>
                        <TableRow hover className={classes.styledRow}>
                          <TableCell align="left">{data?.Grado}</TableCell>
                          <TableCell align="center">{data?.Paralelo}</TableCell>
                          <TableCell align="center">{`${data?.TeacherData?.Nombre} ${data?.TeacherData?.ApPaterno} ${data?.TeacherData?.ApMaterno}` }</TableCell> 
                          <TableCell align="center">
                            <Box style={{ justifyContent: "flex-start" }}>
                            <Tooltip title="Administrar Estudiantes">
                                <IconButton
                                  color="primary"
                                  size="small"
                                  onClick={() => history.push("/cursos/adminEstudiantes")}
                                >
                                  <Person />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Editar">
                                <IconButton
                                  color="primary"
                                  size="small"
                                  onClick={() => handleOpenEdit(data)}
                                >
                                  <Edit />
                                </IconButton>
                              </Tooltip>
                             
                              <Tooltip title="Eliminar">
                                <IconButton
                                  color="primary"
                                  size="small"
                                  onClick={() => {
                                    handleOpenDeleteModal(data);
                                  }}
                                >
                                  <Trash />
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
      <ModalGrades
        open={openCreateEditModal}
        title={selected ? "Editar Curso" : "Crear curso"}
        onClose={handleCloseCreateModal}
        teachers={Teachers}
        onAccept={handleCreate}
        onEdit={handleEdit}
        value={""}
        selected={selected ? selected : undefined}
      />
      <Dialog open={openDeleteModal} onClose={handleCloseDeleteModal}>
        {" "}
        {/* son cuadros de dialogos */}
        <DialogTitle>{"Eliminar Curso"}</DialogTitle>
        <DialogContent>
          {"¿Está seguro que desea eliminar el curso?"}
        </DialogContent>
        <Box display={"flex"} justifyContent={"end"}>
          <DialogActions>
            <Button
              variant="contained"
              color={"primary"}
              onClick={() => handleDelete()}
            >
              Aceptar
            </Button>
          </DialogActions>
          <DialogActions>
            <Button
              variant="contained"
              color={"default"}
              onClick={() => handleCloseDeleteModal()}
            >
              Cancelar
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
      <Dialog open={modalState.open} onClose={handleCloseStateModal}>
        {" "}
        {/* son cuadros de dialogos */}
        <DialogTitle>{`Curso ${modalState.action}`}</DialogTitle>
        <DialogContent>
          {`El curso se ha ${cleanString(modalState.action)} ${
            modalState.state
          }`}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseStateModal()}>Aceptar</Button>
        </DialogActions>
      </Dialog>
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
export const GradeList = () => {
  return (
    <React.Fragment>
      <Helmet title="Cursos" />
      <Typography variant="h3" gutterBottom display="inline">
        Lista de Cursos
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Typography>Lista de Cursos</Typography>
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
