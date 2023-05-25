import firebase from "firebase/app";
import { Employee } from "./Employee";
import { Student } from "./Student";
type Timestamp = firebase.firestore.Timestamp;

export interface Grade {
    id: string,
    Grado: string,
    Paralelo: string,
    TeacherId: string,
    TeacherData?: Employee,
    FechaCreacion: Timestamp,
    StudentId: string,
    Horario?: boolean
}