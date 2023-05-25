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

const API_KEY = firebaseConfig.apiKey;
const { format, addDays } = require("date-fns");

export const getUsers = (
  limit: number = types.TABLE_LIMIT_DEFAULT,
  order: string = "FechaCreacion"
): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: types.USERS_GET_IS_SUBMITTING,
    });
    try {
      const response = await firestore
        .collection("Usuarios")
        .limit(limit)
        .orderBy(order, "desc")
        .get();

      // Without limit
      const responseTotal = await firestore.collection("Usuarios").get();

      const userslist = response.docs.map((x) => ({
        ...x.data(),
        id: x.id,
      }));
      dispatch({
        type: types.USERS_GET_SUCCESS,
        payload: {
          users: userslist,
          totalDocs: responseTotal.size,
          lastDoc: response.docs[response.docs.length - 1],
        },
      });
    } catch (error: any) {
      console.log(error);
      dispatch({
        type: types.USERS_GET_FAILURE,
        payload: error,
      });
    }
  };
};
export const unlockedUser = ( id:string): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: types.USER_UNLOCKED_SUBMMITING,
    });
    try {
      const responseUSer = await firestore
        .collection("Usuarios")
        .doc(id)
        .update({
          Estado: "Activo"
        });
        dispatch(
          openSnack("Se ha Desbloqueado el usuario exitosamente", SnackState.SUCCESS)
        );
    } catch (error: any) {
      dispatch({
        type: types.USER_UNLOCKED_FAILURE,
        payload: "Ha ocurrido un error al bloquear el Usuario",
      });
    }
  };
};
export const blockedUser = ( id:string): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: types.USER_BLOCKED_SUBMMITING,
    });
    try {
      const responseUSer = await firestore
        .collection("Usuarios")
        .doc(id)
        .update({
          Estado: "Bloqueado"
        });
        dispatch(
          openSnack("Se ha bloqueado el usuario exitosamente", SnackState.SUCCESS)
        );
    } catch (error: any) {
      dispatch({
        type: types.USER_BLOCKED_FAILURE,
        payload: "Ha ocurrido un error al bloquear el Usuario",
      });
    }
  };
};
export function AddSuscripcion(id: string, number: number): AppThunk {
  return async (dispatch) => {
    dispatch({
      type: types.USER_UPDATE_SUSCRIPCION_SUBMMITING,
    });
    try {
      const today = new Date();
      const suscripcion = addDays(today, number);
      const response = await firestore
        .collection("Usuarios")
        .doc(id)
        .update({
          Suscripcion: {
            SuscripcionHasta: suscripcion,
            FechaSuscripcion: firebase.firestore.FieldValue.serverTimestamp(),
          },
        });
      dispatch(
        openSnack("Se agreago suscripcion exitosamente", SnackState.SUCCESS)
      );
    } catch (error: any) {
      console.log(error);
      dispatch(
        openSnack("Error inesperado Intentelo nuevamente", SnackState.ERROR)
      );
      dispatch({
        type: types.USER_UPDATE_SUSCRIPCION_FAILURE,
        payload: "Error Inesperado",
      });
    }
  };
}

export const getMoreUsers = (
  limit: number = types.TABLE_LIMIT_DEFAULT
): AppThunk => {
  return async (dispatch, getState) => {
    dispatch({
      type: types.USERS_GET_IS_SUBMITTING,
    });
    const { users, totalDocs, lastDoc } = getState().usersReducer;
    try {
      const response = await firestore
        .collection("Usuarios")
        .orderBy("Nombre_lower")
        .startAfter(lastDoc)
        .limit(limit)
        .get();

      const usersList = response.docs.map((x) => ({
        ...x.data(),
        id: x.id,
      }));

      dispatch({
        type: types.USERS_GET_SUCCESS,
        users: users.concat(usersList),
        totalDocs: totalDocs,
        lastDoc: response.docs[response.docs.length - 1],
      });
    } catch (error: any) {
      console.log(error);
      dispatch({
        type: types.USERS_GET_FAILURE,
        payload: error,
      });
    }
  };
};

