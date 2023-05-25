import { Action } from "../../models/action";
import * as types from "../../constants";
import { FormState } from "../../models/form_state";
import { Subject } from "../../models/Subject";

export interface SubjectState {
  subjects: Subject[];
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
    state: FormState;
    error?: string;
    selected?: any;
  };
}

const initialState = {
  subjects: [],
  state: FormState.Initial,
  totalDocs: 0,
  delete: {
    state: FormState.Initial,
  },
  add: {
    state: FormState.Initial,
  },
  edit: {
    state: FormState.Initial,
    selected: null,
  },
} as SubjectState;

export const subjectReducer = (
  state = initialState,
  action: Action
): SubjectState => {
  switch (action.type) {
    case types.SUBJECTS_GET_SUBMITING:
      return {
        ...state,
        state: FormState.Submitting,
        error: undefined,
      };
    case types.SUBJECTS_GET_SUCCESS:
      return {
        ...state,
        state: FormState.Success,
        subjects: action.payload.users,
        totalDocs: action.payload.totalDocs,
        lastDoc: action.payload.lastDoc,
      };
    case types.SUBJECTS_GET_FAILURE:
      return {
        ...state,
        state: FormState.Failure,
        error: action.payload,
      };
    default:
      return state;

    case types.SUBJECTS_ADD_INITIAL:
      return {
        ...state,
        add: {
          state: FormState.Initial,
        },
      };
    case types.SUBJECTS_ADD_SUBMITING:
      return {
        ...state,
        add: {
          state: FormState.Submitting,
        },
      };
    case types.SUBJECTS_ADD_SUCCESS:
      return {
        ...state,
        add: {
          state: FormState.Success,
        },
      };
    case types.SUBJECTS_ADD_FAILURE:
      return {
        ...state,
        add: {
          state: FormState.Failure,
          error: action.payload,
        },
      };
    case types.SUBJECTS_SET_SELECTED:
      return {
        ...state,
        edit: {
          ...state.edit,
          selected: action.payload,
        },
      };
    case types.SUBJECTS_EDIT_INITIAL:
      return {
        ...state,
        edit: { state: FormState.Initial },
      };
    case types.SUBJECTS_EDIT_SUBMITING:
      return {
        ...state,
        edit: { state: FormState.Submitting },
      };
    case types.SUBJECTS_EDIT_SUCCESS:
      return {
        ...state,
        edit: { state: FormState.Success },
      };
    case types.SUBJECTS_EDIT_FAILURE:
      return {
        ...state,
        edit: { state: FormState.Failure, error: action.payload },
      };
    case types.SUBJECTS_DELETE_INITIAL:
      return {
        ...state,
        delete: {
          state: FormState.Initial,
          error: undefined,
        },
      };
    case types.SUBJECTS_DELETE_SUBMITING:
      return {
        ...state,
        delete: {
          state: FormState.Submitting,
          error: undefined,
        },
      };
    case types.SUBJECTS_DELETE_SUCCESS:
      return {
        ...state,
        delete: { state: FormState.Success },
        subjects: state.subjects.filter((x) => x.id !== action.payload.id),
      };
    case types.SUBJECTS_DELETE_FAILURE:
      return {
        ...state,
        delete: {
          state: FormState.Failure,
          error: action.payload,
        },
      };
  }
};
