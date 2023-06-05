import firebase from "firebase/app";
import { Student } from "./Student";
type Timestamp = firebase.firestore.Timestamp;

export interface Attendance {
    id: string,
    Presente: boolean,
    Observación: string,
    StudentId: string,
    StudentData?: Student,
    FechaCreacion: Timestamp,
}