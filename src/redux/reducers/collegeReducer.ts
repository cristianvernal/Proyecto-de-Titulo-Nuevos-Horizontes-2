import { Action } from "../../models/action";
import * as types from "../../constants";
import { FormState } from "../../models/form_state";
import { College } from "../../models/College";

export interface CollegeState {
  colleges: College[];
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
  colleges: [],
  state: FormState.Initial,
  totalDocs: 0,
  delete: {
    state: FormState.Initial,
  },
  edit: {
    state: FormState.Initial,
    selected: null,
  },
} as CollegeState;

export const collegeReducer = (
  state = initialState,
  action: Action
): CollegeState => {
  switch (action.type) {
    case types.COLLEGES_GET_SUBMITING:
      return {
        ...state,
        state: FormState.Submitting,
        error: undefined,
      };
    case types.COLLEGES_GET_SUCCESS:
      return {
        ...state,
        state: FormState.Success,
        colleges: action.payload.users,
        totalDocs: action.payload.totalDocs,
        lastDoc: action.payload.lastDoc,
      };
    case types.COLLEGES_GET_FAILURE:
      return {
        ...state,
        state: FormState.Failure,
        error: action.payload,
      };
    case types.COLLEGES_ADD_INITIAL:
      return {
        ...state,
        add: {
          state: FormState.Initial,
        },
      };
    case types.COLLEGES_ADD_SUBMITING:
      return {
        ...state,
        add: {
          state: FormState.Submitting,
        },
      };
    case types.COLLEGES_ADD_SUCCESS:
      return {
        ...state,
        add: {
          state: FormState.Success,
        },
      };
    case types.COLLEGES_ADD_FAILURE:
      return {
        ...state,
        add: {
          state: FormState.Failure,
          error: action.payload,
        },
      };
    case types.COLLEGES_SET_SELECTED:
      return {
        ...state,
        edit: {
          ...state.edit,
          selected: action.payload,
        },
      };
    case types.COLLEGES_EDIT_INITIAL:
      return {
        ...state,
        edit: { state: FormState.Initial },
      };
    case types.COLLEGES_EDIT_SUBMITING:
      return {
        ...state,
        edit: { state: FormState.Submitting },
      };
    case types.COLLEGES_EDIT_SUCCESS:
      return {
        ...state,
        edit: { state: FormState.Success },
      };
    case types.COLLEGES_EDIT_FAILURE:
      return {
        ...state,
        edit: { state: FormState.Failure, error: action.payload },
      };
    case types.COLLEGES_DELETE_INITIAL:
      return {
        ...state,
        delete: {
          state: FormState.Initial,
          error: undefined,
        },
      };
    case types.COLLEGES_DELETE_SUBMITING:
      return {
        ...state,
        delete: {
          state: FormState.Submitting,
          error: undefined,
        },
      };
    case types.COLLEGES_DELETE_SUCCESS:
      return {
        ...state,
        delete: { state: FormState.Success },
        colleges: state.colleges.filter((x) => x.id !== action.payload.id),
      };
    case types.COLLEGES_DELETE_FAILURE:
      return {
        ...state,
        delete: {
          state: FormState.Failure,
          error: action.payload,
        },
      };
    /* case types.USERS_SET_SELECTED:
      return {
        ...state,
        edit: {
          ...state.edit,
          selectedUser: action.payload,
        },
      };
    case types.USERS_UPDATE_DOC:
      return {
        ...state,
        college: state.college.map((x) =>
          x.id === action.payload.id ? { ...x, ...action.payload } : x
        ),
      };
    case types.USERS_REMOVE_DOC:
      return {
        ...state,
        college: state.college.filter((x) => x.id !== action.payload.id),
      };
    case types.USER_UPDATE_SUSCRIPCION_SUBMMITING:
      return {
        ...state,
        add: {
          state: FormState.Submitting,
          error: undefined,
        },
      };
    case types.USER_UPDATE_SUSCRIPCION_SUCCESS:
      return {
        ...state,
        add: {
          state: FormState.Success,
        },
      };
    case types.USER_UPDATE_SUSCRIPCION_FAILURE:
      return {
        ...state,
        add: {
          state: FormState.Failure,
          error: action.payload,
        },
      };
    case types.USER_GET_ONE_SUBMMITING:
      return {
        ...state,
        edit: {
          state: FormState.Submitting,
          error: undefined,
        },
      };
    case types.USER_GET_ONE_SUCCESS:
      return {
        ...state,
        edit: {
          state: FormState.Success,
          selectedUser: action.payload,
        },
      };
    case types.USER_GET_ONE_FAILURE:
      return {
        ...state,
        edit: {
          state: FormState.Failure,
          error: action.payload,
        },
      };
    case types.USERS_GET_DOCS:
      return {
        ...state,
        college: action.payload,
      };
    case types.USERS_SET_LAST_DOC:
      return {
        ...state,
        lastDoc: action.payload,
      };
    case types.USERS_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case types.USERS_SET_TOTAL_DOCS:
      return {
        ...state,
        totalDocs: action.payload,
      };
    case types.USER_UNLOCKED_SUBMMITING:
      return {
        ...state,
        delete: {
          state: FormState.Submitting,
          error: undefined,
        },
      };
    case types.USER_UNLOCKED_FAILURE:
      return {
        ...state,
        delete: {
          state: FormState.Failure,
          error: action.payload,
        },
      };
    case types.USER_UNLOCKED_SUCCESS:
      return {
        ...state,
        delete: {
          state: FormState.Success,
        },
      };
      //
      case types.USER_BLOCKED_SUBMMITING:
        return {
          ...state,
          delete: {
            state: FormState.Submitting,
            error: undefined,
          },
        };
      case types.USER_BLOCKED_FAILURE:
        return {
          ...state,
          delete: {
            state: FormState.Failure,
            error: action.payload,
          },
        };
      case types.USER_BLOCKED_SUCCESS:
        return {
          ...state,
          delete: {
            state: FormState.Success,
          },
        }; */
    default:
      return state;
  }
};
