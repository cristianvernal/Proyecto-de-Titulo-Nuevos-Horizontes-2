import { Action } from "../../models/action";
import * as types from "../../constants";
import { FormState } from "../../models/form_state";

export interface IUsersState {
  users: any[];
  state: FormState;
  totalDocs: number;
  delete?: {
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
    error?: string;
    state: FormState;
    selectedUser?: any;
  };
}

const initialState = {
  users: [],
  state: FormState.Initial,
  totalDocs: 0,
  edit: {
    state: FormState.Initial,
    isLoading: false,
    selectedUser: null,
  },
} as IUsersState;

export const usersReducer = (
  state = initialState,
  action: Action
): IUsersState => {
  switch (action.type) {
    case types.USERS_GET_IS_SUBMITTING:
      return {
        ...state,
        state: FormState.Submitting,
        error: undefined,
      };
    case types.USERS_GET_SUCCESS:
      return {
        ...state,
        state: FormState.Success,
        users: action.payload.users,
        totalDocs: action.payload.totalDocs,
        lastDoc: action.payload.lastDoc,
      };
    case types.USERS_GET_FAILURE:
      return {
        ...state,
        state: FormState.Failure,
        error: action.payload,
      };
    case types.USERS_SET_SELECTED:
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
        users: state.users.map((x) =>
          x.id === action.payload.id ? { ...x, ...action.payload } : x
        ),
      };
    case types.USERS_REMOVE_DOC:
      return {
        ...state,
        users: state.users.filter((x) => x.id !== action.payload.id),
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
        users: action.payload,
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
        };
    default:
      return state;
  }
};
