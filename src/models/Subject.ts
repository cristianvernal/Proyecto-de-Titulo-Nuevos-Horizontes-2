import firebase from "firebase/app";
type Timestamp = firebase.firestore.Timestamp;

export interface Subject {
    id: string,
    Sigla: string,
    ProfesorId: string,
    Asignatura: string,
    Horas: number,
    FechaCreacion: Timestamp,
}