import { spacing } from "@material-ui/system";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import styled from "styled-components/macro";

import {
  Box,
  Button,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  Link,
  ListItem,
  ListItemText,
  MenuItem,
  Breadcrumbs as MuiBreadcrumbs,
  Card as MuiCard,
  Divider as MuiDivider,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { getMoreStudents, getStudents, AddStudent, setSelectedStudent } from '../../redux/actions/studentActions';
import { Student } from '../../models/Student';
import { RootState } from "../../redux/reducers/rootReducer";
import { StudentState } from "../../redux/reducers/studentReducer";
import { TableSkeleton } from "../../components/TableSkeleton";
import { List, Trash } from "react-feather";
import { useStyles } from "../../theme/useStyles";
import { useTable } from "../../hooks/useTable";
import { TABLE_LIMIT_DEFAULT } from "../../constants";
import { usersReducer } from "../../redux/reducers/usersReducer";
import { FormState } from "../../models/form_state";
import { getGrades } from "../../redux/actions/gradeActions";
import { GradeState } from "../../redux/reducers/gradeReducer";
import { Grade } from "../../models/Grade";
import { StudentList } from "../Students/StudentList";


const Card = styled(MuiCard)(spacing);

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const StudentForm = () => {
  const dispatch = useDispatch(); 
  const classes = useStyles(); 
  const [currentFilter, setCurrentFilter] = useState<any>({});
  const {grades} = useSelector<RootState, GradeState>(
    (state) => state.gradeReducer
  );
  const { students } = useSelector<RootState, StudentState>(
    (state) => state.studentReducer
    );
    
    useEffect(() => {
      dispatch(getStudents());
    }, []);

  
    const addStudents = () => {

      const student = students.find((student) => student.id === selectedStudentId);
      if(student){
        setStudentList((prevStudentList) => [...prevStudentList, student]);
        console.log(`Estudiante encontrado: ${student.Nombres}`)
      }
     };

     const deteleStudent = (studentId : string) => {
      const updatedStudentList = studentList.filter((student) => student.id !== studentId);
      setStudentList(updatedStudentList);
     }
    
    const [studentList, setStudentList] = useState<Student[]>([]);
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);


 console.log(studentList);
  return (
    <>
      <CardHeader />
      <Card mb={6}>
        <CardContent>
            <Grid container spacing={4}>
              <Grid item xs={3}>
                <Box display="flex" style={{ flexDirection: "column" }}>
                  <Box>
                    <Typography variant="caption">Estudiante</Typography>
                  </Box>
                </Box>
                <Box>
                  <FormControl
                    style={{ minWidth: 177 }}
                    /*fullWidth={true}*/
                   
                  >
                    <Select
                      id="Student"
                      autoComplete="on"
                      name="Student"
                      value={selectedStudentId || ''}
                      onChange={(e) => {
                        setSelectedStudentId(e.target.value as string);
                      }}
                      inputProps={{
                        name: "Student",
                        id: "Student",
                      }}
                    >
                      {students.map((student) => (
                        <MenuItem
                          key={student.id}
                          value={student.id}
                        >{`${student.Nombres} ${student.Apellidos}`}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>

              <Grid item xs={4}>
                <Button
                  type="submit"
                  variant="contained"
                  style={{
                    backgroundColor: "#007ac9",
                    color: "#fff",
                    marginInlineEnd: 20,
                    marginLeft: 10,
                  }}
                  onClick={addStudents} disabled={!selectedStudentId}>
                  Agregar Estudiante
                </Button>
              </Grid>
            </Grid>

            <Typography variant="h6" style={{
                marginTop: "20px"
            }} >Lista de estudiantes:</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {studentList.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{`${student.Nombres} ${student.Apellidos}`}</TableCell>
                <TableCell>
                  <IconButton color="primary" aria-label="Eliminar" onClick={() => deteleStudent(student.id)}>
                    <Trash />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            
          </TableBody>
        </Table>
      </TableContainer>

        </CardContent>
      </Card>
    </>
  );
};


export const StudentAdminForm = () => {
  return (
    <React.Fragment>
      <Helmet title="Estudiantes" />
      <Typography variant="h3" gutterBottom display="inline">
        Agregar Estudiantes
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} exact to="/cursos">
          Lista de Cursos
        </Link>
        <Typography>Agregar estudiante</Typography>
      </Breadcrumbs>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <StudentForm />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
