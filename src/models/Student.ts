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
    StudentId: string,
    StudentGrade?: Student;
    FechaCreacion: Timestamp,
    observaciones: Observacion,
    Notas: Nota,
}

    interface Observacion {
    enfermedades: string;
    discapacidad: string;
    otros: string;
    }

    interface Nota{
        nota1: string,
        nota2: string,
        nota3: string,
        nota4: string,
    }