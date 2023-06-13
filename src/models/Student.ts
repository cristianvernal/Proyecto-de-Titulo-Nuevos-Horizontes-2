import firebase from "firebase/app";
import { College } from "./College";   
import { Grade } from "./Grade";
import { Tutor } from "./Tutor";
import { AsignGrade } from "./AsignGrade";


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
    AsignGradeData: AsignGrade[],
    
}

    interface Observacion {
    enfermedades: string;
    discapacidad: string;
    otros: string;
    }
