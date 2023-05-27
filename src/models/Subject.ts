import firebase from "firebase/app";
import { Employee } from "./Employee";
type Timestamp = firebase.firestore.Timestamp;

export interface Subject {
    id: string,
    Sigla: string,
    ProfesorId: string,
    TeacherId?: Employee,
    Asignatura: string,
    Asignaturas: string,
    Horas: number,
    FechaCreacion: Timestamp,
}