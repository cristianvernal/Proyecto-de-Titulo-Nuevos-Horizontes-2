import firebase from "firebase/app";
import { Student } from "./Student";

type Timestamp = firebase.firestore.Timestamp;

export interface Observation {
    id: string,
    Enfermedades: string,
    Discapacidad: string,
    Otros: string,
    StudentId: string,
    StudentData?: Student;
    FechaCreacion: Timestamp,
}