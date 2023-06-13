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
  Input,
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
import { useFormik } from "formik";
import { Observation } from "../../models/Observations";
import { AddObservation, setAddObservationInital } from "../../redux/actions/observationsActions";
import * as yup from "yup";
import { boolean } from "yup-locales/dist/locales/fr";
import { type } from "os";
import { ObservationState } from "../../redux/reducers/observationsReducer";

const Card = styled(MuiCard)(spacing);

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);


const ContentCard = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const { add } = useSelector<RootState, ObservationState>(
    (state) => state.observationReducer
  );
  
  
  
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    dispatch(setAddObservationInital());
    setOpen(false);
    history.push("/libroDeClases");
  };

  // useEffect(() => {
  //   if (add?.state === FormState.Success) {
  //     handleOpen();
  //   }
  // }, [add?.state]);

  const { handleSubmit, values, handleChange, touched, errors } = useFormik<
    Partial<Observation>
  >({
    initialValues: {
      Enfermedades: "",
      Discapacidad: "",
      Otros: "",
      StudentId: "",
    },
    onSubmit: (values) => {
      dispatch(AddObservation(values));
    },
    validationSchema: yup.object({
      Enfermedades: yup.string().required("Este campo es obligatorio"),
      Discapacidad: yup.string().required("Este campo es obligatorio"),
      Otros: yup.string().required("Este campo es obligatorio"),
    }),
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

  const [estudiantes, setEstudiantes] = useState<Student[]>(
    students.map((student: any) => ({
      ...student,
      observaciones: null,
    }))
  );

  const handleObservacionChange = (
    studentId: string,
    field: string,
    value: string
  ) => {
    setEstudiantes((prevStudents) => {
      return prevStudents.map((student) => {
        if (student.id === studentId) {
          if (!student.observaciones) {
            return {
              ...student,
              observaciones: {
                enfermedades: "",
                discapacidad: "",
                otros: "",
                [field]: value,
              },
            };
          }

          return {
            ...student,
            observaciones: {
              ...student.observaciones,
              [field]: value,
            },
          };
        }
        return student;
      });
    });
  };

  // useEffect(() => {
  //   if (deleteState === FormState.Success) {
  //     handleOpenConfirm();
  //   }
  // }, [deleteState]);
  /* console.log(employees); */
  return (
    <>
      <CardHeader />
      <Card mb={6}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <TableContainer className={classes.tableContainer}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Estudiante</TableCell>
                    <TableCell align="center">Enfermedades</TableCell>
                    <TableCell align="center">Discapacidad</TableCell>
                    <TableCell align="center">Otros</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(state === FormState.Submitting ||
                    state === FormState.Initial) && (
                    <TableSkeleton colSpan={10} limit={10} />
                  )}
                  {students.map((student) => (
                    <Fade key={student.id} in={true}>
                      <TableRow hover className={classes.styledRow}>
                        <TableCell align="left" style={{ width: 250 }}>
                          {`${student?.Nombres}  ${student?.Apellidos}`}
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            type="text"
                            id="Enfermedades"
                            autoFocus
                            size="medium"
                            style={{
                              width: 200,
                            }}
                            variant="outlined"
                             value={student.observaciones}
                            onChange={(e) =>
                              handleObservacionChange(
                                student.id,
                                "enfermedades",
                                e.target.value
                              )
                            }
                          />
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            type="text"
                            id="Discapacidad"
                            autoFocus
                            size="medium"
                            style={{
                              width: 200,
                            }}
                            variant="outlined"
                            value={student.observaciones}
                            onChange={(e) =>
                              handleObservacionChange(
                                student.id,
                                "discapacidad",
                                e.target.value
                              )
                            }
                          />
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            type="text"
                            autoFocus
                            id="Otros"
                            size="medium"
                            style={{
                              width: 200,
                            }}
                            variant="outlined"
                            value={student.observaciones}
                            onChange={(e) =>
                              handleObservacionChange(
                                student.id,
                                "otros",
                                e.target.value
                              )
                            }
                          />
                        </TableCell>
                      </TableRow>
                    </Fade>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </form>
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
              onClick={handleClickOpen}
              // onClick={() => {
              //   history.push("/trabajadores/Crear");
              // }}
            >
              Guardar Notas
            </Button>
          </>
        }
      />
      <Dialog open={open} onClose={handleClose}aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        {" "}
        {/* son cuadros de dialogos */}
        <DialogTitle id="alert-dialog-title">
          {"Observaciones Guardadas"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <h6>Las observaciones han sido guardadas</h6>
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

export const ObservationsList = () => {
  return (
    <React.Fragment>
      <Helmet title="Trabajadores" />
      <Typography variant="h3" gutterBottom display="inline">
        Observaciones
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} exact to="/LibroDeClases">
          Libro de Clases
        </Link>
        <Typography>Observaciones</Typography>
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