export const getUsersFiltered = (
  filtro: any = {},
  order?: string,
  limit: number = types.TABLE_LIMIT_DEFAULT
): AppThunk => {
  return async (dispatch) => {
    dispatch(isLoading(true));
    try {
      let query: any;

      if (order) {
        query = firestore
          .collection("Usuarios")
          .where("Estado", "==", "Activo")
          .orderBy("FechaCreacion")
          .orderBy(order);

        Object.keys(filtro).forEach((key) => {
          let value = filtro[key];

          if (key === "endAt") {
            const miliDate = Date.parse(value);
            query = query.endAt(new Date(miliDate));
          } else if (key === "startAt") {
            const miliDate = Date.parse(value);
            query = query.startAt(new Date(miliDate));
          } else {
            query = query.where(key, "==", value);
          }
        });
        const response = await query.get();
        const usersList = response.docs.map((x: any) => ({
          ...x.data(),
          id: x.id,
        }));
        dispatch(setUsers(usersList));
        dispatch(setLastDoc(response.docs[response.docs.length - 1]));
      } else {
        query = firestore
          .collection("Usuarios")
          .where("Estado", "==", "Activo")
          .orderBy("FechaCreacion")
          
        Object.keys(filtro).forEach((key) => {
          let value = filtro[key];
          if (key === "endAt") {
            const miliDate = Date.parse(value);
            query = query.startAt(new Date(miliDate));
          } else if (key === "startAt") {
            const miliDate = Date.parse(value);
            query = query.endAt(new Date(miliDate));
          } else {
            query = query.where(key, "==", value);
          }
        });
        const response = await query.get();
        const usersList = response.docs.map((x: any) => ({
          ...x.data(),
          id: x.id,
        }));
        dispatch(setUsers(usersList));
        dispatch(setLastDoc(response.docs[response.docs.length - 1]));
      }
    } catch (error: any) {
      console.log(error);
      dispatch(setError(error));
    } finally {
    }
  };
};

export const getUser = (id: string): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: types.USER_GET_ONE_SUBMMITING,
    });
    try {
      const response = await firestore.collection("Usuarios").doc(id).get();
      dispatch({
        type: types.USER_GET_ONE_SUCCESS,
        payload: { ...response.data(), id: response.id },
      });
    } catch (error: any) {
      dispatch({
        type: types.USER_GET_ONE_FAILURE,
        payload: "Ha ocurrido un error obteniendo el usuario",
      });
      console.log(error);
    }
  };
};

export const createUser = (user: any): AppThunk => {
  return async (dispatch) => {
    try {
      //Crear usuario en Authentication
      const res: any = await Axios.post<NewGoogleUserResponse>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
        {
          email: user.Email,
          password: user.Contrasenia,
          returnSecureToken: true,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const uid = res.data.localId;

      user.Nombre_lower = cleanString(user.Nombre);
      user.Apellido_lower = cleanString(user.Apellido);

      await firestore
        .collection("Usuarios")
        .doc(uid)
        .set({
          ...user,
        });
      dispatch(getUsers());
      dispatch(openSnack("Usuario creado con éxito", SnackState.SUCCESS));
    } catch (error: any) {
      console.log(error);
    }
  };
};

export const updateUser = (user: any): AppThunk => {
  return async (dispatch) => {
    try {
      const data = { ...user };
      delete data.id;
      data.Nombre_lower = cleanString(data.Nombre);
      data.Apellido_lower = cleanString(data.Apellido);

      await firestore.collection("Usuarios").doc(user.id).update(data);
      dispatch(openSnack("Datos han sido actualizados", SnackState.SUCCESS));
      dispatch(getUser(user.id));
    } catch (error: any) {
      console.log(error);
    }
  };
};

export const deleteUser = (user: any): AppThunk => {
  return async (dispatch) => {
    try {
      await firestore
        .collection("Usuarios")
        .doc(user.id)
        .update({ Activo: false });

      dispatch(getUsers());
    } catch (error: any) {
      console.log(error);
    }
  };
};

export const ResetPasswordUser = (user: any): AppThunk => {
  return async (dispatch) => {
    try {
      const res: any = await Axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${API_KEY}`,
        {
          requestType: "PASSWORD_RESET",
          email: user.Email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then(() =>
        dispatch(
          openSnack("Correo de restauración enviado", SnackState.SUCCESS)
        )
      );
    } catch (error: any) {
      console.log(error);
      dispatch(openSnack("Ha ocurrido un error", SnackState.ERROR));
    }
  };
};

export const setSelectedUser = (user: any): Action => ({
  type: types.USERS_SET_SELECTED,
  payload: user,
});

const setUsers = (users: any[]): Action => ({
  type: types.USERS_GET_DOCS,
  payload: users,
});

const setLastDoc = (doc: any): Action => ({
  type: types.USERS_SET_LAST_DOC,
  payload: doc,
});

const isLoading = (isloading: boolean): Action => ({
  type: types.USERS_LOADING,
  payload: isloading,
});

const setError = (error: string): Action => ({
  type: types.USERS_FAILURE,
  payload: error,
});

