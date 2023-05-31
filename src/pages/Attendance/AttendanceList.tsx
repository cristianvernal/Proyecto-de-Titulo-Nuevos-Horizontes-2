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
  import { Edit, ExpandLess, ExpandMore, ListAlt } from "@material-ui/icons";
  import { Autocomplete } from "@material-ui/lab";
  import { spacing } from "@material-ui/system";
  import React, { useEffect, useState } from "react";
  import { MinusSquare, Search, Trash } from "react-feather";
  import { Helmet } from "react-helmet-async";
  import { useDispatch, useSelector } from "react-redux";
  import { useHistory } from "react-router-dom";
  import styled from "styled-components/macro";
  import { TableSkeleton } from "../../components/TableSkeleton";
  import { TABLE_LIMITS, TABLE_LIMIT_DEFAULT } from "../../constants";
  import { useTable } from "../../hooks/useTable";
  import { FormState } from "../../models/form_state";
  import {
    getUsers,
    getMoreUsers,
    getUsersFiltered,
    setSelectedUser,
  } from "../../redux/actions/usersActions";
  import { RootState } from "../../redux/reducers/rootReducer";
  import { usersReducer } from "../../redux/reducers/usersReducer";
  import { useStyles } from "../../theme/useStyles";
  import { cleanString } from "../../utils/utils";
  import {
    getMoreEmployees,
    getEmployees,
    deleteEmployee,
    setDeleteEmployeeInital,
    setSelectedEmployee,
  } from "../../redux/actions/employeeActions";
  import { EmployeeState } from "../../redux/reducers/employeeReducer";
  import { Employee } from '../../models/Employee';
  import { ModalAcademicCharge } from "../../components/ModalAcademicCharge";
  import { getSubjtectByTeacherId } from "../../redux/actions/subjectActions";
  import { SubjectState } from "../../redux/reducers/subjectReducer";
  import { getColleges } from "../../redux/actions/collegeActions";
  import { CollegeState } from "../../redux/reducers/collegeReducer";
  import { Curriculum } from "../../models/Curriculum";
  import { CurriculumList } from '../Curriculum/CurriculumList';
