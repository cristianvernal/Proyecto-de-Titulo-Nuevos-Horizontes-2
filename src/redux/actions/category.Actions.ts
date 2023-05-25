import firebase from "firebase";
import * as types from "../../constants";
import { firestore } from "../../firebase/firebase";
import { Action } from "../../models/action";
import { AppThunk } from "../../models/app-thunk";
import { SnackState } from "../../models/snack-state";
import { cleanString } from "../../utils/utils";
import { openSnack } from "./uiActions";

export const getCategories = (
  limit: number = types.TABLE_LIMIT_DEFAULT,
  order: string = "FechaCreacion"
): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: types.CATEGORY_GET_SUBMITING,
    });
    try {
      const response = await firestore
        .collection("Categorias")
        .limit(limit)
        .orderBy(order, "desc")
        .get();
      const responseTotal = await firestore.collection("Categorias").get();
      const resCategorias = response.docs.map((x) => ({
        ...x.data(),
        id: x.id,
      }));
      dispatch({
        type: types.CATEGORY_GET_SUCCESS,
        payload: {
          categorias: resCategorias,
          totalDocs: responseTotal.size,
          lastDoc: response.docs[response.docs.length - 1],
        },
      });
    } catch (error: any) {
      console.log(error);
      dispatch({
        type: types.CATEGORY_GET_FAILURE,
        payload: "Ha ocurrido un error al cargar las Categorias",
      });
    }
  };
};

export const getAllCategories = (
  limit: number = types.TABLE_LIMIT_DEFAULT,
  order: string = "Nombre"
): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: types.CATEGORY_GET_SUBMITING,
    });
    try {
      const response = await firestore
        .collection("Categorias")
        .orderBy(order, "asc")
        .get();
      const responseTotal = await firestore.collection("Categorias").get();
      const resCategorias = response.docs.map((x) => ({
        ...x.data(),
        id: x.id,
      }));
      dispatch({
        type: types.CATEGORY_GET_SUCCESS,
        payload: {
          categorias: resCategorias,
          totalDocs: responseTotal.size,
          lastDoc: response.docs[response.docs.length - 1],
        },
      });
    } catch (error: any) {
      console.log(error);
      dispatch({
        type: types.CATEGORY_GET_FAILURE,
        payload: "Ha ocurrido un error al cargar las Categorias",
      });
    }
  };
};
export const getOneCAtegory = (id: any): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: types.CATEGORY_GET_ONE_SUBMMITING,
    });
    try {
      const responseSolicitud = await firestore
        .collection("Categorias")
        .doc(id)
        .get();

      dispatch({
        type: types.CATEGORY_GET_ONE_SUCCESS,
        payload: responseSolicitud.data(),
      });
    } catch (error: any) {
      dispatch({
        type: types.CATEGORY_GET_ONE_FAILURE,
        payload: "Ha ocurrido un error al Obtener la Categoria",
      });
    }
  };
};
export function updateCategory(id: string, category: string): AppThunk {
  return async (dispatch) => {
    dispatch({
      type: types.CATEGORY_UPDATE_ONE_SUBMMITING,
    });
    try {
      const response = await firestore
        .collection("Categorias")
        .doc(id)
        .update({
          Nombre: category,
          Nombre_lower: cleanString(category),
        });
      dispatch(getCategories());
      dispatch(
        openSnack("Se actualizo categoria exitosamente", SnackState.SUCCESS)
      );
    } catch (error: any) {
      console.log(error);
      dispatch(
        openSnack("Error inesperado Intentelo nuevamente", SnackState.ERROR)
      );
      dispatch({
        type: types.CATEGORY_UPDATE_ONE_FAILURE,
        payload: "Error Inesperado",
      });
    }
  };
}
export function AddCategory(nombre: string): AppThunk {
  return async (dispatch) => {
    dispatch({
      type: types.CATEGORY_ADD_ONE_SUBMMITING,
    });
    try {
      await firestore.collection("Categorias").add({
        Bloqueado: false,
        FechaCreacion: firebase.firestore.FieldValue.serverTimestamp(),
        Nombre: nombre,
        Nombre_lower: cleanString(nombre),
      });
      dispatch(getCategories());
    } catch (error: any) {
      console.log(error);
      dispatch({
        type: types.CATEGORY_ADD_ONE_FAILURE,
        payload: "Error Inesperado",
      });
    }
  };
}
export const deleteCategory = (category: any): AppThunk => {
  return async (dispatch) => {
    try {
      await firestore.collection("Categorias").doc(category.id).delete();
      dispatch({
        type: types.CATEGORY_DELETED_SUCCESS,
        payload: category,
      });
      dispatch(getCategories());
    } catch (error: any) {
      console.log(error);
      dispatch({
        type: types.CATEGORY_DELETED_FAILURE,
        payload: "Ha ocurrido un error al Eliminar la Categoria",
      });
    }
  };
};

export const getMoreCategories = (
  limit: number = types.TABLE_LIMIT_DEFAULT
): AppThunk => {
  return async (dispatch, getState) => {
    dispatch({
      type: types.CATEGORY_GET_SUBMITING,
    });
    const lastDoc = getState().categoryReducer.lastDoc || "";
    const { totalDocs, categorias } = getState().categoryReducer;
    try {
      const response = await firestore
        .collection("Categorias")
        .startAfter(lastDoc)
        .limit(limit)
        .get();

      const resCategoria = response.docs.map((x) => ({
        ...x.data(),
        id: x.id,
      }));

      dispatch({
        type: types.CATEGORY_GET_SUCCESS,
        payload: {
          categorias: categorias.concat(resCategoria),
          totalDocs: totalDocs,
          lastDoc: response.docs[response.docs.length - 1],
        },
      });
    } catch (error: any) {
      dispatch({
        type: types.CATEGORY_GET_FAILURE,
        payload: "Ha ocurrido un error obteniendo listado de categorias",
      });
    }
  };
};
export const getCategoryFiltered = (
  filtro: any = {},
  order: string = "Nombre_lower",
  limit: number = types.TABLE_LIMIT_DEFAULT
): AppThunk => {
  return async (dispatch) => {
    dispatch(isLoading(true));
    try {
      let query: any;

      if (order) {
        query = firestore.collection("Categorias").orderBy("FechaCreacion");

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
        console.log(response);
        const categoriList = response.docs.map((x: any) => ({
          ...x.data(),
          id: x.id,
        }));
        dispatch({
          type: types.CATEGORY_GET_SUCCESS,
          payload: {
            categorias: categoriList,
            totalDocs: response.size,
            lastDoc: response.docs[response.docs.length - 1],
          },
        });
      } else {
        query = firestore.collection("Categorias").orderBy("FechaCreacion");

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
        const categoriList = response.docs.map((x: any) => ({
          ...x.data(),
          id: x.id,
        }));

        dispatch({
          type: types.CATEGORY_GET_SUCCESS,
          payload: {
            categorias: categoriList,
            totalDocs: response.size,
            lastDoc: response.docs[response.docs.length - 1],
          },
        });
      }
    } catch (error: any) {
      console.log(error);
      dispatch(setError(error));
    } finally {
    }
  };
};
export const setSelectedCategory = (category: any): Action => ({
  type: types.CATEGORY_SET_SELECTED,
  payload: category,
});
const isLoading = (isloading: boolean): Action => ({
  type: types.CATEGORY_LOADING,
  payload: isloading,
});

const setError = (error: string): Action => ({
  type: types.CATEGORY_FAILURE,
  payload: error,
});
