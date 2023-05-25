import React, { useEffect, useState } from "react";
import ScheduleForm from "./ScheduleForm";
import ScheduleTable from "./ScheduleTable";
import { useDispatch, useSelector } from "react-redux";
import { getAllGrades, getGrades } from "../../redux/actions/gradeActions";
import { RootState } from "../../redux/reducers/rootReducer";
import { GradeState } from "../../redux/reducers/gradeReducer";
import { getSubjects } from "../../redux/actions/subjectActions";
import { SubjectState } from "../../redux/reducers/subjectReducer";
import { addSchedule } from "../../redux/actions/schedule.Action";
import { Box, Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";


const SchedulePicker = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [schedule, setSchedule] = useState<any>({
    lunes: [],
    martes: [],
    miercoles: [],
    jueves: [],
    viernes: [],
  });
  const [selectedGrade, setSelectedGrade] = useState<any>(null);

  const handleAddClass = (newClass: any) => {
    setSchedule((prevSchedule: any) => {
      const { asignatura, dia, horaInicio, horaFin } = newClass;
      const newSchedule = { ...prevSchedule };
      if (!Array.isArray(newSchedule[dia])) {
        newSchedule[dia] = [];
      }
      newSchedule[dia] = [
        ...newSchedule[dia],
        { asignatura, horaInicio, horaFin },
      ];
      return newSchedule;
    });
  };

  const handleRemoveClass = (weekday: string, classToRemove: any) => {
    setSchedule((prevSchedule: any) => {
      const { asignatura, horaInicio, horaFin } = classToRemove;
      const newSchedule = { ...prevSchedule };
      if (!Array.isArray(newSchedule[weekday])) {
        return newSchedule;
      }
      newSchedule[weekday] = newSchedule[weekday].filter((classItem: any) => {
        return !(
          classItem.asignatura === asignatura &&
          classItem.horaInicio === horaInicio &&
          classItem.horaFin === horaFin
        );
      });
      return newSchedule;
    });
  };

  const handleCreateSchedule = () => {
    dispatch(addSchedule(schedule, selectedGrade));
    history.push("/cursosHorario")
  };

  useEffect(() => {
    dispatch(getAllGrades());
    dispatch(getSubjects());
  }, []);

  const { grades } = useSelector<RootState, GradeState>(
    (state: any) => state.gradeReducer
  );
  const { subjects } = useSelector<RootState, SubjectState>(
    (state: any) => state.subjectReducer
  );

  const handleSelectGrade = (id: any) => {
    setSelectedGrade(id);
  };

  return (
    <div>
      <ScheduleForm
        handleSubmit={handleAddClass}
        grades={grades}
        subjects={subjects}
        handleSelectGrade={handleSelectGrade}
      />
      <ScheduleTable schedule={schedule} onDelete={handleRemoveClass} />
      <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
        <Button
          variant="contained"
          size="large"
          color="primary"
          style={{ marginTop: 30 }}
          onClick={() => handleCreateSchedule()}
        >
          Crear Horario
        </Button>
      </Box>
    </div>
  );
};

export default SchedulePicker;
