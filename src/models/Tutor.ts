import firebase from "firebase/app";
import { Student } from "./Student";

type Timestamp = firebase.firestore.Timestamp;

export interface Tutor {
    id: string,
    Nombre: string,
    ApPaterno: string,
    ApMaterno: string,
    Rut: string,
    Telefono: number,
    Edad: number,
    Direccion: string,
    StudentId: any[],
    StudentData?: Student[],
    FechaCreacion: Timestamp,
}