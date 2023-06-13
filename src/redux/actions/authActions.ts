import * as types from "../../constants";
import { AppThunk } from "../../models/app-thunk";
import {
  resetPassword as authResetPassword,
  signUp as authSignUp,
} from "../../services/authService";
import { auth, firestore } from "../../firebase/firebase";
import { openSnack } from "./uiActions";
import { SnackState } from "../../models/snack-state";

interface Credentials {
  email: string;
  password: string;
  name?: string;
}

export function signIn(credentials: Credentials): AppThunk {
  return async (dispatch) => {
    dispatch({ type: types.AUTH_SIGN_IN_REQUEST });
    console.log(credentials)
    try {
      await auth.signInWithEmailAndPassword(
        credentials.email,
        credentials.password
      );

      // if (response.user) {
      //   dispatch({
      //     type: types.AUTH_SIGN_IN_SUCCESS,
      //     id: response.user.uid,
      //     email: response.user.email,
      //     name: response.user.displayName,
      //   });
      // } else {
      //   throw new Error("Error desconocido");
      // }
    } catch (error: any) {
      console.log(error?.code)
      if (error?.code === "auth/too-many-requests") {
        dispatch(
          openSnack(
            "Demasiados Intentos. Recuperar Contraseña",
            SnackState.ERROR
          )
        );
      } else if (error?.code === "auth/user-not-found") {
        dispatch(openSnack("Credenciales Incorrectas", SnackState.ERROR));
      } else if (error?.code === "auth/wrong-password"){
        dispatch(openSnack("Contraseña Incorrecta", SnackState.ERROR));
      }
      dispatch({ type: types.AUTH_SIGN_IN_FAILURE });
    }
  };
}

export function validateSession(): AppThunk {
  return (dispatch) => {
    dispatch({ type: types.AUTH_SIGN_IN_REQUEST });
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const token = await user.getIdToken(false);

        const userResponse = await firestore
          .collection("Usuarios")
          .doc(user.uid)
          .get();
        if (userResponse.exists) {
           const userDB: any = {
             ...userResponse.data(),

          //   // id: userResponse.docs[0].id,
          //   // ...userResponse.docs[0].data(),
          //   // id: userResponse.docs[0].id,
           };

          if (userDB?.TipoUsuario === 'Administrador' ) {
            dispatch({
              type: types.AUTH_SIGN_IN_SUCCESS,
              id: user.uid,
              email: user.email,
              // name: `${userDB.Nombre} ${userDB.Apellido}`,
              image: user.photoURL,
              token,
              // activo: userDB.Activo,
              // tipoUsuario: userDB.TipoPermisos,
            });
          } else {
            dispatch(openSnack("Usuario no cuenta con los permisos", SnackState.ERROR));
            dispatch({
              type: types.AUTH_SIGN_OUT,
            });
          }
        }
      } else {
        dispatch(openSnack("Usuario no encontrado", SnackState.ERROR));
        dispatch({
          type: types.AUTH_SIGN_OUT,
        });
      }
    });
  };
}

export function signUp(credentials: Credentials): AppThunk {
  return async (dispatch) => {
    dispatch({ type: types.AUTH_SIGN_UP_REQUEST });

    try {
      const response = await auth.createUserWithEmailAndPassword(
        credentials.email,
        credentials.password
      );

      await response.user?.updateProfile({
        displayName: credentials.name,
      });
    } catch (error) {
      dispatch({ type: types.AUTH_SIGN_IN_FAILURE });
    }

    return authSignUp(credentials)
      .then((response) => {
        dispatch({
          type: types.AUTH_SIGN_UP_SUCCESS,
          id: response.id,
          email: response.email,
          name: response.name,
        });
      })
      .catch((error) => {
        dispatch({ type: types.AUTH_SIGN_UP_FAILURE });
        throw error;
      });
  };
}

export function signOut(): AppThunk {
  return async () => {
    await auth.signOut();
  };
}

export function resetPassword(credentials: Credentials): AppThunk {
  return async (dispatch) => {
    dispatch({ type: types.AUTH_RESET_PASSWORD_REQUEST });

    return authResetPassword(credentials)
      .then((response) => {
        dispatch({
          type: types.AUTH_RESET_PASSWORD_SUCCESS,
          email: response.email,
        });
      })
      .catch((error) => {
        dispatch({ type: types.AUTH_RESET_PASSWORD_FAILURE });
        throw error;
      });
  };
}
