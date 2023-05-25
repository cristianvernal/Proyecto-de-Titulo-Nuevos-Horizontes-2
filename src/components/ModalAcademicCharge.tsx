import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState, useEffect } from "react";
import { Grade } from "../models/Grade";
import { useFormik } from "formik";
import { Subject } from "../models/Subject";
import * as yup from "yup";
import { Employee } from "../models/Employee";
import { useDispatch, useSelector } from "react-redux";
import { getSubjtectByTeacherId } from "../redux/actions/subjectActions";
import { RootState } from "../redux/reducers/rootReducer";
import { SubjectState } from "../redux/reducers/subjectReducer";
import { getEmployees } from "../redux/actions/employeeActions";
import { EmployeeState } from "../redux/reducers/employeeReducer";

interface Props {
  open: boolean;
  onClose: () => void;
  // selected?: Employee;
  subjects: Subject[];
}
const useStyles = makeStyles((theme) => ({
  ventana: {
    borderRadius: "6%",
    position: "absolute",
    width: "400",
    backgroundColor: "white",
    border: "2 px solid #f8f4f4",
    boxShadow: theme.shadows[3],
    padding: "16px 32px 24px",
    top: "35%",
    left: "35%",
    transform: "translate(-35% - 35%) ",
  },
  textField: {
    width: "100%",
  },
}));

export const ModalAcademicCharge: React.FC<Props> = ({
  open,
  onClose,
  subjects,
}) => {
  const dispatch = useDispatch();
  const classes = useStyles();

  // const [subject, setSubjects] = useState("");
  const [parallel, setparallel] = useState("");
  const [employee, setEmployee] = useState("");

  const handleClose = () => {
    onClose();
    // setSubjects("");
    setparallel("");
  };

  // useEffect(() => {
  //   dispatch(getSubjtectByTeacherId(selected?.id as any));
  //   dispatch(getEmployees());
  // }, []);

  // const { employees } = useSelector<RootState, EmployeeState>(
  //   (state: any) => state.employeeReducer
  // );

  const body = (
    <div className={classes.ventana}>
      <div style={{ alignItems: "Flex-start" }}>
        <h2>Carga Academica</h2>
      </div>
      <TableRow>
        <TableCell align="center">Asignatura</TableCell>
        <TableCell align="center">Horas</TableCell>
      </TableRow>
      <Box
        display="flex-"
        justifyContent="center"
        flexDirection="row"
        paddingTop="5%"
      >
        {subjects.map((subject) => (
          <Typography variant="h6" key={subject.id}>
            <TableRow hover>
              <TableCell align="left"> {`${subject.Asignatura}`} </TableCell>
              <TableCell align="center"> {`${subject.Horas} horas`} </TableCell>
            </TableRow>
          </Typography>
        ))}
      </Box>
      <Box display="flex" justifyContent="end" marginTop="10%">
        <Button
          type="submit"
          variant="contained"
          style={{
            backgroundColor: "#007ac9",
            color: "#fff",
            marginLeft: 6,
          }}
          onClick={handleClose}
        >
          Cerrar
        </Button>
      </Box>
    </div>
  );

  return (
    <div>
      <Modal open={open} onClose={onClose}>
        {body}
      </Modal>
    </div>
  );
};
