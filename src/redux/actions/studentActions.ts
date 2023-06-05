import Axios from "axios";
import firebase from "firebase/app";
import * as types from "../../constants";
import { firebaseConfig, firestore } from "../../firebase/firebase";
import { Action } from "../../models/action";
import { AppThunk } from "../../models/app-thunk";
import { NewGoogleUserResponse } from "../../models/new_google_user_response";
import { SnackState } from "../../models/snack-state";
import { cleanString } from "../../utils/utils";
import { openSnack } from "./uiActions";
import { Student } from '../../models/Student'; 
import { Grade } from '../../models/Grade';
import { StudentList } from '../../pages/Students/StudentList';
import useEffect from 'react';

const API_KEY = firebaseConfig.apiKey;
const { format, addDays } = require("date-fns");

export const getStudents = (
  limit: number = types.TABLE_LIMIT_DEFAULT,
  order: string = "FechaCreacion"
): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: types.STUDENTS_GET_SUBMITING,   
    });
    try {
      const response = await firestore
        .collection("Estudiantes")
        .limit(limit)
        .orderBy(order, "desc")
        .get();

      // const responseTutor = await firestore
      //   .collection("Apoderados")
      //   .get();

      // const tutorList = responseTutor.docs.map((x) => ({
      //   ...x.data(),
      //   id: x.id,
      // }))

      const responseCollege = await firestore
        .collection("Establecimientos")
        .get();

      const collegeList = responseCollege.docs.map((x) => ({
        ...x.data(),
        id: x.id,
      }));

      const responseGrade = await firestore
        .collection("Cursos")
        .get();

      const gradeList = responseGrade.docs.map((x) => ({
        ...x.data(),
        id: x.id,
      }))


      // Without limit
      const responseTotal = await firestore.collection("Estudiantes").get();

    const studentFilter = await firestore.collection("Estudiantes").where("Nombres || Apellidos", "==", "GradeId").get();
    const filtroEstudiante = studentFilter.docs.map((x) => ({
      ...x.data(),
      id: x.id,
    }));
      
      const studentlist = response.docs.map((x) => ({
        ...x.data(),
        CollegeData: collegeList.find((i) => i.id === x.data().CollegeId), 
        GradeData: gradeList.find((y) => y.id === x.data().GradeId),
        StudentGrade: filtroEstudiante.find((z) => z.id === x.data().GradeId),
        id: x.id,
      }));
      dispatch({
        type: types.STUDENTS_GET_SUCCESS,
        payload: {
          users: studentlist,
          totalDocs: responseTotal.size,
          lastDoc: response.docs[response.docs.length - 1]
        },
      });
    } catch (error: any) {
      console.log(error);
      dispatch({
        type: types.STUDENTS_GET_FAILURE,
        payload: error,
      });
    }
  };
};

const getAllStudents = (): 
AppThunk =>{
  return async (dispatch, getState) => {
    dispatch({
      type: types.STUDENTS_GET_ALL_SUBMITING,
    });
    const { students, totalDocs, lastDoc} = getState().studentReducer;
    try{
      const response = await firestore
      .collection("Estudiantes")
      .orderBy("FechaCreacion", "desc")
      .startAfter(lastDoc)
      .get();

      const studentList = response.docs.map((x) => ({
        ...x.data(),
        id: x.id,
      }));

      dispatch({
        type: types.STUDENTS_GET_ALL_SUCCESS,
        students: studentList,
        totalDocs: totalDocs,
        lastDoc: response.docs[response.docs.length - 1],
      });
    } catch (error: any) {
      console.log(error);
      dispatch({
        type: types.STUDENTS_GET_ALL_FAILURE,
        payload: error,
      });
    }
    }
  }


export const getMoreStudents = (
  limit: number = types.TABLE_LIMIT_DEFAULT
): AppThunk => {
  return async (dispatch, getState) => {
    dispatch({
      type: types.STUDENTS_GET_SUBMITING,
    });
    const { students, totalDocs, lastDoc } = getState().studentReducer;
    try {
      const response = await firestore
        .collection("Estudiantes")
        .orderBy("FechaCreacion", "desc")
        .startAfter(lastDoc)
        .limit(limit)
        .get();

      const studentsList = response.docs.map((x) => ({
        ...x.data(),
        id: x.id,
      }));

      dispatch({
        type: types.STUDENTS_GET_SUCCESS,
        students: students.concat(studentsList as Student[]),
        totalDocs: totalDocs,
        lastDoc: response.docs[response.docs.length - 1],
      });
    } catch (error: any) {
      console.log(error);
      dispatch({
        type: types.STUDENTS_GET_FAILURE,
        payload: error,
      });
    }
  };
};

export function AddStudent(data: Partial<Student>): AppThunk {
  return async (dispatch) => {
    dispatch({
      type: types.STUDENTS_ADD_SUBMITING,
    });
    try {
      await firestore.collection("Estudiantes").add({
        ...data,
        FechaCreacion: firebase.firestore.FieldValue.serverTimestamp(),
      });

      // let newArrayId = [];

      // const tutorResponse = await firestore.collection("Apoderados").doc(data.TutorId).get()
      // if (tutorResponse?.data()?.StudentsId.length>0){
      //   newArrayId = tutorResponse?.data()?.StudentsId
      //   newArrayId.push({StudentsId: responseCreate.id})
      // } else { 
      //   newArrayId.push({StudentsId: responseCreate.id})
      // } 
      // await firestore.collection("Apoderados").doc(data.TutorId).update({StudentsId: newArrayId})
      
      dispatch(getStudents());
      dispatch({
        type: types.STUDENTS_ADD_SUCCESS 
      })
    } catch (error: any) {
      console.log(error);
      dispatch({
        type: types.STUDENTS_ADD_FAILURE,
        payload: "Error Inesperado",
      });
    }
  };
}

export const setAddStudentInital = (): Action => ({
  type: types.STUDENTS_ADD_INITIAL,
});

export const setSelectedStudent = (student: any): Action => ({
  type: types.STUDENTS_SET_SELECTED,
  payload: student,
});

export const setEditStudentInital = (): Action => ({
  type: types.STUDENTS_EDIT_INITIAL,
});

export const setDeleteStudentInital = (): Action => ({
  type: types.STUDENTS_DELETE_INITIAL,
});
//funcion para editar
export function EditStudent(data: Partial<Student>): AppThunk {
  return async (dispatch) => {
    dispatch({
      type: types.STUDENTS_EDIT_SUBMITING,
    });
    try {
      console.log(data.id);
      await firestore.collection("Estudiantes").doc(data.id).update(data);
      dispatch(getStudents());
      dispatch({
        type: types.STUDENTS_EDIT_SUCCESS,
      });
    } catch (error: any) {
      console.log(error);
      dispatch({
        type: types.STUDENTS_EDIT_FAILURE,
        payload: "Error Inesperado",
      });
    }
  };
}

export const deleteStudent = (student: any): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: types.STUDENTS_DELETE_SUBMITING,
    });
    try {
      await firestore.collection("Estudiantes").doc(student.id).delete();
      dispatch({
        type: types.STUDENTS_DELETE_SUCCESS,
        payload: student,
      });
      dispatch(getStudents());
    } catch (error: any) {
      console.log(error);
      dispatch({
        type: types.STUDENTS_DELETE_FAILURE,
        payload: "Ha ocurrido un error al Eliminar el establecimiento",
      });
    }
  };
};
