import firebase from "firebase/app";
import { Subject } from "./Subject";
import { Grade } from "./Grade";
type Timestamp = firebase.firestore.Timestamp;

export interface Curriculum {
    id: string,
    Asignatura: string,
    SubjectId: string,
    SubjectData?: Subject[],
    Curso: string,
    GradeData?: Grade,
    Paralelo: string,
    ParallelData?: Grade,
    Horas: number,
    HourData?:Subject,
    FechaCreacion: Timestamp,
}