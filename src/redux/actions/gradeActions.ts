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
import { Grade } from "../../models/Grade";
import { Student } from "../../models/Student";
import { getStudents } from "./studentActions";

const API_KEY = firebaseConfig.apiKey;
const { format, addDays } = require("date-fns");

export const getGrades = (
  limit: number = types.TABLE_LIMIT_DEFAULT,
  order: string = "FechaCreacion"
): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: types.GRADES_GET_SUBMITING,
    });
    try {
      const response = await firestore
        .collection("Cursos")
        .limit(limit)
        .orderBy(order, "desc")
        .get();

        const responseStundent = await firestore
        .collection("Estudiantes")
        .get();

      // Without limit
      const responseTotal = await firestore.collection("Cursos").get();

      const employeeRef = await firestore.collection("Trabajadores").where("Tipo","==","Profesor").get();
      const employeeList = employeeRef.docs.map((x) => ({
        ...x.data(),
        id: x.id,
      }));
      
      const gradelist = response.docs.map((x) => ({
        ...x.data(),
        TeacherData: employeeList.find((y) => y.id === x.data().TeacherId),
        id: x.id,
      }));
      dispatch({
        type: types.GRADES_GET_SUCCESS,
        payload: {
          users: gradelist,
          totalDocs: responseTotal.size,
          lastDoc: response.docs[response.docs.length - 1],
        },
      });
    } catch (error: any) {
      console.log(error);
      dispatch({
        type: types.GRADES_GET_FAILURE,
        payload: error,
      });
    }
  };
};
export const getMoreGrades = (
  limit: number = types.TABLE_LIMIT_DEFAULT
): AppThunk => {
  return async (dispatch, getState) => {
    dispatch({
      type: types.GRADES_GET_SUBMITING,
    });
    const { grades, totalDocs, lastDoc } = getState().gradeReducer;
    try {
      const response = await firestore
        .collection("Cursos")
        .orderBy("FechaCreacion", "desc")
        .startAfter(lastDoc)
        .limit(limit)
        .get();

      const gradesList = response.docs.map((x) => ({
        ...x.data(),
        id: x.id,
      }));

      dispatch({
        type: types.GRADES_GET_SUCCESS,
        students: grades.concat(gradesList as Grade[]),
        totalDocs: totalDocs,
        lastDoc: response.docs[response.docs.length - 1],
      });
    } catch (error: any) {
      console.log(error);
      dispatch({
        type: types.GRADES_GET_FAILURE,
        payload: error,
      });
    }
  };
};

export const getAllGrades = (): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: types.GRADES_GET_SUBMITING,
    });
    try {
      const response = await firestore.collection("Cursos").get();

      const gradelist = response.docs.map((x) => ({
        ...x.data(),
        id: x.id,
      }));
      dispatch({
        type: types.GRADES_GET_SUCCESS,
        payload: {
          users: gradelist,
          totalDocs: response.size,
          lastDoc: response.docs[response.docs.length - 1],
        },
      });
    } catch (error: any) {
      console.log(error);
      dispatch({
        type: types.GRADES_GET_FAILURE,
        payload: error,
      });
    }
  };
};

export const addGrade = (grade: Grade): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: types.GRADES_ADD_SUBMITING,
    });
    try {
      const data = {
        ...grade,
        FechaCreacion: firebase.firestore.FieldValue.serverTimestamp(),
      };
      const response = await firestore.collection("Cursos").add(data);
      dispatch({
        type: types.GRADES_ADD_SUCCESS,
        payload: response,
      });
      dispatch(getGrades());
    } catch (error: any) {
      console.log(error);
      dispatch({
        type: types.GRADES_ADD_FAILURE,
        payload: error,
      });
    }
  };
};

export const updateGrade = (grade: Partial<Grade>): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: types.GRADES_EDIT_SUBMITING,
    });
    try {
      const data = {
        ...grade,
      };
      delete data.id;
      await firestore.collection("Cursos").doc(grade.id).update(data);
      dispatch({
        type: types.GRADES_EDIT_SUCCESS,
      });
      dispatch(getGrades());
    } catch (error: any) {
      console.log(error);
      dispatch({
        type: types.GRADES_EDIT_FAILURE,
        payload: error,
      });
    }
  };
};

export const deleteGrade = (id: string): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: types.GRADES_DELETE_SUBMITING,
    });
    try {
      await firestore.collection("Cursos").doc(id).delete();
      dispatch({
        type: types.GRADES_DELETE_SUCCESS,
      });
      dispatch(getGrades());
    } catch (error: any) {
      console.log(error);
      dispatch({
        type: types.GRADES_DELETE_FAILURE,
        payload: error,
      });
    }
  };
};

export const setAddGradeInital = (): Action => ({
  type: types.GRADES_ADD_INITIAL,
});

export const setDeleteGradeInital = (): Action => ({
  type: types.GRADES_DELETE_INITIAL,
});

export const setEditGradeInital = (): Action => ({
  type: types.GRADES_EDIT_INITIAL,
});
