import { Action } from "../../models/action";
import * as types from "../../constants";
import { FormState } from "../../models/form_state";
import { Tutor } from "../../models/Tutor";

export interface TutorState {
  tutors: Tutor[];
  state: FormState;
  totalDocs: number;
  delete: {
    state: FormState;
    error?: string;
  };
  lastDoc?: any;
  error?: string;
  add?: {
    state: FormState;
    error?: string;
  };
  edit: {
    state: FormState;
    error?: string;
    selected?: any;
  };
}

const initialState = {
  tutors: [],
  state: FormState.Initial,
  totalDocs: 0,
  delete: {
    state: FormState.Initial,
  },
  edit: {
    state: FormState.Initial,
    selected: null,
  },
} as TutorState;

export const tutorReducer = (
  state = initialState,
  action: Action
): TutorState => {
  switch (action.type) {
    case types.TUTORS_GET_SUBMITING:
      return {
        ...state,
        state: FormState.Submitting,
        error: undefined,
      };
    case types.TUTORS_GET_SUCCESS:
      return {
        ...state,
        state: FormState.Success,
        tutors: action.payload.users,
        totalDocs: action.payload.totalDocs,
        lastDoc: action.payload.lastDoc,
      };
    case types.TUTORS_GET_FAILURE:
      return {
        ...state,
        state: FormState.Failure,
        error: action.payload,
      };

    case types.TUTORS_ADD_INITIAL:
      return {
        ...state,
        add: {
          state: FormState.Initial,
        },
      };
    case types.TUTORS_ADD_SUBMITING:
      return {
        ...state,
        add: {
          state: FormState.Submitting,
        },
      };
    case types.TUTORS_ADD_SUCCESS:
      return {
        ...state,
        add: {
          state: FormState.Success,
        },
      };
    case types.TUTORS_ADD_FAILURE:
      return {
        ...state,
        add: {
          state: FormState.Failure,
          error: action.payload,
        },
      };
    default:
      return state;
      case types.TUTORS_SET_SELECTED:
        return {
          ...state,
          edit: {
            ...state.edit,
            selected: action.payload,
          },
        };
      case types.TUTORS_EDIT_INITIAL:
        return {
          ...state,
          edit: { state: FormState.Initial },
        };
      case types.TUTORS_EDIT_SUBMITING:
        return {
          ...state,
          edit: { state: FormState.Submitting },
        };
      case types.TUTORS_EDIT_SUCCESS:
        return {
          ...state,
          edit: { state: FormState.Success },
        };
      case types.TUTORS_EDIT_FAILURE:
        return {
          ...state,
          edit: { state: FormState.Failure, error: action.payload },
        };
      case types.TUTORS_DELETE_INITIAL:
        return {
          ...state,
          delete: {
            state: FormState.Initial,
            error: undefined,
          },
        };
      case types.TUTORS_DELETE_SUBMITING:
        return {
          ...state,
          delete: {
            state: FormState.Submitting,
            error: undefined,
          },
        };
      case types.TUTORS_DELETE_SUCCESS:
        return {
          ...state,
          delete: { state: FormState.Success },
          tutors: state.tutors.filter((x) => x.id !== action.payload.id),
        };
      case types.TUTORS_DELETE_FAILURE:
        return {
          ...state,
          delete: {
            state: FormState.Failure,
            error: action.payload,
          },
        };
  }
};
