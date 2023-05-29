import firebase from "firebase/app";
import { College } from "./College";   
import { Grade } from "./Grade";
import { Tutor } from "./Tutor";

type Timestamp = firebase.firestore.Timestamp;

export interface Student {
    id: string,
    Nombres: string,
    Apellidos: string,
    Rut: string,
    FechaNacimiento: string,
    Edad: number,
    Direccion: string,
    Tutor: string
    TutorId: string,
    TutorData?: Tutor;
    GradeId: string,
    GradeData?: Grade;
    CollegeId: string,
    CollegeData?: College;
    FechaCreacion: Timestamp,
}