import { Action } from "../../models/action";
import * as types from "../../constants";
import { FormState } from "../../models/form_state";
import { Grade } from "../../models/Grade";

export interface GradeState {
  grades: Grade[];
  state: FormState;
  totalDocs: number;
  delete: {
    state: FormState;
    error?: string;
  };
  lastDoc?: any;
  error?: string;
  add: {
    state: FormState;
    error?: string;
  };
  edit: {
    error?: string;
    state: FormState;
  };
}

const initialState = {
  grades: [],
  state: FormState.Initial,
  totalDocs: 0,
  add: {
    state: FormState.Initial,
  },
  delete: {
    state: FormState.Initial,
  },
  edit: {
    state: FormState.Initial,
  },
} as GradeState;

export const gradeReducer = (
  state = initialState,
  action: Action
): GradeState => {
  switch (action.type) {
    case types.GRADES_GET_SUBMITING:
      return {
        ...state,
        state: FormState.Submitting,
        error: undefined,
      };
    case types.GRADES_GET_SUCCESS:
      return {
        ...state,
        state: FormState.Success,
        grades: action.payload.users,
        totalDocs: action.payload.totalDocs,
        lastDoc: action.payload.lastDoc,
      };
    case types.GRADES_GET_FAILURE:
      return {
        ...state,
        state: FormState.Failure,
        error: action.payload,
      };
    case types.GRADES_ADD_INITIAL:
      return {
        ...state,
        add: {
          state: FormState.Initial,
        },
      };
    case types.GRADES_ADD_SUBMITING:
      return {
        ...state,
        add: {
          state: FormState.Submitting,
        },
      };
    case types.GRADES_ADD_SUCCESS:
      return {
        ...state,
        add: {
          state: FormState.Success,
        },
      };
    case types.GRADES_ADD_FAILURE:
      return {
        ...state,
        add: {
          state: FormState.Failure,
          error: action.payload,
        },
      };
    case types.GRADES_DELETE_INITIAL:
      return {
        ...state,
        delete: {
          state: FormState.Initial,
        },
      };
    case types.GRADES_DELETE_SUBMITING:
      return {
        ...state,
        delete: {
          state: FormState.Submitting,
        },
      };
    case types.GRADES_DELETE_SUCCESS:
      return {
        ...state,
        delete: {
          state: FormState.Success,
        },
      };
    case types.GRADES_DELETE_FAILURE:
      return {
        ...state,
        delete: {
          state: FormState.Failure,
          error: action.payload,
        },
      };
    case types.GRADES_EDIT_INITIAL:
      return {
        ...state,
        edit: {
          state: FormState.Initial,
        },
      };
    case types.GRADES_EDIT_SUBMITING:
      return {
        ...state,
        edit: {
          state: FormState.Submitting,
        }
      };
    case types.GRADES_EDIT_SUCCESS:
      return {
        ...state,
        edit: {
          state: FormState.Success,
        },
      };
    case types.GRADES_EDIT_FAILURE:
      return {
        ...state,
        edit: {
          state: FormState.Failure,
          error: action.payload,
        },
      };
    default:
      return state;
  }
};
