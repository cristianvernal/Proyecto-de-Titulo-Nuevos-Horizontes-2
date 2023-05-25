import firebase from "firebase/app";
import { College } from "./College";
import { Subject } from "./Subject";
type Timestamp = firebase.firestore.Timestamp;

export interface Employee {
    id: string,
    Tipo: string,
    Nombre: string,
    ApPaterno: string,
    ApMaterno: string,
    Rut: string,
    Telefono: number,
    Edad: number,
    Direccion: string,
    CollegeId: string,
    CollegeData?: College,
    SubjectData?: Subject[],
    FechaCreacion: Timestamp,
}