import { getMoreStudents, getStudents } from "../../redux/actions/studentActions";
import { StudentState } from "../../redux/reducers/studentReducer";
import { Student } from "../../models/Student";
import { Attendance } from "../../models/Attendance";
  
  
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
    const [openConfirm, setOpenConfirm] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selected, setSelected] = useState<any | null>(null);
    const bloqueado = red[300];
    const [sortBy, setSortBy] = useState("Nombre_lower");
    const [subjectData, setSubjectData] = useState<any>(null);
    const [currentFilter, setCurrentFilter] = useState<any>({});
    const [openChargeModal, setOpenChargeModal] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [selectedAsistencia, setSelectedAsistencia] = useState("");
      
    const handleOpenChargeModal = (data: any) => {
     setSubjects(data)
      setOpenChargeModal(true);
    };
  
    const handleCloseChargeModal = () => {
      setOpenChargeModal(false);
    };
  
    const handleOpenConfirm = () => {
      setOpenConfirm(true);
    };
  
    const handleOpenDeleteModal = (selected: any) => {
      setSelected(selected);
      setOpenDeleteModal(true);
    };
  
    const handleOpenCreateModal = () => {
      setOpenCreateEditModal(true);
    };
    
    const handleDelete = (selected: any) => {
      dispatch(deleteEmployee(selected));
      setOpenDeleteModal(false);
    };
    const handleCloseDeleteModal = () => {
      setOpenDeleteModal(false);
    };
  
    const handleCloseConfirm = () => {
      dispatch(setDeleteEmployeeInital());
      setOpenConfirm(false);
    };
  
    //Funcion para ir a editar
  
    const handleGoToEdit = (data: any) => {
      dispatch(setSelectedEmployee(data));
      history.push(`/trabajadores/${data.id}/editar`);
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
          dispatch(getStudents(newLimit));
        }
      },
      onPageChange: (newPage, oldPage, limit) => {
        if (students.length < totalDocs && newPage > oldPage) {
          dispatch(getMoreStudents(limit));
        }
      },
    });
  
    useEffect(() => {
      dispatch(getStudents());
      dispatch(getMoreStudents());
    }, []);
  
    const {
      students,
      state,
      totalDocs,
      delete: { state: deleteState },
    } = useSelector<RootState, StudentState>((state) => state.studentReducer);
  
    // const { subjects } = useSelector<RootState, SubjectState>(
    //   (state: any) => state.subjectReducer
    // );
  
    useEffect(() => {
      if (deleteState === FormState.Success) {
        handleOpenConfirm();
      }
    }, [deleteState]);
  /* console.log(employees); */
    return (
      <>
        {/* <CardHeader
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
                onClick={() => {
                  history.push("/trabajadores/Crear");
                }}
              >
                Agregar trabajador
              </Button>
            </>
          }
        /> */}
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
                    <TableCell align="left">Estudiante</TableCell>
                    <TableCell align="center">Fecha Asistencia</TableCell>
                    <TableCell align="center">Observaciones</TableCell>
                    {/* <TableCell align="center"></TableCell> */}
                    {/* <TableCell align="center">Establecimiento</TableCell>
                    <TableCell align="center">Acciones</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(state === FormState.Submitting ||
                    state === FormState.Initial) && (
                    <TableSkeleton colSpan={10} limit={10} />
                  )}
                  {state === FormState.Success &&
                    students
  
                      .slice(page * limit, page * limit + limit)
                      .map((data: Student) => (
                        <Fade key={data.id} in={true}>
                          <TableRow hover className={classes.styledRow}>
                            <TableCell align="left">{`${data.Nombres} ${data?.Apellidos}`}</TableCell>
                            <TableCell align="center"> 
                                <input type="radio" value="Presente" name="Asistencia" checked={selectedAsistencia === "Presente"}
                                      onChange={() => setSelectedAsistencia("Presente")} /> Presente
                                <input type="radio" value="Ausente" name="Asistencia" checked={selectedAsistencia === "Ausente"} 
                                      onChange={() => setSelectedAsistencia("Ausente")} /> Ausente
                            </TableCell>
                            {/* <TableCell align="center">{data?.Telefono}</TableCell> */}
                            <TableCell align="center">
                              <Box style={{ justifyContent: "flex-start" }}>
                                <Tooltip title="Editar">
                                  <IconButton
                                    color="primary"
                                    size="small"
                                    onClick={() => {
                                      handleGoToEdit(data);
                                      /* aqui ${data?.GradeData?.StudentId} */
                                    }}
                                  >
                                    <Edit />
                                  </IconButton>
                                </Tooltip>
                               
                                {/* <Tooltip title="Eliminar">
                                  <IconButton
                                    color="primary"
                                    size="small"
                                    onClick={() => handleOpenDeleteModal(data)}
                                  >
                                    <Trash />
                                  </IconButton>
                                </Tooltip> */}
                              
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
        <ModalAcademicCharge
          open={openChargeModal}
          onClose={handleCloseChargeModal}
          subjects={subjects}
          
        />
        <Dialog open={openDeleteModal} onClose={handleCloseDeleteModal}>
          {" "}
          {/* son cuadros de dialogos */}
          <DialogTitle>{"Eliminar trabajador"}</DialogTitle>
          <DialogContent>
            {"¿Está seguro que desea eliminar el trabajador?"}
          </DialogContent>
          <Box display={"flex"} justifyContent={"end"}>
            <DialogActions>
              <Button
                variant="contained"
                color={"primary"}
                onClick={() => handleDelete(selected)}
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
        <Dialog open={openConfirm} onClose={handleCloseConfirm}>
          {" "}
          {/* son cuadros de dialogos */}
          <DialogTitle>{"Trabajador Eliminado"}</DialogTitle>
          <DialogContent>
            {"El trabajador se ha eliminado con éxito"}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleCloseConfirm()}>Aceptar</Button>
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
  export const AttendanceList = () => {
    return (
      <React.Fragment>
        <Helmet title="Trabajadores" />
        <Typography variant="h3" gutterBottom display="inline">
          Gestionar Curso
        </Typography>
  
        <Breadcrumbs aria-label="Breadcrumb" mt={2}>
          <Typography>Gestionar Curso</Typography>
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
  function setOpenCreateEditModal(arg0: boolean) {
    throw new Error("Function not implemented.");
  }
  
  
  