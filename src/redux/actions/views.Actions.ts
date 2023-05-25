import { firestore } from "../../firebase/firebase";
import { AppThunk } from "../../models/app-thunk";
import * as types from "../../constants";

export const getViews = (
): AppThunk => {
  return async (dispatch) => {
    dispatch({
      type: types.VIEWS_GET_SUBMITTING,
    });
    try {
      const response = await firestore
        .collection("Vistas")
        .orderBy("Nombre", "desc")
        .get();
      const resVistas = response.docs.map((x) => ({
        ...x.data(),
        id: x.id,
      }));
      dispatch({
        type: types.VIEWS_GET_SUCCESS,
        payload: resVistas,
      });
    } catch (error: any) {
      console.log(error);
      dispatch({
        type: types.VIEWS_GET_FAILURE,
        payload: "Ha ocurrido un error al cargar las Vistas",
      });
    }
  };
};
