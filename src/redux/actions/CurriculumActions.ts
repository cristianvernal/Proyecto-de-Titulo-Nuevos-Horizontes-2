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
import { Curriculum } from "../../models/Curriculum";


const API_KEY = firebaseConfig.apiKey;
const { format, addDays } = require("date-fns");

export const getCurriculums = (
  limit: number = types.TABLE_LIMIT_DEFAULT,
  order: string = "FechaCreacion"
): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: types.CURRICULUMS_GET_SUBMITING,   
    });
    try {
      const response = await firestore
        .collection("Carga Academica")
        .limit(limit)
        .orderBy(order, "desc")
        .get();

        
        // const responseSubject = await firestore
        // .collection("Asignaturas")
        // .get();

      // const subjectList = responseSubject.docs.map((x) => ({
      //   ...x.data(),
      //   id: x.id,
      // }))

      const responseParallel = await firestore
        .collection("Cursos")
        .get();

      const parallelList = responseParallel.docs.map((x) => ({
        ...x.data(),
        id: x.id,
      }))

      const responseGrade = await firestore
        .collection("Cursos")
        .get();

      const gradeList = responseGrade.docs.map((x) => ({
        ...x.data(),
        id: x.id,
      }))

      const responseHour = await firestore
      .collection("Asignaturas")
      .get();

    const hourList = responseHour.docs.map((x) => ({
      ...x.data(),
      id: x.id,
    }))

      // Without limit
      const responseTotal = await firestore.collection("Carga Academica").get();
      // const subjectList = await firestore.collection("Asignaturas").where("Asignatura", "==", "ProfesorId").get();
      // const subjectLists = subjectList.docs.map((x) => ({
      //   ...x.data(),
      //   id: x.id,
      // }));

      const curriculumlist = response.docs.map((x) => ({
        ...x.data(),
        id: x.id,
        //  SubjectData: subjectLists.find((t) => t.id === x.data().SubjectData), 
        // GradeData: gradeList.find((y) => y.id === x.data().GradeId),
        // ParallelData: parallelList.find((z) => z.id === x.data().ParallelId),
        // HourData: hourList.find((a) => a.id === x.data().HourId),
      }));
      dispatch({
        type: types.CURRICULUMS_GET_SUCCESS,
        payload: {
          users: curriculumlist,
          totalDocs: responseTotal.size,
          lastDoc: response.docs[response.docs.length - 1],
        },
      });
    } catch (error: any) {
      console.log(error);
      dispatch({
        type: types.CURRICULUMS_GET_FAILURE,
        payload: error,
      });
    }
  };
};
export const getMoreCurriculums = (
  limit: number = types.TABLE_LIMIT_DEFAULT
): AppThunk => {
  return async (dispatch, getState) => {
    dispatch({
      type: types.CURRICULUMS_GET_SUBMITING,
    });
    const { curriculums, totalDocs, lastDoc } = getState().curriculumReducer;
    try {
      const response = await firestore
        .collection("Carga Academica")
        .orderBy("FechaCreacion", "desc")
        .startAfter(lastDoc)
        .limit(limit)
        .get();

      const curriculumList = response.docs.map((x) => ({
        ...x.data(),
        id: x.id,
      }));

      dispatch({
        type: types.CURRICULUMS_GET_SUCCESS,
        students: curriculums.concat(curriculumList as Curriculum[]),
        totalDocs: totalDocs,
        lastDoc: response.docs[response.docs.length - 1],
      });
    } catch (error: any) {
      console.log(error);
      dispatch({
        type: types.CURRICULUMS_GET_FAILURE,
        payload: error,
      });
    }
  };
};

// export function AddCurriculum(data: Partial<Curriculum>): AppThunk {
//   return async (dispatch) => {
//     dispatch({
//       type: types.CURRICULUMS_ADD_SUBMITING,
//     });
//     try {
//       await firestore.collection("Carga Academica").add({
//         ...data,
//         FechaCreacion: firebase.firestore.FieldValue.serverTimestamp(),
//       });
//       dispatch(getCurriculums());
//       dispatch({
//         type: types.CURRICULUMS_ADD_SUCCESS
//       })
//     } catch (error: any) {
//       console.log(error);
//       dispatch({
//         type: types.CURRICULUMS_ADD_FAILURE,
//         payload: "Error Inesperado",
//       });
//     }
//   };
// }

// export const setAddCurriculumInital = (): Action => ({
//   type: types.CURRICULUMS_ADD_INITIAL,
// });

// export const setSelectedSubject = (subject: any): Action => ({
//   type: types.SUBJECTS_SET_SELECTED,
//   payload: subject,
// });

// export const setEditSubjectInital = (): Action => ({
//   type: types.SUBJECTS_EDIT_INITIAL,
// });

// export const setDeleteSubjectInital = (): Action => ({
//   type: types.SUBJECTS_DELETE_INITIAL,
// });
// //funcion para editar
// export function EditSubject(data: Partial<Subject>): AppThunk {
//   return async (dispatch) => {
//     dispatch({
//       type: types.SUBJECTS_EDIT_SUBMITING,
//     });
//     try {
//       const updateData = {
//         ...data,
//       };
//       delete updateData.id;
//       await firestore.collection("Asignaturas").doc(data.id).update(data);
//       dispatch(getSubjects());
//       dispatch({
//         type: types.SUBJECTS_EDIT_SUCCESS,
//       });
//     } catch (error: any) {
//       console.log(error);
//       dispatch({
//         type: types.SUBJECTS_EDIT_FAILURE,
//         payload: "Error Inesperado",
//       });
//     }
//   };
// }

// export const deleteSubject = (subject: any): AppThunk => {
//   return async (dispatch) => {
//     dispatch({
//       type: types.SUBJECTS_DELETE_SUBMITING,
//     });
//     try {
//       await firestore.collection("Asignaturas").doc(subject.id).delete();
//       dispatch({
//         type: types.SUBJECTS_DELETE_SUCCESS,
//         payload: subject,
//       });
//       dispatch(getSubjects());
//     } catch (error: any) {
//       console.log(error);
//       dispatch({
//         type: types.SUBJECTS_DELETE_FAILURE,
//         payload: "Ha ocurrido un error al Eliminar el establecimiento",
//       });
//     }
//   };
// };


// export const getSubjtectByTeacherId = (teacherId: string): AppThunk => {
//   return async (dispatch) => {
//     dispatch({
//       type: types.SUBJECTS_GET_SUBMITING,
//     });
//     try {
//       const response = await firestore
//         .collection("Asignaturas")
//         .where("ProfesorId", "==", teacherId)
//         .get();

//       const subjectlist = response.docs.map((x) => ({
//         ...x.data(),
//         id: x.id,
//       }));
//       console.log(subjectlist)
//       dispatch({
//         type: types.SUBJECTS_GET_SUCCESS,
//         payload: {
//           users: subjectlist,
//           totalDocs: response.size,
//           lastDoc: response.docs[response.docs.length - 1],
//         },
//       });
//     } catch (error: any) {
//       console.log(error);
//       dispatch({
//         type: types.SUBJECTS_GET_FAILURE,
//         payload: error,
//       });
//     }
//   };
// };