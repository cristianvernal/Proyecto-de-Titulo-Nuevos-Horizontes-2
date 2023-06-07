import firebase from "firebase/app";
import { Student } from "./Student";
type Timestamp = firebase.firestore.Timestamp;

export interface AsignGrade {
    id: string,
    Nota1: string,
    Nota2: string,
    Nota3: string,
    Nota4: string,
    Promedio: string,
    StudentId: string,
    StudentData?: Student;
    FechaCreacion: Timestamp,
}