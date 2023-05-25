import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
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
import { Classroom } from "../models/Classroom";
import { College } from "../models/College";

interface Props {
  open: boolean;
  title: string;
  onClose: () => void;
  onAccept: (value: Partial<Classroom>) => void;
  onEdit: (value: Partial<Classroom>, id: string) => void;
  error?: boolean;
  helperText?: string;
  selected?: Classroom;
  grades: Grade[];
  colleges: College[];
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

export const ModalClassroom: React.FC<Props> = ({
  open,
  title,
  onClose,
  onAccept,
  onEdit,
  error,
  helperText,
  selected,
  grades,
  colleges,
}) => {
  const { handleSubmit, handleChange, values, errors, touched, setFieldValue } =
    useFormik({
      initialValues: {
        NumeroSala: selected?.NumeroSala || "",
        Ubicacion: selected?.Ubicacion || "",
        GradeId: selected?.GradeId || "",
        CollegeId: selected?.CollegeId || "",
      },
      onSubmit: (values) => {
        selected ? onEdit(values, selected.id) : onAccept(values);
        onClose();
      },
      validationSchema: yup.object().shape({
        NumeroSala: yup.string().required("Este campo es requerido"),
        Ubicacion: yup.string().required("Este campo es requerido"),
        GradeId: yup.string().required("Este campo es requerido"),
        CollegeId: yup.string().required("Este campo es requerido"),
      }),
    });

  const classes = useStyles();
  const [subject, setSubjects] = useState("");
  const [parallel, setparallel] = useState("");


  useEffect(() => {
    if (selected) {
      setFieldValue("Numero", selected.NumeroSala);
      setFieldValue("Ubicacion", selected.Ubicacion);
      setFieldValue("GradeId", selected.GradeId);
      setFieldValue("CollegeId", selected.CollegeId);
    }
  }, [selected]);

  const body = (
    <div className={classes.ventana}>
      <div style={{ alignItems: "Flex-start" }}>
        <h4>{title}</h4>
      </div>
      <form onSubmit={handleSubmit}>
        <TextField
          type="text"
          autoFocus
          label="Numero de Sala"
          id="NumeroSala"
          fullWidth={true}
          variant="outlined"
          value={values.NumeroSala}
          onChange={handleChange}
          error={touched.NumeroSala && Boolean(errors.NumeroSala)}
          helperText={touched.NumeroSala && errors.NumeroSala}
        />
        <TextField
          type="text"
          autoFocus
          label="Ubicacion de sala"
          id="Ubicacion"
          fullWidth={true}
          style={{ marginTop: 10 }}
          variant="outlined"
          value={values.Ubicacion}
          onChange={handleChange}
          error={touched.Ubicacion && Boolean(errors.Ubicacion)}
          helperText={touched.Ubicacion && errors.Ubicacion}
        />
        <Box display="flex" justifyContent="flex-start" marginTop={2}>
          <Box>
            <Typography variant="caption">Curso</Typography>
          </Box>
        </Box>
        <Box>
          <FormControl
            fullWidth={true}
            error={touched.GradeId && Boolean(errors.GradeId)}
          >
            <Select
              id="GradeId"
              autoComplete="on"
              name="GradeId"
              variant="outlined"
              value={values.GradeId}
              onChange={(e) => {
                handleChange(e);
              }}
              inputProps={{
                name: "GradeId",
                id: "GradeId",
              }}
            >
              {grades.map((grade) => (
                <MenuItem
                  key={grade.id}
                  value={grade.id}
                >{`${grade.Grado} - ${grade.Paralelo}`}</MenuItem>
              ))}
            </Select>
            <FormHelperText>{touched.GradeId && errors.GradeId}</FormHelperText>
          </FormControl>
        </Box>
        <Box display="flex" justifyContent="flex-start" marginTop={2}>
          <Box>
            <Typography variant="caption">Colegio</Typography>
          </Box>
        </Box>
        <Box>
          <FormControl
            fullWidth={true}
            error={touched.CollegeId && Boolean(errors.CollegeId)}
          >
            <Select
              id="CollegeId"
              autoComplete="on"
              name="CollegeId"
              variant="outlined"
              value={values.CollegeId}
              onChange={(e) => {
                handleChange(e);
              }}
              inputProps={{
                name: "CollegeId",
                id: "CollegeId",
              }}
            >
              {colleges.map((college) => (
                <MenuItem
                  key={college.id}
                  value={college.id}
                >{`${college.Nombre}`}</MenuItem>
              ))}
            </Select>
            <FormHelperText>
              {touched.CollegeId && errors.CollegeId}
            </FormHelperText>
          </FormControl>
        </Box>
        <Box display="flex" justifyContent="flex-end" paddingTop="10%">
          <Button
            style={{ marginRight: 20 }}
            variant="contained"
            type="submit"
            color="primary"
          >
            Guardar
          </Button>
          <Button variant="contained" onClick={onClose}>
            Cancelar
          </Button>
        </Box>
      </form>
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
