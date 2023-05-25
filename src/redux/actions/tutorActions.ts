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
import { Tutor } from "../../models/Tutor";

export const getTutors = (
  limit: number = types.TABLE_LIMIT_DEFAULT,
  order: string = "FechaCreacion"
): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: types.TUTORS_GET_SUBMITING,
    });
    try {
      const response = await firestore
        .collection("Apoderados")
        .limit(limit)
        .orderBy(order, "desc")
        .get();

      const responseStudent = await firestore
        .collection("Estudiantes")
        .get();
      
      const studentList = responseStudent.docs.map((x) => ({
        ...x.data(),
        id: x.id,
      }))

      // Without limit
      const responseTotal = await firestore.collection("Apoderados").get();

     
      const tutorlist = response.docs.map((x) => ({
        ...x.data(),
        id: x.id,
        StudentData: x.data().StudentsId && studentList.filter(student => x.data().StudentsId.some((i: any) => i.StudentsId === student.id)) 
      }));

      
      dispatch({
        type: types.TUTORS_GET_SUCCESS,
        payload: {
          users: tutorlist,
          totalDocs: responseTotal.size,
          lastDoc: response.docs[response.docs.length - 1],
        },
      });
    } catch (error: any) {
      console.log(error);
      dispatch({
        type: types.TUTORS_GET_FAILURE,
        payload: error,
      });
    }
  };
};
export const getMoreTutors = (
  limit: number = types.TABLE_LIMIT_DEFAULT
): AppThunk => {
  return async (dispatch, getState) => {
    dispatch({
      type: types.TUTORS_GET_SUBMITING,
    });
    const { tutors, totalDocs, lastDoc } = getState().tutorReducer;
    try {
      const response = await firestore
        .collection("Apoderados")
        .orderBy("FechaCreacion", "desc")
        .startAfter(lastDoc)
        .limit(limit)
        .get();

      const tutorsList = response.docs.map((x) => ({
        ...x.data(),
        id: x.id,
      }));

      dispatch({
        type: types.TUTORS_GET_SUCCESS,
        tutors: tutors.concat(tutorsList as Tutor[]),
        totalDocs: totalDocs,
        lastDoc: response.docs[response.docs.length - 1],
      });
    } catch (error: any) {
      console.log(error);
      dispatch({
        type: types.TUTORS_GET_FAILURE,
        payload: error,
      });
    }
  };
};

export function AddTutor(data: Partial<Tutor>): AppThunk {
  return async (dispatch) => {
    dispatch({
      type: types.TUTORS_ADD_SUBMITING,
    });
    try {
      await firestore.collection("Apoderados").add({
        ...data,
        FechaCreacion: firebase.firestore.FieldValue.serverTimestamp(),
        StudentsId:[],
      });
      dispatch(getTutors());
      dispatch({
        type: types.TUTORS_ADD_SUCCESS
      })
    } catch (error: any) {
      console.log(error);
      dispatch({
        type: types.TUTORS_ADD_FAILURE,
        payload: "Error Inesperado",
      });
    }
  };
}

export const setAddTutorInital = (): Action => ({
  type: types.TUTORS_ADD_INITIAL,
});

export const setSelectedTutor = (tutor: any): Action => ({
  type: types.TUTORS_SET_SELECTED,
  payload: tutor,
});

export const setEditTutorInital = (): Action => ({
  type: types.TUTORS_EDIT_INITIAL,
});

export const setDeleteTutorInital = (): Action => ({
  type: types.TUTORS_DELETE_INITIAL,
});

//funcion para editar
export function EditTutor(data: Partial<Tutor>): AppThunk {
  return async (dispatch) => {
    dispatch({
      type: types.TUTORS_EDIT_SUBMITING,
    });
    try {
      console.log(data.id);
      await firestore.collection("Apoderados").doc(data.id).update(data);
      dispatch(getTutors());
      dispatch({
        type: types.TUTORS_EDIT_SUCCESS,
      });
    } catch (error: any) {
      console.log(error);
      dispatch({
        type: types.TUTORS_EDIT_FAILURE,
        payload: "Error Inesperado",
      });
    }
  };
}

export const deleteTutor = (tutor: any): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: types.TUTORS_DELETE_SUBMITING,
    });
    try {
      await firestore.collection("Apoderados").doc(tutor.id).delete();
      dispatch({
        type: types.TUTORS_DELETE_SUCCESS,
        payload: tutor,
      });
      dispatch(getTutors());
    } catch (error: any) {
      console.log(error);
      dispatch({
        type: types.TUTORS_DELETE_FAILURE,
        payload: "Ha ocurrido un error al Eliminar el establecimiento",
      });
    }
  };
};
