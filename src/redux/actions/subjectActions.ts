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
import {Subject} from "../../models/Subject";


const API_KEY = firebaseConfig.apiKey;
const { format, addDays } = require("date-fns");

export const getSubjects = (
  limit: number = types.TABLE_LIMIT_DEFAULT,
  order: string = "FechaCreacion"
): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: types.SUBJECTS_GET_SUBMITING,   
    });
    try {
      const response = await firestore
        .collection("Asignaturas")
        .limit(limit)
        .orderBy(order, "desc")
        .get();

        

      // Without limit
      const responseTotal = await firestore.collection("Asignaturas").get();

      const employeeRef = await firestore.collection("Trabajadores").where("Tipo","==","Profesor").get();
      const employeeList = employeeRef.docs.map((x) => ({
        ...x.data(),
        id: x.id,
      }));

      const subjectlist = response.docs.map((x) => ({
        ...x.data(),
        TeacherData: employeeList.find((y) => y.id === x.data().ProfesorId),
        id: x.id,
      }));
      dispatch({
        type: types.SUBJECTS_GET_SUCCESS,
        payload: {
          users: subjectlist,
          totalDocs: responseTotal.size,
          lastDoc: response.docs[response.docs.length - 1],
        },
      });
    } catch (error: any) {
      console.log(error);
      dispatch({
        type: types.SUBJECTS_GET_FAILURE,
        payload: error,
      });
    }
  };
};

export const getMoreSubjects = (
  limit: number = types.TABLE_LIMIT_DEFAULT
): AppThunk => {
  return async (dispatch, getState) => {
    dispatch({
      type: types.SUBJECTS_GET_SUBMITING,
    });
    const { subjects, totalDocs, lastDoc } = getState().subjectReducer;
    try {
      const response = await firestore
        .collection("Asignaturas")
        .orderBy("FechaCreacion", "desc")
        .startAfter(lastDoc)
        .limit(limit)
        .get();

      const subjectsList = response.docs.map((x) => ({
        ...x.data(),
        id: x.id,
      }));

      dispatch({
        type: types.SUBJECTS_GET_SUCCESS,
        students: subjects.concat(subjectsList as Subject[]),
        totalDocs: totalDocs,
        lastDoc: response.docs[response.docs.length - 1],
      });
    } catch (error: any) {
      console.log(error);
      dispatch({
        type: types.SUBJECTS_GET_FAILURE,
        payload: error,
      });
    }
  };
};

export function AddSubject(data: Partial<Subject>): AppThunk {
  return async (dispatch) => {
    dispatch({
      type: types.SUBJECTS_ADD_SUBMITING,
    });
    try {
      await firestore.collection("Asignaturas").add({
        ...data,
        FechaCreacion: firebase.firestore.FieldValue.serverTimestamp(),
      });
      dispatch(getSubjects());
      dispatch({
        type: types.SUBJECTS_ADD_SUCCESS
      })
    } catch (error: any) {
      console.log(error);
      dispatch({
        type: types.SUBJECTS_ADD_FAILURE,
        payload: "Error Inesperado",
      });
    }
  };
}

export const setAddSubjectInital = (): Action => ({
  type: types.SUBJECTS_ADD_INITIAL,
});

export const setSelectedSubject = (subject: any): Action => ({
  type: types.SUBJECTS_SET_SELECTED,
  payload: subject,
});

export const setEditSubjectInital = (): Action => ({
  type: types.SUBJECTS_EDIT_INITIAL,
});

export const setDeleteSubjectInital = (): Action => ({
  type: types.SUBJECTS_DELETE_INITIAL,
});
//funcion para editar
export function EditSubject(data: Partial<Subject>): AppThunk {
  return async (dispatch) => {
    dispatch({
      type: types.SUBJECTS_EDIT_SUBMITING,
    });
    try {
      const updateData = {
        ...data,
      };
      delete updateData.id;
      await firestore.collection("Asignaturas").doc(data.id).update(data);
      dispatch(getSubjects());
      dispatch({
        type: types.SUBJECTS_EDIT_SUCCESS,
      });
    } catch (error: any) {
      console.log(error);
      dispatch({
        type: types.SUBJECTS_EDIT_FAILURE,
        payload: "Error Inesperado",
      });
    }
  };
}

export const deleteSubject = (subject: any): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: types.SUBJECTS_DELETE_SUBMITING,
    });
    try {
      await firestore.collection("Asignaturas").doc(subject.id).delete();
      dispatch({
        type: types.SUBJECTS_DELETE_SUCCESS,
        payload: subject,
      });
      dispatch(getSubjects());
    } catch (error: any) {
      console.log(error);
      dispatch({
        type: types.SUBJECTS_DELETE_FAILURE,
        payload: "Ha ocurrido un error al Eliminar el establecimiento",
      });
    }
  };
};


export const getSubjtectByTeacherId = (teacherId: string): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: types.SUBJECTS_GET_SUBMITING,
    });
    try {
      const response = await firestore
        .collection("Asignaturas")
        .where("ProfesorId", "==", teacherId)
        .get();

      const subjectlist = response.docs.map((x) => ({
        ...x.data(),
        id: x.id,
      }));
      console.log(subjectlist)
      dispatch({
        type: types.SUBJECTS_GET_SUCCESS,
        payload: {
          users: subjectlist,
          totalDocs: response.size,
          lastDoc: response.docs[response.docs.length - 1],
        },
      });
    } catch (error: any) {
      console.log(error);
      dispatch({
        type: types.SUBJECTS_GET_FAILURE,
        payload: error,
      });
    }
  };
};