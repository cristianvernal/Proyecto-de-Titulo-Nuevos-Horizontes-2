import firebase from "firebase/app";
type Timestamp = firebase.firestore.Timestamp;

export interface College {
    id: string,
    Nombre: string,
    Direccion: string,
    Telefono: number,
    Region: string,
    Comuna: string,
    FechaCreacion: Timestamp,
}