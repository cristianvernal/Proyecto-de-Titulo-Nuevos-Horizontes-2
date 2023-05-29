
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
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { green, red } from "@material-ui/core/colors";
import { Edit, ExpandLess, ExpandMore, Person } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import { spacing } from "@material-ui/system";
import React, { useEffect, useState } from "react";
import { Download, Eye, MinusSquare, Search, Trash } from "react-feather";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components/macro";
import { TableSkeleton } from "../../components/TableSkeleton";
import { TABLE_LIMITS, TABLE_LIMIT_DEFAULT } from "../../constants";
import { FormState } from "../../models/form_state";
import {
  getMoreUsers,
  getUsers,
  getUsersFiltered,
  setSelectedUser,
} from "../../redux/actions/usersActions";
import { RootState } from "../../redux/reducers/rootReducer";
import { IUsersState, usersReducer } from "../../redux/reducers/usersReducer";
import { useStyles } from "../../theme/useStyles";
import {
  cleanString,
  exportToCsv,
  timesStampFormattedsimple,
} from "../../utils/utils";
import { useTable } from "../../hooks/useTable";
import {
  addGrade,
  deleteGrade,
  getGrades,
  getMoreGrades,
  setAddGradeInital,
  setDeleteGradeInital,
  setEditGradeInital,
  updateGrade,
} from "../../redux/actions/gradeActions";
import { GradeState } from "../../redux/reducers/gradeReducer";
import { Grade } from "../../models/Grade";
import { ModalGrades } from "../../components/ModalGrades";
import { Employee } from '../../models/Employee';
import { EmployeeState } from "../../redux/reducers/employeeReducer";
import { GetTeachers } from "../../redux/actions/employeeActions";

interface ClassSchedule {
  day: string;
  time: string;
  className: string;
}

const ScheduleForm: React.FC = () => {
  const [schedule, setSchedule] = useState<ClassSchedule[]>([]);
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");
  const [className, setClassName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newClass: ClassSchedule = { day, time, className };
    setSchedule([...schedule, newClass]);
    setDay("");
    setTime("");
    setClassName("");
  };

  return (
    <div>
      <h1>Crear Horario de Clases</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Día:
          <input
            type="text"
            value={day}
            onChange={(e) => setDay(e.target.value)}
          />
        </label>
        <label>
          Hora:
          <input
            type="text"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </label>
        <label>
          Nombre de la Clase:
          <input
            type="text"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
          />
        </label>
        <button type="submit">Agregar Clase</button>
      </form>
      <h2>Horario de Clases:</h2>
      {schedule.length === 0 ? (
        <p>No hay clases programadas.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Día</th>
              <th>Hora</th>
              <th>Clase</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((classItem, index) => (
              <tr key={index}>
                <td>{classItem.day}</td>
                <td>{classItem.time}</td>
                <td>{classItem.className}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ScheduleForm;