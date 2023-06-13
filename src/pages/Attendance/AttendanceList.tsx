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
  RadioGroup,
  FormControlLabel,
  Radio,
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
import firebase from "firebase/app";
import "firebase/firestore";

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
  const [open, setOpen] = React.useState(false);
  const [selectedAsistencia, setSelectedAsistencia] = useState("");
  const [resultados, setResultados] = useState<any[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);


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

  interface AttendanceRecord {
    studentId: string;
    attendance: "Presente" | "Ausente";
    justification?: string;
  }

  const handleAttendanceChange = (
    studentId: string,
    attendance: "Presente" | "Ausente"
  ) => {
    const existingRecordIndex = attendanceRecords.findIndex(
      (record) => record.studentId === studentId
    );

    if (existingRecordIndex !== -1) {
      const updatedRecords = [...attendanceRecords];
      updatedRecords[existingRecordIndex].attendance = attendance;
      setAttendanceRecords(updatedRecords);
    } else {
      setAttendanceRecords((prevRecords) => [
        ...prevRecords,
        { studentId, attendance },
      ]);
    }
  };

  const handleJustificationChange = (
    studentId: string,
    justification: string
  ) => {
    const existingRecordIndex = attendanceRecords.findIndex(
      (record) => record.studentId === studentId
    );

    if (existingRecordIndex !== -1) {
      const updatedRecords = [...attendanceRecords];
      updatedRecords[existingRecordIndex].justification = justification;
      setAttendanceRecords(updatedRecords);
    } else {
      setAttendanceRecords((prevRecords) => [
        ...prevRecords,
        { studentId, attendance: "Ausente", justification },
      ]);
    }
  };

  const renderAttendanceForm = (student: Student) => {
    const record = attendanceRecords.find(
      (record) => record.studentId === student.id
    );
  };
  // useEffect(() => {
  //   if (deleteState === FormState.Success) {
  //     handleOpenConfirm();
  //   }
  // }, [deleteState]);

  return (
    <>
      <Card mb={6}>
        {/* <FilterSection
          changeOrder={(order) => {
            setSortBy(order);
            handleChangeOrder(order);
          }}
        /> */}
        <CardContent>
          <TableContainer className={classes.tableContainer}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell align="left">Estudiante</TableCell>
                  <TableCell align="left">Asistencia</TableCell>
                  <TableCell align="center">Justificacion</TableCell>
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
                          <TableCell align="left">{`${data?.Nombres}  ${data?.Apellidos}`}</TableCell>
                          <TableCell align="center">
                          <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            >
                            <FormControlLabel
                              value="Presente"
                              control={<Radio />}
                              label="Presente"
                              />
                            <FormControlLabel
                              value="Ausente"
                              control={<Radio />}
                              label="Ausente"
                              />
                          </RadioGroup>
                              </TableCell>
                          <TableCell align="center">
                            <TextField
                              type="text"
                              autoFocus
                              id="Justificacion"
                              size="small"
                              style={{
                                width: 200,
                              }}
                              variant="outlined"
                              // value={values.Horas}
                              // onChange={handleChange}
                              // error={touched.Horas && Boolean(errors.Horas)}
                              // helperText={touched.Horas && errors.Horas}
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
              onClick={handleClickOpen}
            >
              Guardar Asistencia
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
          {"Asistencia guardada"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <h6>La asistencia ha sido guardada exitosamente</h6>
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

export const AttendanceList = () => {
  return (
    <React.Fragment>
      <Helmet title="Trabajadores" />
      <Typography variant="h3" gutterBottom display="inline">
        Asistencia
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} exact to="/LibroDeClases">
          Libro de Clases
        </Link>
        <Typography>Asistencia</Typography>
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
