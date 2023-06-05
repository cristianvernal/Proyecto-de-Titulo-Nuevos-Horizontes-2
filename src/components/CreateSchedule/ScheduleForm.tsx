import React, { useState } from "react";
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import { Grade } from "../../models/Grade";
import { Subject } from "../../models/Subject";
import { set } from "date-fns";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const daysOfWeek = ["lunes", "martes", "miércoles", "jueves", "viernes"];

interface ScheduleFormProps {
  handleSubmit: (schedule: any) => void;
  grades: Grade[];
  subjects: Subject[];
  handleSelectGrade: (grade: Grade) => void;
  selectedGrade?: string;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({
  handleSubmit,
  grades,
  subjects,
  handleSelectGrade,
  selectedGrade,
}) => {
  const classes = useStyles();
  const [asignatura, setAsignatura] = useState("");
  const [dia, setDia] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [grade, setGrade] = useState<Grade | null>(null);

  const handleSubmitForm = (event: any) => {
    event.preventDefault();
    handleSubmit({ asignatura, dia, horaInicio, horaFin });
    setAsignatura("");
    setDia("");
    setHoraInicio("");
    setHoraFin("");
  };

  const selectGrade = (grade: any) => {
    setGrade(grade);
    handleSelectGrade(grade);
  };



  return (
    <form onSubmit={handleSubmitForm}>
      <Grid container spacing={10} alignItems="center" justify="space-between">
        <Grid item xs={2}>
          <FormControl className={classes.formControl}>
            <InputLabel id="subject-select-label">Curso</InputLabel>
            <Select
              labelId="subject-select-label"
              id="subject-select"
              value={selectedGrade ? selectGrade : grade}
              onChange={(event) => selectGrade(event.target.value as any)}
              required
            >
              {grades.map((grade) => (
                <MenuItem key={grade.id} value={grade.id}>
                  {`${grade.Grado}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={3}>
          <FormControl className={classes.formControl}>
            <InputLabel id="subject-select-label">Asignatura</InputLabel>
            <Select
              labelId="subject-select-label"
              id="subject-select"
              fullWidth
              value={asignatura}
              onChange={(event) => setAsignatura(event.target.value as any)}
              required
            >
              {subjects.map((subject) => (
                <MenuItem key={subject.id} value={subject.Asignatura}>
                  {subject.Asignatura}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={1}>
          <FormControl className={classes.formControl}>
            <InputLabel id="dayOfWeek-select-label">
              Día de la semana
            </InputLabel>
            <Select
              labelId="dayOfWeek-select-label"
              id="dayOfWeek-select"
              value={dia}
              onChange={(event) => setDia(event.target.value as any)}
              required
            >
              {daysOfWeek.map((day) => (
                <MenuItem
                  key={day}
                  value={day.normalize("NFD").replace(/[\u0300-\u036f]/g, "")}
                >
                  {day}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={1} style={{ marginRight: 5 }}>
          <FormControl className={classes.formControl}>
            <TextField
              id="startTime"
              label="Hora de inicio"
              type="time"
             
              variant="filled"
              value={horaInicio}
              onChange={(event) => setHoraInicio(event.target.value)}
              required
            />
          </FormControl>
        </Grid>
        <Grid item xs={1}>
          <FormControl className={classes.formControl}>
            <TextField
              id="endTime"
              label="Hora de fin"
              type="time"
              variant="filled"
              value={horaFin}
              onChange={(event) => setHoraFin(event.target.value)}
              required
            />
          </FormControl>
        </Grid>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            style={{ marginRight: 15 }}
          >
            Agregar Asignatura
          </Button>
        
      </Grid>
    </form>
  );
};

export default ScheduleForm;
