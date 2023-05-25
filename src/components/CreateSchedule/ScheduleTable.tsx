import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
} from "@material-ui/core";
import { Delete } from "@material-ui/icons";

interface Props {
  schedule: {
    [day: string]: {
      asignatura: string;
      horaInicio: string;
      horaFin: string;
    }[];
  };
  onDelete: (day: string, classToRemove: any) => void;
}

interface Interval {
  start: string;
  end: string;
}

const ScheduleTable: React.FC<Props> = ({ schedule, onDelete }) => {
  const weekdays = ["lunes", "martes", "miercoles", "jueves", "viernes"];
  const weekDaysList = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"]
  const addMinutes = (time: string, minutes: number): string => {
    const date = new Date(`1970-01-01T${time}`);
    date.setMinutes(date.getMinutes() + minutes);
    return date.toTimeString().slice(0, 5);
  };

  const intervals: Interval[] = useMemo(() => {
    const intervalStart = "08:00";
    const intervalEnd = "18:00";
    const intervalDuration = 45; // en minutos
    const intervals: Interval[] = [];

    let currentTime = intervalStart;
    while (currentTime < intervalEnd) {
      intervals.push({
        start: currentTime,
        end: addMinutes(currentTime, intervalDuration),
      });
      currentTime = addMinutes(currentTime, intervalDuration);
    }

    return intervals;
  }, []);

  useEffect(() => {
    // Este efecto no tiene ninguna función en particular, pero forzará una actualización del componente cada vez que cambien las propiedades
  }, [schedule]);

  const toMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const handleDelete = (day: string, classToRemove: any) => {
    onDelete(day, classToRemove);
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell></TableCell>
          {weekDaysList.map((weekday) => (
            <TableCell key={weekday} align="center">
              {weekday}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {intervals.map((interval) => {
          const items: React.ReactNode[] = [];
          weekdays.forEach((weekday) => {
            const classes = schedule[weekday].filter((item) => {
              const itemStart = toMinutes(item.horaInicio);
              const itemEnd = toMinutes(item.horaFin);
              const intervalStart = toMinutes(interval.start);
              const intervalEnd = toMinutes(interval.end);
              return (
                (itemStart >= intervalStart && itemEnd <= intervalEnd) || // La asignatura está completamente dentro del intervalo
                (itemStart < intervalStart && itemEnd > intervalStart) || // La asignatura comienza antes del intervalo y termina dentro del intervalo
                (itemStart < intervalEnd && itemEnd > intervalEnd) // La asignatura comienza dentro del intervalo y termina después del intervalo
              );
            });
            if (classes.length > 0) {
              items.push(
                <TableCell key={`${weekday}-${interval.start}`} align="center">
                  {classes[0].asignatura}
                  <IconButton onClick={() => handleDelete(weekday, classes[0])} size="small">
                    <Delete />
                  </IconButton>
                </TableCell>
              );
            }else {
              items.push(
                <TableCell
                  key={`${weekday}-${interval.start}`}
                  align="center"
                ></TableCell>
              );
            }
          });
          return (
            <TableRow key={interval.start}>
              <TableCell align="center" component="th" scope="row">
                {interval.start} - {interval.end}
              </TableCell>
              {items}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default ScheduleTable;
