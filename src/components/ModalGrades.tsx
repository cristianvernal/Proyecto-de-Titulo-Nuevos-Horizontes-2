import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState, useEffect } from "react";
import { Grade } from "../models/Grade";
import { Employee } from '../models/Employee';
interface Props {
  open: boolean;
  title: string;
  onClose: () => void;
  onAccept: (value: Partial<Grade>) => void;
  onEdit: (value: Partial<Grade>) => void;
  value: any;
  error?: boolean;
  helperText?: string;
  selected?: Grade;
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

export const ModalGrades: React.FC<Props> = ({
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
  const classes = useStyles();
  const [grade, setGrade] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [parallel, setparallel] = useState("");

  const handleClose = () => {
    onClose();
    setGrade("");
    setTeacherId("");
    setparallel("");
  };

  useEffect(() => {
    if (selected) {
      setGrade(selected.Grado);
      setTeacherId(selected.TeacherId);
      setparallel(selected.Paralelo);
    }
  }, [selected]);

  const body = (
    <div className={classes.ventana}>
      <div style={{ alignItems: "Flex-start" }}>
        <h4>{title}</h4>
      </div>
      <TextField
        type="text"
        autoFocus
        label="Grado"
        id="grade"
        fullWidth={true}
        variant="outlined"
        value={grade}
        onChange={(e) => {
          setGrade(e.target.value);
        }}
        error={error}
        helperText={helperText}
      />
      <TextField
        type="text"
        autoFocus
        label="Paralelo"
        id="parallel"
        fullWidth={true}
        style={{ marginTop: 10 }}
        variant="outlined"
        value={parallel}
        onChange={(e) => {
          setparallel(e.target.value);
        }}
        error={error}
        helperText={helperText}
      />
      <Box display="flex" justifyContent="flex-start" marginTop={2}>
        <Box>
          <Typography variant="caption">Profesor</Typography>
        </Box>
      </Box>
      <Box>
        <Select
          fullWidth={true}
          id="teacherId"
          autoComplete="on"
          name="teacherId"
          variant="outlined"
          value={teacherId}
          onChange={(e) => {
            setTeacherId(e.target.value as any);
          }}
          inputProps={{
            name: "teacherId",
            id: "teacherId",
          }}
        >
          {teachers.map((teacher) => (
            <MenuItem
              key={teacher.id}
              value={teacher.id}
            >{`${teacher.Nombre} ${teacher.ApPaterno} ${teacher.ApMaterno}`}</MenuItem>
          ))}
        </Select>
      </Box>

      <Box display="flex" justifyContent="flex-end" paddingTop="10%">
        {grade === "" || parallel === "" ? (
          error
        ) : (
          <Button
            style={{ marginRight: 20 }}
            variant="contained"
            onClick={() => {
              selected
                ? onEdit({ id: selected.id, Grado: grade, Paralelo: parallel, TeacherId: teacherId })
                : onAccept({ Grado: grade, Paralelo: parallel, TeacherId: teacherId });
              handleClose();
            }}
            color="primary"
          >
            Guardar
          </Button>
        )}
        <Button variant="contained" onClick={handleClose}>
          Cancelar
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
