import { Action } from "../../models/action";
import { FormState } from "../../models/form_state";
import * as types from "../../constants";

export interface ViewsState {
  views: any[];
  state: FormState;
  error?: string;
}

const initialState = {
  views: [],
  state: FormState.Initial,
} as ViewsState;

export default function reducer(state = initialState, action: Action): ViewsState {
  switch (action.type) {
    case types.VIEWS_GET_SUCCESS:
      return {
        views: action.payload,
        state: FormState.Success,
      };
    case types.VIEWS_GET_FAILURE:
      return {
        ...state,
        state: FormState.Failure,
        error: action.payload,
      };
    case types.VIEWS_GET_SUBMITTING:
      return {
        ...state,
        state: FormState.Submitting,
        error: undefined,
      };
    default:
      return state;
  }
}
