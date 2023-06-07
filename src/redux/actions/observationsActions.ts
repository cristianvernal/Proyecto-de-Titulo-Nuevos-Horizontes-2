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
import { Employee } from "../../models/Employee";
import { SubjectList } from '../../pages/Subjects/SubjectList';
import { ObservationsList } from "../../pages/Observations/ObserbationsList";
import { Observation } from "../../models/Observations";



const API_KEY = firebaseConfig.apiKey;
const { format, addDays } = require("date-fns");

export const getObservations = (
  limit: number = types.TABLE_LIMIT_DEFAULT,
  order: string = "FechaCreacion"
): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: types.OBSERVATIONS_GET_SUBMITING,   
    });
    try {
      const response = await firestore
        .collection("Observaciones")
        .limit(limit)
        .orderBy(order, "desc")
        .get();

      const responseCollege = await firestore
        .collection("Establecimientos")
        .get();

      const collegeList = responseCollege.docs.map((x) => ({
        ...x.data(),
        id: x.id,
      })
      );

      const responseSubject = await firestore
      .collection("Asignaturas")
      .get();

      const subjectlist = responseSubject.docs.map((x) => ({
        ...x.data(),
        id: x.id,
      }))

      

      // Without limit
      const responseTotal = await firestore.collection("Trabajadores").get();
    
      const employeelist = response.docs.map((x) => ({
        ...x.data(),
        id: x.id,
        CollegeData: collegeList.find((i) => i.id === x.data().CollegeId),   
        SubjectData: x.data().Tipo === "Profesor" && subjectlist.filter((subject: any) => subject.ProfesorId === x.id),  
      }));
      dispatch({
        type: types.OBSERVATIONS_GET_SUCCESS,
        payload: {
          users: ObservationsList,
          totalDocs: responseTotal.size,
          lastDoc: response.docs[response.docs.length - 1],
        },
      });
    } catch (error: any) {
      console.log(error);
      dispatch({
        type: types.OBSERVATIONS_GET_FAILURE,
        payload: error,
      });
    }
  };
};

// export const GetObservations = (): AppThunk => {
//   return async (dispatch) => {
//     dispatch({
//       type: types.OBSERVATIONS_GET_SUBMITING,
//     });
//     try {
//       const response = await firestore
//         .collection("Observaciones")
//         .where("Tipo", "==", "Profesor")
//         .get();

//       const employeelist = response.docs.map((x) => ({
//         ...x.data(),
//         id: x.id,
//       }));
//       dispatch({
//         type: types.EMPLOYEES_GET_SUCCESS,
//         payload: {
//           users: employeelist,
//           totalDocs: response.size,
//           lastDoc: response.docs[response.docs.length - 1],
//         },
//       });
//     } catch (error: any) {
//       console.log(error);
//       dispatch({
//         type: types.EMPLOYEES_GET_FAILURE,
//         payload: error,
//       });
//     }
//   };
// };

export const getMoreObservations = (
  limit: number = types.TABLE_LIMIT_DEFAULT
): AppThunk => {
  return async (dispatch, getState) => {
    dispatch({
      type: types.OBSERVATIONS_GET_SUBMITING,
    });
    const { observations, totalDocs, lastDoc } = getState().observationReducer;
    try {
      const response = await firestore
        .collection("Observaciones")
        .orderBy("FechaCreacion", "desc")
        .startAfter(lastDoc)
        .limit(limit)
        .get();

      const observationsList = response.docs.map((x) => ({
        ...x.data(),
        id: x.id,
      }));

      dispatch({
        type: types.OBSERVATIONS_GET_SUCCESS,
        observations: observations.concat(observationsList as Observation[]),
        totalDocs: totalDocs,
        lastDoc: response.docs[response.docs.length - 1],
      });
    } catch (error: any) {
      console.log(error);
      dispatch({
        type: types.OBSERVATIONS_GET_FAILURE,
        payload: error,
      });
    }
  };
};

export function AddObservation(data: Partial<Observation>): AppThunk {
    return async (dispatch) => {
      dispatch({
        type: types.OBSERVATIONS_ADD_SUBMITING,
      });
      try {
        await firestore.collection("Observaciones").add({
          ...data,
          FechaCreacion: firebase.firestore.FieldValue.serverTimestamp(),
        });
        dispatch(getObservations());
        dispatch({
          type: types.OBSERVATIONS_ADD_SUCCESS
        })
      } catch (error: any) {
        console.log(error);
        dispatch({
          type: types.OBSERVATIONS_ADD_FAILURE,
          payload: "Error Inesperado",
        });
      }
    };
  }
  
  export const setAddObservationInital = (): Action => ({
    type: types.OBSERVATIONS_ADD_INITIAL,
  });
  
  export const setSelectedEmployee = (employee: any): Action => ({
    type: types.EMPLOYEES_SET_SELECTED,
    payload: employee,
  });
  
  export const setEditEmployeeInital = (): Action => ({
    type: types.EMPLOYEES_EDIT_INITIAL,
  });
  
  export const setDeleteEmployeeInital = (): Action => ({
    type: types.EMPLOYEES_DELETE_INITIAL,
  });
  
  //funcion para editar
//   export function EditEmployee(data: Partial<Employee>): AppThunk {
//     return async (dispatch) => {
//       dispatch({
//         type: types.EMPLOYEES_EDIT_SUBMITING,
//       });
//       try {
//         console.log(data.id);
//         await firestore.collection("Observaciones").doc(data.id).update(data);
//         dispatch(getObservations());
//         dispatch({
//           type: types.EMPLOYEES_EDIT_SUCCESS,
//         });
//       } catch (error: any) {
//         console.log(error);
//         dispatch({
//           type: types.EMPLOYEES_EDIT_FAILURE,
//           payload: "Error Inesperado",
//         });
//       }
//     };
//   }
  
//   export const deleteEmployee = (employee: any): AppThunk => {
//     return async (dispatch) => {
//       dispatch({
//         type: types.EMPLOYEES_DELETE_SUBMITING,
//       });
//       try {
//         await firestore.collection("Trabajadores").doc(employee.id).delete();
//         dispatch({
//           type: types.EMPLOYEES_DELETE_SUCCESS,
//           payload: employee,
//         });
//         dispatch(getEmployees());
//       } catch (error: any) {
//         console.log(error);
//         dispatch({
//           type: types.EMPLOYEES_DELETE_FAILURE,
//           payload: "Ha ocurrido un error al Eliminar el establecimiento",
//         });
//       }
//     };
//   };
  
