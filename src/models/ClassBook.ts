import firebase from "firebase/app";
import { Employee } from "./Employee";
import { Grade } from "./Grade";
type Timestamp = firebase.firestore.Timestamp;

export interface ClassBook {
    id: string,
    Curso: string,
    GradeData?: Grade[],
    ProfesorJefe: string,
    EmployeeData?: Employee[],
    FechaCreacion: Timestamp,
}