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
import Asignaturas from "../../src/constants/Asignaturas.json";

interface Props {
  open: boolean;
  title: string;
  onClose: () => void;
  onAccept: (value: Partial<Subject>) => void;
  onEdit: (value: Partial<Subject>) => void;
  error?: boolean;
  helperText?: string;
  selected?: Subject;
  teachers: Employee[];
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

export const ModalSubjects: React.FC<Props> = ({
  open,
  title,
  onClose,
  onAccept,
  onEdit,
  error,
  helperText,
  selected,
  teachers,
}) => {
  const { handleSubmit, handleChange, values, errors, touched, setFieldValue } =
    useFormik({
      initialValues: {
        
        Asignatura: selected?.Asignatura || "",
        Horas: selected?.Horas || 0,
        ProfesorId: selected?.ProfesorId || "",
      },
      onSubmit: (values) => {
        selected
                ? onEdit({...values, id: selected.id})
                : onAccept(values);
                handleClose();
      },
      validationSchema: yup.object().shape({
        
        Asignatura: yup.string().required("Este campo es requerido"),
        Horas: yup.number().required("Este campo es requerido"),
        ProfesorId: yup.string().required("Este campo es requerido"),
      }),
    });

  const classes = useStyles();
  const [subject, setSubjects] = useState("");
  const [parallel, setparallel] = useState("");

  const handleClose = () => {
    onClose();
    setSubjects("");
    setparallel("");
  };

  useEffect(() => {
    if (selected) {
     
      setFieldValue("Asignatura", selected.Asignatura);
      setFieldValue("Horas", selected.Horas);
      setFieldValue("ProfesorId", selected.ProfesorId);
    }
  }, [selected]);

  const body = (
    <div className={classes.ventana}>
      <div style={{ alignItems: "Flex-start" }}>
        <h4>{title}</h4>
      </div>
      <form onSubmit={handleSubmit}>
        {/* <TextField
          type="text"
          autoFocus
          label="Sigla"
          id="Sigla"
          fullWidth={true}
          variant="outlined"
          value={values.Sigla}
          onChange={handleChange}
          error={touched.Sigla && Boolean(errors.Sigla)}
          helperText={touched.Sigla && errors.Sigla}
        /> */}
        {/* <TextField
          type="text"
          autoFocus
          label="Asignatura"
          id="Asignatura"
          fullWidth={true}
          style={{ marginTop: 10 }}
          variant="outlined"
          value={values.Asignatura}
          onChange={handleChange}
          error={touched.Asignatura && Boolean(errors.Asignatura)}
          helperText={touched.Asignatura && errors.Asignatura}
        /> */}

<Box  display="flex" style={{ flexDirection: "column" }}>
          <Box>
            <Typography variant="caption">Asignatura</Typography>
          </Box>
        </Box>
        <Box>
        <FormControl
            fullWidth={true}
            error={touched.Asignatura && Boolean(errors.Asignatura)}
          >
            <Select
              id="Asignaturas"
              autoComplete="on"
              autoFocus
              name="Asignaturas"
              fullWidth={true}
              variant="outlined"
              value={values.Asignatura}
              onChange={(e) => {
                handleChange(e);
              }}
              inputProps={{
                name: "Asignatura"
               
              }}
            >
              {Asignaturas.Asignaturas.map((asignatura) => (
                <MenuItem
                  key={asignatura}
                  value={asignatura}
                >{`${asignatura}`}</MenuItem>
              ))}
            </Select>
            <FormHelperText>
              {touched.Asignatura && errors.Asignatura}
            </FormHelperText>
          </FormControl>
         </Box>

        <TextField
          type="number"
          autoFocus
          label="Horas"
          id="Horas"
          fullWidth
          style={{ marginTop: 10 }}
          variant="outlined"
          value={values.Horas}
          onChange={handleChange}
          error={touched.Horas && Boolean(errors.Horas)}
          helperText={touched.Horas && errors.Horas}
        />
        <Box display="flex" justifyContent="flex-start" marginTop={2}>
          <Box>
            <Typography variant="caption">Profesor</Typography>
          </Box>
        </Box>
        <Box>
          <FormControl
            fullWidth={true}
            error={touched.ProfesorId && Boolean(errors.ProfesorId)}
          >
            <Select
              id="ProfesorId"
              autoComplete="on"
              name="ProfesorId"
              variant="outlined"
              value={values.ProfesorId}
              onChange={(e) => {
                handleChange(e);
              }}
              inputProps={{
                name: "ProfesorId",
                id: "ProfesorId",
              }}
            >
              {teachers.map((teacher) => (
                <MenuItem
                  key={teacher.id}
                  value={teacher.id}
                >{`${teacher.Nombre} ${teacher.ApPaterno} ${teacher.ApMaterno}`}</MenuItem>
              ))}
            </Select>
            <FormHelperText>
              {touched.ProfesorId && errors.ProfesorId}
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
          <Button variant="contained" onClick={handleClose}>
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
