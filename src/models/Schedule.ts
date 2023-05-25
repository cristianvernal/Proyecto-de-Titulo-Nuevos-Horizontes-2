import firebase from "firebase/app";

type Timestamp = firebase.firestore.Timestamp;

export interface Schedule {
  id?: string;
  gradeId: string;
  schedule: {
    lunes: [
      {
        asignatura: string;
        horaInicio: string;
        horaFin: string;
      }
    ];
    martes: [
      {
        asignatura: string;
        horaInicio: string;
        horaFin: string;
      }
    ];
    miercoles: [
      {
        asignatura: string;
        horaInicio: string;
        horaFin: string;
      }
    ];
    jueves: [
      {
        asignatura: string;
        horaInicio: string;
        horaFin: string;
      }
    ];
    viernes: [
      {
        asignatura: string;
        horaInicio: string;
        horaFin: string;
      }
    ];
  };
  FechaCreacion: Timestamp;
}
