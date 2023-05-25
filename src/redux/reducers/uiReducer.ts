import { Action } from "../../models/action";
import * as types from "../../constants";
import { SnackState } from "../../models/snack-state";

interface UiReducerState {
  snack: {
    open: boolean;
    text: string;
    snackState: SnackState;
  };
}

const initialState = {
  snack: {
    open: false,
    text: "",
    snackState: SnackState.INITIAL,
  },
} as UiReducerState;

export const uiReducer = (
  state = initialState,
  action: Action
): UiReducerState => {
  switch (action.type) {
    case types.UI_SNACK_OPEN:
      return {
        ...state,
        snack: {
          ...state.snack,
          open: action.payload,
        },
      };
    case types.UI_SNACK_TEXT_CHANGE:
      return {
        ...state,
        snack: {
          ...state.snack,
          text: action.payload,
        },
      };
    case types.UI_SNACK_STATE_CHANGE:
      return {
        ...state,
        snack: {
          ...state.snack,
          snackState: action.payload,
        },
      };
    default:
      return state;
  }
};
