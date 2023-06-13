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
  Link,
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
  FormControl,
  Select,
  FormHelperText,
  MenuItem,
  DialogContentText,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { green, red } from "@material-ui/core/colors";
import {
  Edit,
  ExpandLess,
  ExpandMore,
  ListAlt,
  Subject,
} from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import { spacing } from "@material-ui/system";
import React, { useEffect, useState } from "react";
import { MinusSquare, Search, Trash } from "react-feather";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
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
import { getSubjtectByTeacherId } from "../../redux/actions/subjectActions";
import { SubjectState } from "../../redux/reducers/subjectReducer";
import { getColleges } from "../../redux/actions/collegeActions";
import { CollegeState } from "../../redux/reducers/collegeReducer";
import { Curriculum } from "../../models/Curriculum";
import { CurriculumList } from "../Curriculum/CurriculumList";
import {
  getMoreStudents,
  getStudents,
} from "../../redux/actions/studentActions";
import {
  StudentState,
  studentReducer,
} from "../../redux/reducers/studentReducer";
import { Student } from "../../models/Student";
import { Attendance } from "../../models/Attendance";
import { margin } from "polished";
import { getGrades, getMoreGrades } from "../../redux/actions/gradeActions";
import { GradeState } from "../../redux/reducers/gradeReducer";
import { Grade } from "../../models/Grade";
import { useParams } from "react-router-dom";
import { Asignaturas } from "/Users/Crist/OneDrive/Escritorio/Proyecto de Titulo Nuevos Horizontes/src/constants/Asignaturas.json";
import { AsignGrade } from "../../models/AsignGrade";
import { AsignGradeState, asignGradeReducer } from "../../redux/reducers/asignGradeReducer";

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
  const [currentFilter, setCurrentFilter] = useState<any>({});
  const [openChargeModal, setOpenChargeModal] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [notas, setNotas] = useState<{ [studentId: string]: string[] }>({});
  const [promedios, setPromedios] = useState<{ [studentId: string]: number }>(
    {}
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    history.push("/libroDeClases");
  };

  //Funcion para ir a editar

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

  // useEffect(() => {
  //   if (deleteState === FormState.Success) {
  //     handleOpenConfirm();
  //   }
  // }, [deleteState]);

  const handleNotaChange = (
    studentId: string,
    notaIndex: number,
    value: string
  ) => {
    const nuevasNotas = { ...notas };
    nuevasNotas[studentId] = [
      ...(nuevasNotas[studentId] || []),
      "",
      "",
      "",
      "",
    ]; // Inicializar con 4 notas vacías
    nuevasNotas[studentId][notaIndex] = value;
    setNotas(nuevasNotas);

    const notasNumeros = nuevasNotas[studentId].map((nota) => parseFloat(nota));
    const notasValidas = notasNumeros.filter((nota) => !isNaN(nota)); // Filtrar notas válidas (numéricas)
    const sumaNotas = notasValidas.reduce((total, nota) => total + nota, 0);
    const nuevoPromedio = sumaNotas / notasValidas.length;

    const nuevosPromedios = { ...promedios };
    nuevosPromedios[studentId] = nuevoPromedio;
    setPromedios(nuevosPromedios);
  };

  return (
    <>
      <Card mb={6}>
        <CardContent>
          <TableContainer className={classes.tableContainer}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell align="left">Estudiante</TableCell>
                  <TableCell align="center">Asignatura</TableCell>
                  <TableCell align="center">Nota 1</TableCell>
                  <TableCell align="center">Nota 2</TableCell>
                  <TableCell align="center">Nota 3</TableCell>
                  <TableCell align="center">Nota 4</TableCell>
                  <TableCell align="center">Promedio</TableCell>
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
                          <TableCell
                            align="left"
                            style={{ width: 250 }}
                          >{`${data.Nombres}  ${data.Apellidos}`}
                          </TableCell>
                          <TableCell align="right">
                            <FormControl fullWidth={true} size="small">
                              <Select
                                id="Asignaturas"
                                autoComplete="on"
                                autoFocus
                                name="Asignaturas"
                                style={{ width: 170 }}
                                variant="outlined"
                                onChange={(e) => {
                                  handleChangeOrder(e);
                                }}
                                inputProps={{
                                  name: "Asignaturas",
                                }}
                              >
                                {Asignaturas.map((asignatura) => (
                                  <MenuItem
                                    key={asignatura}
                                    value={asignatura}
                                  >{`${asignatura}`}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </TableCell>
                          {Array.from({ length: 4 }).map((_, index) => (
                            <TableCell align="center" key={index}>
                              <TextField
                                type="text"
                                autoFocus
                                id={`Nota-${index + 1}-${data.id}`}
                                size="small"
                                style={{
                                  width: 80,
                                }}
                                variant="outlined"
                                value={notas[data.id]?.[index] || ""}
                                onChange={(e) =>
                                  handleNotaChange(
                                    data.id,
                                    index,
                                    e.target.value
                                  )
                                }
                              />
                            </TableCell>
                          ))}
                          <TableCell align="center">
                            <TextField
                              type="text"
                              autoFocus
                              id={`Promedio-${data.id}`}
                              size="small"
                              style={{
                                width: 80,
                              }}
                              variant="outlined"
                              value={promedios[data.id] || ""}
                            />
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
      <CardHeader
        action={
          <>
            <Button
              style={{
                backgroundColor: "#007ac9",
                color: "#fff",
                marginInlineEnd: 20,
                marginLeft: 10,
              }}
              // onClick={() => {
              //   history.push("/trabajadores/Crear");
              // }}
              onClick={handleClickOpen}
            >
              Guardar Notas
            </Button>
          </>
        }
      />
       <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {" "}
        {/* son cuadros de dialogos */}
        <DialogTitle id="alert-dialog-title">
          {"Notas Guardadas"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <h6>Las notas han sido guardadas exitosamente</h6>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          
          <Button onClick={handleClose} autoFocus>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export const AsignGradeList = () => {
  return (
    <React.Fragment>
      <Helmet title="Trabajadores" />
      <Typography variant="h3" gutterBottom display="inline">
        Notas
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} exact to="/LibroDeClases">
          Libro de Clases
        </Link>
        <Typography>Notas</Typography>
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
