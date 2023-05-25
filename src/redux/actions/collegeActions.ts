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
import { College } from "../../models/College";

const API_KEY = firebaseConfig.apiKey;
const { format, addDays } = require("date-fns");

export const getColleges = (
  limit: number = types.TABLE_LIMIT_DEFAULT,
  order: string = "FechaCreacion"
): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: types.COLLEGES_GET_SUBMITING,
    });
    try {
      const response = await firestore
        .collection("Establecimientos")
        .limit(limit)
        .orderBy(order, "desc")
        .get();

      // Without limit
      const responseTotal = await firestore
        .collection("Establecimientos")
        .get();

      const collegelist = response.docs.map((x) => ({
        ...x.data(),
        id: x.id,
      }));
      dispatch({
        type: types.COLLEGES_GET_SUCCESS,
        payload: {
          users: collegelist,
          totalDocs: responseTotal.size,
          lastDoc: response.docs[response.docs.length - 1],
        },
      });
    } catch (error: any) {
      console.log(error);
      dispatch({
        type: types.COLLEGES_GET_FAILURE,
        payload: error,
      });
    }
  };
};
export const getMoreColleges = (
  limit: number = types.TABLE_LIMIT_DEFAULT
): AppThunk => {
  return async (dispatch, getState) => {
    dispatch({
      type: types.COLLEGES_GET_SUBMITING,
    });
    const { colleges, totalDocs, lastDoc } = getState().collegeReducer;
    try {
      const response = await firestore
        .collection("Establecimientos")
        .orderBy("FechaCreacion", "desc")
        .startAfter(lastDoc)
        .limit(limit)
        .get();

      const collegesList = response.docs.map((x) => ({
        ...x.data(),
        id: x.id,
      }));

      dispatch({
        type: types.COLLEGES_GET_SUCCESS,
        colleges: colleges.concat(collegesList as College[]),
        totalDocs: totalDocs,
        lastDoc: response.docs[response.docs.length - 1],
      });
    } catch (error: any) {
      console.log(error);
      dispatch({
        type: types.COLLEGES_GET_FAILURE,
        payload: error,
      });
    }
  };
};

export function AddCollege(data: Partial<College>): AppThunk {
  return async (dispatch) => {
    dispatch({
      type: types.COLLEGES_ADD_SUBMITING,
    });
    try {
      await firestore.collection("Establecimientos").add({
        ...data,
        FechaCreacion: firebase.firestore.FieldValue.serverTimestamp(),
      });
      dispatch(getColleges());
      dispatch({
        type: types.COLLEGES_ADD_SUCCESS,
      });
    } catch (error: any) {
      console.log(error);
      dispatch({
        type: types.COLLEGES_ADD_FAILURE,
        payload: "Error Inesperado",
      });
    }
  };
}

export const setAddCollegeInital = (): Action => ({
  type: types.COLLEGES_ADD_INITIAL,
});

export const setSelectedCollege = (college: any): Action => ({
  type: types.COLLEGES_SET_SELECTED,
  payload: college,
});

export const setEditCollegeInital = (): Action => ({
  type: types.COLLEGES_EDIT_INITIAL,
});

export const setDeleteCollegeInital = (): Action => ({
  type: types.COLLEGES_DELETE_INITIAL,
});
//funcion para editar
export function EditCollege(data: Partial<College>): AppThunk {
  return async (dispatch) => {
    dispatch({
      type: types.COLLEGES_EDIT_SUBMITING,
    });
    try {
      console.log(data.id);
      await firestore.collection("Establecimientos").doc(data.id).update(data);
      dispatch(getColleges());
      dispatch({
        type: types.COLLEGES_EDIT_SUCCESS,
      });
    } catch (error: any) {
      console.log(error);
      dispatch({
        type: types.COLLEGES_EDIT_FAILURE,
        payload: "Error Inesperado",
      });
    }
  };
}

export const deleteCollege = (college: any): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: types.COLLEGES_DELETE_SUBMITING,
    });
    try {
      await firestore.collection("Establecimientos").doc(college.id).delete();
      dispatch({
        type: types.COLLEGES_DELETE_SUCCESS,
        payload: college,
      });
      dispatch(getColleges());
    } catch (error: any) {
      console.log(error);
      dispatch({
        type: types.COLLEGES_DELETE_FAILURE,
        payload: "Ha ocurrido un error al Eliminar el establecimiento",
      });
    }
  };
};
