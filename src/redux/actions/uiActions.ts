import * as types from "../../constants";
import { AppThunk } from "../../models/app-thunk";
import { SnackState } from "../../models/snack-state";

export const openSnack = (text: string, state: SnackState): AppThunk => {
  return (dispatch) => {
    dispatch({
      type: types.UI_SNACK_OPEN,
      payload: true,
    });
    dispatch({
      type: types.UI_SNACK_STATE_CHANGE,
      payload: state,
    });
    dispatch({
      type: types.UI_SNACK_TEXT_CHANGE,
      payload: text,
    });
  };
};

export const closeSnack = () => ({
  type: types.UI_SNACK_OPEN,
  payload: false,
});
