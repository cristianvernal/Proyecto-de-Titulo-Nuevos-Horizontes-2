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
import { getGrades } from "./gradeActions";
import { Schedule } from "../../models/Schedule";

const API_KEY = firebaseConfig.apiKey;
const { format, addDays } = require("date-fns");

export const getSchedule = (GradeId: any): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: types.SCHEDULES_GET_SUBMITING,
    });
    try {
      const response = await firestore
        .collection("Horarios")
        .where("gradeId", "==", GradeId)
        .get();

      const scheduleList = response.docs.map((x) => ({
        ...x.data(),
        id: x.id,
      }));

      dispatch({
        type: types.SCHEDULES_GET_SUCCESS,
        payload: scheduleList[0],
      });
    } catch (error: any) {
      console.log(error);
      dispatch({
        type: types.SCHEDULES_GET_FAILURE,
        payload: error,
      });
    }
  };
};

export const addSchedule = (
  newSchedule: Partial<Schedule>,
  gradeId: string
): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: types.SCHEDULES_ADD_SUBMITING,
    });
    try {
      const data = {
        schedule: newSchedule,
        gradeId: gradeId,
        FechaCreacion: firebase.firestore.FieldValue.serverTimestamp(),
      };

      const response = await firestore.collection("Horarios").add(data);
      await firestore
        .collection("Cursos")
        .doc(gradeId)
        .update({ Horario: true });
      dispatch({
        type: types.SCHEDULES_ADD_SUCCESS,
        payload: response,
      });
      dispatch(getGrades());
    } catch (error: any) {
      console.log(error);
      dispatch({
        type: types.SCHEDULES_ADD_FAILURE,
        payload: error,
      });
    }
  };
};

export const updateSchedule = (
  newSchedule: Partial<Schedule>,
  scheduleId: string
): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: types.SCHEDULES_EDIT_SUBMITING,
    });
    try {
      const data = {
        schedule: newSchedule,
      };
      await firestore.collection("Horarios").doc(scheduleId).update(data);
      dispatch({
        type: types.SCHEDULES_EDIT_SUCCESS,
      });
      dispatch(getGrades());
    } catch (error: any) {
      console.log(error);
      dispatch({
        type: types.SCHEDULES_EDIT_FAILURE,
        payload: error,
      });
    }
  };
};

export const setAddScheduleInital = (): Action => ({
  type: types.SCHEDULES_ADD_INITIAL,
});

export const setEditScheduleInital = (): Action => ({
  type: types.SCHEDULES_EDIT_INITIAL,
});
