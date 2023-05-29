import firebase from "firebase/app";
import { Employee } from "./Employee";
import { Student } from "./Student";
type Timestamp = firebase.firestore.Timestamp;

export interface Subject {
    id: string,
    Sigla: string,
    ProfesorId: string,
    TeacherData?: Employee,
    Asignatura: string,
    Horas: number,
    FechaCreacion: Timestamp,
}