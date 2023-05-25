import firebase from "firebase/app";
import { College } from "./College";
import { Grade } from "./Grade";
type Timestamp = firebase.firestore.Timestamp;

export interface Classroom {
  id: string;
  NumeroSala: string;
  Ubicacion: string;
  CollegeId: string;
  CollegeData?: College;
  GradeId: string;
  GradeData?: Grade;
  FechaCreacion: Timestamp;
}
