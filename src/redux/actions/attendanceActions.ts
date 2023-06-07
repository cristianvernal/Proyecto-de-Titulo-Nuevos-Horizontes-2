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
// import { Classroom } from "../../models/Classroom";
import { ClassBook } from "../../models/ClassBook";
import { AttendanceList } from '../../pages/Attendance/AttendanceList';
import { Attendance } from "../../models/Attendance";

const API_KEY = firebaseConfig.apiKey;
const { format, addDays } = require("date-fns");

export const getAttendance = (
  limit: number = types.TABLE_LIMIT_DEFAULT,
  order: string = "FechaCreacion"
): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: types.CLASSBOOKS_GET_SUBMITING,
    });
    try {
      const response = await firestore
        .collection("Libro de Clases")
        .limit(limit)
        .orderBy(order, "desc")
        .get();

      // Without limit
      const responseTotal = await firestore
        .collection("Libro de Clases")
        .get();

      const classBookRef = await firestore.collection("Curso").get();
      
      const classBookList = classBookRef.docs.map((x) => ({
        ...x.data(),
        id: x.id,
      }));
      
      const classBooksRef = await firestore.collection("ProfesorJefe").get();
      const clasBookList = classBooksRef.docs.map((x) => ({
        ...x.data(),
        id: x.id,
      }));

      const classBooklist = response.docs.map((x) => ({
        ...x.data(),
        ClassBookData: classBookList.find((y) => y.id === x.data().ClassBookId),
        // ClassBookData: classBookList.find((y) => y.id === x.data().GradeId),
        id: x.id,
      }));
      dispatch({
        type: types.CLASSBOOKS_GET_SUCCESS,
        payload: {
          users: classBooklist,
          totalDocs: responseTotal.size,
          lastDoc: response.docs[response.docs.length - 1],
        },
      });
    } catch (error: any) {
      console.log(error);
      dispatch({
        type: types.CLASSBOOKS_GET_FAILURE,
        payload: error,
      });
    }
  };
};
export const getMoreAttendance = (
  limit: number = types.TABLE_LIMIT_DEFAULT
): AppThunk => {
  return async (dispatch, getState) => {
    dispatch({
      type: types.ATTENDANCES_GET_SUBMITING,
    });
    const { attendance, totalDocs, lastDoc } = getState().attendanceReducer;
    try {
      const response = await firestore
        .collection("Asistencia")
        .orderBy("FechaCreacion", "desc")
        .startAfter(lastDoc)
        .limit(limit)
        .get();

      const AttendanceList = response.docs.map((x) => ({
        ...x.data(),
        id: x.id,
      }));

      dispatch({
        type: types.ATTENDANCES_GET_SUCCESS,
        colleges: attendance.concat(AttendanceList as Attendance[]),
        totalDocs: totalDocs,
        lastDoc: response.docs[response.docs.length - 1],
      });
    } catch (error: any) {
      console.log(error);
      dispatch({
        type: types.CLASSBOOKS_GET_FAILURE,
        payload: error,
      });
    }
  };
};

export const addAttendance = (attendance: Partial<Attendance>): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: types.ATTENDANCES_ADD_SUBMITING,
    });
    try {
      const data = {
        ...attendance,
        FechaCreacion: firebase.firestore.FieldValue.serverTimestamp(),
      };
      await firestore.collection("Asistencia").add(data);
      dispatch({
        type: types.ATTENDANCES_ADD_SUCCESS,
      });
      dispatch(getAttendance());
 
    } catch (error: any) {
      console.log(error);
      dispatch({
        type: types.ATTENDANCES_ADD_FAILURE,
        payload: error,
      });
  
    }
  };
};

// export const editClassroom = (
//   classroom: Partial<Classroom>,
//   id: string
// ): AppThunk => {
//   return async (dispatch) => {
//     dispatch({
//       type: types.CLASSBOOKS_EDIT_SUBMITING,
//     });
//     try {
//       await firestore.collection("Salas").doc(id).update(classroom);
//       dispatch({
//         type: types.CLASSROOMS_EDIT_SUCCESS,
//       });
//       dispatch(getClassBooks());
//     } catch (error: any) {
//       console.log(error);
//       dispatch({
//         type: types.CLASSROOMS_EDIT_FAILURE,
//         payload: error,
//       });
//     }
//   };
// };

// export const deleteClassroom = (id: string): AppThunk => {
//   return async (dispatch) => {
//     dispatch({
//       type: types.CLASSROOMS_DELETE_SUBMITING,
//     });
//     try {
//       await firestore.collection("Salas").doc(id).delete();
//       dispatch({
//         type: types.CLASSROOMS_DELETE_SUCCESS,
//       });
//       dispatch(getClassrooms());
//     } catch (error: any) {
//       console.log(error);
//       dispatch({
//         type: types.CLASSROOMS_DELETE_FAILURE,
//         payload: error,
//       });
//     }
//   };
// };

export const setAddAttendanceInitial = (): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: types.ATTENDANCES_ADD_INITIAL,
    });
  };
}

// export const setEditAttendanceInitial = (): AppThunk => {
//   return async (dispatch) => {
//     dispatch({
//       type: types.ATTENDANCES_EDIT_INITIAL,
//     });
//   };
// }

// export const setDeleteClassroomInitial = (): AppThunk => {
//   return async (dispatch) => {
//     dispatch({
//       type: types.ATTENDANCES_DELETE_INITIAL,
//     });
//   };
// }