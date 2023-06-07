import { Action } from "../../models/action";
import * as types from "../../constants";
import { FormState } from "../../models/form_state";
import { AsignGrade } from "../../models/AsignGrade";



export interface AsignGradeState {
  asignGrades: AsignGrade[];
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
  asignGrades: [],
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
} as AsignGradeState;

export const asignGradeReducer = (
  state = initialState,
  action: Action
): AsignGradeState => {
  switch (action.type) {
    case types.ASIGNGRADES_GET_SUBMITING:
      return {
        ...state,
        state: FormState.Submitting,
        error: undefined,
      };
    case types.ASIGNGRADES_GET_SUCCESS:
      return {
        ...state,
        state: FormState.Success,
        asignGrades: action.payload.users,
        totalDocs: action.payload.totalDocs,
        lastDoc: action.payload.lastDoc,
      };
    case types.ASIGNGRADES_GET_FAILURE:
      return {
        ...state,
        state: FormState.Failure,
        error: action.payload,
      };
    case types.ASIGNGRADES_ADD_INITIAL:
      return {
        ...state,
        add: {
          state: FormState.Initial,
        },
      };
    case types.ASIGNGRADES_ADD_SUBMITING:
      return {
        ...state,
        add: {
          state: FormState.Submitting,
        },
      };
    case types.ASIGNGRADES_ADD_SUCCESS:
      return {
        ...state,
        add: {
          state: FormState.Success,
        },
      };
    case types.ASIGNGRADES_ADD_FAILURE:
      return {
        ...state,
        add: {
          state: FormState.Failure,
          error: action.payload,
        },
      };
    // case types.CLASSROOMS_EDIT_INITIAL:
    //   return {
    //     ...state,
    //     edit: {
    //       state: FormState.Initial,
    //       selected: null,
    //     },
    //   };
    // case types.CLASSROOMS_EDIT_SUBMITING:
    //   return {
    //     ...state,
    //     edit: {
    //       state: FormState.Submitting,
    //       selected: null,
    //     },
    //   };
    // case types.CLASSROOMS_EDIT_SUCCESS:
    //   return {
    //     ...state,
    //     edit: {
    //       state: FormState.Success,
    //       selected: null,
    //     },
    //   };
    // case types.CLASSROOMS_EDIT_FAILURE:
    //   return {
    //     ...state,
    //     edit: {
    //       state: FormState.Failure,
    //       error: action.payload,
    //       selected: null,
    //     },
    //   };
    // case types.CLASSROOMS_SET_SELECTED:
    //   return {
    //     ...state,
    //     edit: {
    //       ...state.edit,
    //       selected: action.payload,
    //     },
    //   };
    // case types.CLASSROOMS_DELETE_INITIAL:
    //   return {
    //     ...state,
    //     delete: {
    //       state: FormState.Initial,
    //     },
    //   };
    // case types.CLASSROOMS_DELETE_SUBMITING:
    //   return {
    //     ...state,
    //     delete: {
    //       state: FormState.Submitting,
    //     },
    //   };
    // case types.CLASSROOMS_DELETE_SUCCESS:
    //   return {
    //     ...state,
    //     delete: {
    //       state: FormState.Success,
    //     },
    //   };
    // case types.CLASSROOMS_DELETE_FAILURE:
    //   return {
    //     ...state,
    //     delete: {
    //       state: FormState.Failure,
    //       error: action.payload,
    //     },
    //   };
    default:
      return state;
  }
};
