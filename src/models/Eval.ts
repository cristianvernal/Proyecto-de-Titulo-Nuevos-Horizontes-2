import firebase from "firebase/app";
type Timestamp = firebase.firestore.Timestamp;

export interface Eval {
    id: string,
    Nota: number,
    FechaCreacion: Timestamp,
}   