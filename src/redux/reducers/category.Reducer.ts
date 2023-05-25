import { Action } from "../../models/action";
import * as types from "../../constants";
import { FormState } from "../../models/form_state";

export interface ICategory {
  categorias: any[];
  state: FormState;
  totalDocs: number;
  selectedCategoria?: any;
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
  };
}

const initialState = {
  categorias: [],
  state: FormState.Initial,
  totalDocs: 0,
  selectedCategoria: null,
  edit: {
    state: FormState.Initial,
    isLoading: false,
  },
} as ICategory;

export const categoryReducer = (
  state = initialState,
  action: Action
): ICategory => {
  switch (action.type) {
    case types.CATEGORY_GET_SUBMITING:
      return {
        ...state,
        state: FormState.Submitting,
        error: undefined,
      };
    case types.CATEGORY_GET_SUCCESS:
      return {
        ...state,
        state: FormState.Success,
        categorias: action.payload.categorias,
        totalDocs: action.payload.totalDocs,
        lastDoc: action.payload.lastDoc,
      };
    case types.CATEGORY_GET_FAILURE:
      return {
        ...state,
        state: FormState.Failure,
        error: action.payload,
      };

    case types.CATEGORY_SET_SELECTED:
      return {
        ...state,
        selectedCategoria: action.payload,
      };
    case types.CATEGORY_DELETED_SUBMMITING:
      return {
        ...state,
        delete: {
          state: FormState.Submitting,
          error: undefined,
        },
      };
    case types.CATEGORY_DELETED_SUCCESS:
      return {
        ...state,
        delete: { state: FormState.Success },
        categorias: state.categorias.filter((x) => x.id !== action.payload.id),
      };
    case types.CATEGORY_DELETED_FAILURE:
      return {
        ...state,
        delete: {
          state: FormState.Failure,
          error: action.payload,
        },
      };
      case types.CATEGORY_GET_ONE_SUBMMITING:
        return {
          ...state,
          edit: {
            state: FormState.Submitting,
            error: undefined,
          },
        };
      case types.CATEGORY_GET_ONE_SUCCESS:
        return {
          ...state,
          edit: {
            state: FormState.Success,
          },
          selectedCategoria: action.payload,
        };
      case types.CATEGORY_GET_ONE_FAILURE:
        return {
          ...state,
          edit: {
            state: FormState.Submitting,
            error: action.payload,
          },
        };
        case types.CATEGORY_ADD_ONE_FAILURE:
          return {
            ...state,
            add: {
              state: FormState.Failure,
              error: action.payload,
            },
          };
          case types.CATEGORY_ADD_ONE_SUCCESS:
            return {
              ...state,
              add: {
                state: FormState.Success,
              },
            };
            case types.CATEGORY_ADD_ONE_SUBMMITING:
              return {
                ...state,
                add: {
                  state: FormState.Submitting,
                  error: undefined,
                },
              };
              case types.CATEGORY_UPDATE_ONE_SUBMMITING:
                return {
                  ...state,
                  edit: { state: FormState.Submitting },
                };
              case types.CATEGORY_UPDATE_ONE_SUCCESS:
                return {
                  ...state,
                  edit: { state: FormState.Success },
                };
              case types.CATEGORY_UPDATE_ONE_FAILURE:
                return {
                  ...state,
                  edit: { state: FormState.Failure, error: action.payload },
                };
    default:
      return state;
  }
};
