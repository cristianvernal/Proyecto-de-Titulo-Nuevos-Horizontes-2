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
import { Classroom } from "../../models/Classroom";

const API_KEY = firebaseConfig.apiKey;
const { format, addDays } = require("date-fns");

export const getClassrooms = (
  limit: number = types.TABLE_LIMIT_DEFAULT,
  order: string = "FechaCreacion"
): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: types.CLASSROOMS_GET_SUBMITING,
    });
    try {
      const response = await firestore
        .collection("Salas")
        .limit(limit)
        .orderBy(order, "desc")
        .get();

      // Without limit
      const responseTotal = await firestore
        .collection("Salas")
        .get();

      const collegeRef = await firestore.collection("Establecimientos").get();
      const collegeList = collegeRef.docs.map((x) => ({
        ...x.data(),
        id: x.id,
      }));
      
      const gradesRef = await firestore.collection("Cursos").get();
      const gradesList = gradesRef.docs.map((x) => ({
        ...x.data(),
        id: x.id,
      }));

      const classroomlist = response.docs.map((x) => ({
        ...x.data(),
        CollegeData: collegeList.find((y) => y.id === x.data().CollegeId),
        GradeData: gradesList.find((y) => y.id === x.data().GradeId),
        id: x.id,
      }));
      dispatch({
        type: types.CLASSROOMS_GET_SUCCESS,
        payload: {
          users: classroomlist,
          totalDocs: responseTotal.size,
          lastDoc: response.docs[response.docs.length - 1],
        },
      });
    } catch (error: any) {
      console.log(error);
      dispatch({
        type: types.CLASSROOMS_GET_FAILURE,
        payload: error,
      });
    }
  };
};
export const getMoreClassrooms = (
  limit: number = types.TABLE_LIMIT_DEFAULT
): AppThunk => {
  return async (dispatch, getState) => {
    dispatch({
      type: types.CLASSROOMS_GET_SUBMITING,
    });
    const { classrooms, totalDocs, lastDoc } = getState().classroomReducer;
    try {
      const response = await firestore
        .collection("Salas")
        .orderBy("FechaCreacion", "desc")
        .startAfter(lastDoc)
        .limit(limit)
        .get();

      const classroomsList = response.docs.map((x) => ({
        ...x.data(),
        id: x.id,
      }));

      dispatch({
        type: types.CLASSROOMS_GET_SUCCESS,
        colleges: classrooms.concat(classroomsList as Classroom[]),
        totalDocs: totalDocs,
        lastDoc: response.docs[response.docs.length - 1],
      });
    } catch (error: any) {
      console.log(error);
      dispatch({
        type: types.CLASSROOMS_GET_FAILURE,
        payload: error,
      });
    }
  };
};

export const addClassroom = (classroom: Partial<Classroom>): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: types.CLASSROOMS_ADD_SUBMITING,
    });
    try {
      const data = {
        ...classroom,
        FechaCreacion: firebase.firestore.FieldValue.serverTimestamp(),
      };
      await firestore.collection("Salas").add(data);
      dispatch({
        type: types.CLASSROOMS_ADD_SUCCESS,
      });
      dispatch(getClassrooms());
 
    } catch (error: any) {
      console.log(error);
      dispatch({
        type: types.CLASSROOMS_ADD_FAILURE,
        payload: error,
      });
  
    }
  };
};

export const editClassroom = (
  classroom: Partial<Classroom>,
  id: string
): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: types.CLASSROOMS_EDIT_SUBMITING,
    });
    try {
      await firestore.collection("Salas").doc(id).update(classroom);
      dispatch({
        type: types.CLASSROOMS_EDIT_SUCCESS,
      });
      dispatch(getClassrooms());
    } catch (error: any) {
      console.log(error);
      dispatch({
        type: types.CLASSROOMS_EDIT_FAILURE,
        payload: error,
      });
    }
  };
};

export const deleteClassroom = (id: string): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: types.CLASSROOMS_DELETE_SUBMITING,
    });
    try {
      await firestore.collection("Salas").doc(id).delete();
      dispatch({
        type: types.CLASSROOMS_DELETE_SUCCESS,
      });
      dispatch(getClassrooms());
    } catch (error: any) {
      console.log(error);
      dispatch({
        type: types.CLASSROOMS_DELETE_FAILURE,
        payload: error,
      });
    }
  };
};

export const setAddClassroomInitial = (): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: types.CLASSROOMS_ADD_INITIAL,
    });
  };
}

export const setEditClassroomInitial = (): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: types.CLASSROOMS_EDIT_INITIAL,
    });
  };
}

export const setDeleteClassroomInitial = (): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: types.CLASSROOMS_DELETE_INITIAL,
    });
  };
}