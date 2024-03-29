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
import {
  Edit,
  EmojiObjects,
  ExpandLess,
  ExpandMore,
  ListAlt,
  PersonAdd,
  PersonAddDisabledTwoTone,
  PersonAddTwoTone,
  Star,
} from "@material-ui/icons";
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
import { Employee } from "../../models/Employee";
import { ModalAcademicCharge } from "../../components/ModalAcademicCharge";
import {
  getMoreSubjects,
  getSubjtectByTeacherId,
  setSelectedSubject,
} from "../../redux/actions/subjectActions";
import { SubjectState } from "../../redux/reducers/subjectReducer";
import { getColleges } from "../../redux/actions/collegeActions";
import { CollegeState } from "../../redux/reducers/collegeReducer";
import { Curriculum } from "../../models/Curriculum";
import { GetTeachers } from "../../redux/actions/employeeActions";
import { ClassBook } from "../../models/ClassBook";
import {
  getMoreClassBooks,
  getClassBooks,
} from "../../redux/actions/classBookAction";
import { ClassBookState } from "../../redux/reducers/classBookReducer";
import { Subject } from "../../models/Subject";
import { getSubjects } from "../../redux/actions/subjectActions";
import { Grade } from "../../models/Grade";
import { getGrades, getMoreGrades } from "../../redux/actions/gradeActions";
import { GradeState } from "../../redux/reducers/gradeReducer";
import { setSelectedStudent } from "../../redux/actions/studentActions";

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

  // const handleOpenChargeModal = (data: any) => {
  //   dispatch(getSubjtectByTeacherId(selected?.id as any));
  //   history.push(`/cargaAcademica/`);
  // };

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

  const handleGoToAttendace = (data: any) => {
    dispatch(setSelectedStudent(data));
    history.push(`/asistencia/${data.id}`);
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

  useEffect(() => {
    dispatch(getGrades());
  }, []);

  const {
    grades,
    state,
    totalDocs,
    delete: { state: deleteState },
  } = useSelector<RootState, GradeState>((state) => state.gradeReducer);

  // const { subjects } = useSelector<RootState, SubjectState>(
  //   (state: any) => state.subjectReducer
  // );

  useEffect(() => {
    if (deleteState === FormState.Success) {
      handleOpenConfirm();
    }
  }, [deleteState]);
  // console.log(classBooks);

  return (
    <>
      <CardHeader />
      <Card mb={6}>
       
        <CardContent>
          <TableContainer className={classes.tableContainer}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell align="left">Curso</TableCell>
                  <TableCell align="center">Numero Sala</TableCell>
                  <TableCell align="center">Profesor Jefe</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                
                  {/* <TableCell align="center">Asistencias</TableCell>
                  <TableCell align="center">Anotaciones</TableCell> */}
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
                          <TableCell align="center">{`${data?.TeacherData?.Nombre} ${data?.TeacherData?.ApPaterno} ${data?.TeacherData?.ApMaterno}`}</TableCell>
                          <TableCell align="center">
                            <Box style={{ justifyContent: "flex-start" }}>
                            <Tooltip title="Asistencia">
                                <IconButton
                                  color="primary"
                                  size="small"
                                  // onClick={() =>{
                                  //   handleGoToAttendace(data);
                                  // }}
                                  onClick={() => {
                                    history.push("/asistencia");
                                    /* aqui */
                                  }}
                                >
                                  <PersonAddTwoTone />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Notas">
                                <IconButton
                                  color="primary"
                                  size="small"
                                  onClick={() => {
                                    history.push("/notas");
                                    /* aqui */
                                  }}
                                >
                                  <Star />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Observaciones">
                                <IconButton
                                  color="primary"
                                  size="small"
                                  onClick={() => {
                                    history.push("/observaciones");
                                    /* aqui */
                                  }}
                                >
                                  <EmojiObjects />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                          {/* <TableCell align="center">
                            <Box style={{ justifyContent: "flex-start" }}>
                              <Tooltip title="Asistencias">
                              <Button
                                  startIcon={<AddIcon />}
                                  style={{
                                    backgroundColor: "#007ac9",
                                    color: "#fff",
                                    marginInlineEnd: 20,
                                    marginLeft: 10,
                                  }}
                                  onClick={() => {
                                    // history.push("/trabajadores/Crear");
                                  }}
                                ></Button>
                              </Tooltip>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Box style={{ justifyContent: "flex-start" }}>
                              <Tooltip title="Anotaciones">
                              <Button
                                  startIcon={<AddIcon />}
                                  style={{
                                    backgroundColor: "#007ac9",
                                    color: "#fff",
                                    marginInlineEnd: 20,
                                    marginLeft: 10,
                                  }}
                                  onClick={() => {
                                    // history.push("/trabajadores/Crear");
                                  }}
                                ></Button>
                              </Tooltip>
                            </Box>
                          </TableCell> */}
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
      {/* <ModalAcademicCharge
        open={openChargeModal}
        onClose={handleCloseChargeModal}
        selected={selected}
      /> */}
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

export const ClassBookList = () => {
  return (
    <React.Fragment>
      <Helmet title="Libro de Clases" />
      <Typography variant="h3" gutterBottom display="inline">
        Libro de Clases
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Typography>Libro de Clases</Typography>
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
