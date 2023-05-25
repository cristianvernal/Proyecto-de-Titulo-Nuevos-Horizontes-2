import { Action } from "../../models/action";
import * as types from "../../constants";
import { FormState } from "../../models/form_state";
import { College } from "../../models/College";
import { Schedule } from "../../models/Schedule";

export interface ScheduleState {
  schedule: Schedule;
  state: FormState;
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
  schedule: {} as Schedule,
  state: FormState.Initial,
  totalDocs: 0,
  delete: {
    state: FormState.Initial,
  },
  edit: {
    state: FormState.Initial,
    selected: null,
  },
  add: {
    state: FormState.Initial,
  },
} as ScheduleState;

export const scheduleReducer = (
  state = initialState,
  action: Action
): ScheduleState => {
  switch (action.type) {
    case types.SCHEDULES_GET_SUBMITING:
      return {
        ...state,
        state: FormState.Submitting,
        error: undefined,
      };
    case types.SCHEDULES_GET_SUCCESS:
      return {
        ...state,
        state: FormState.Success,
        schedule: action.payload,
      };
    case types.SCHEDULES_GET_FAILURE:
      return {
        ...state,
        state: FormState.Failure,
        error: action.payload,
      };
    case types.SCHEDULES_ADD_INITIAL:
      return {
        ...state,
        add: {
          state: FormState.Initial,
        },
      };
    case types.SCHEDULES_ADD_SUBMITING:
      return {
        ...state,
        add: {
          state: FormState.Submitting,
        },
      };
    case types.SCHEDULES_ADD_SUCCESS:
      return {
        ...state,
        add: {
          state: FormState.Success,
        },
      };
    case types.SCHEDULES_ADD_FAILURE:
      return {
        ...state,
        add: {
          state: FormState.Failure,
          error: action.payload,
        },
      };
    case types.SCHEDULES_SET_SELECTED:
      return {
        ...state,
        edit: {
          ...state.edit,
          selected: action.payload,
        },
      };
    case types.SCHEDULES_EDIT_INITIAL:
      return {
        ...state,
        edit: { state: FormState.Initial },
      };
    case types.SCHEDULES_EDIT_SUBMITING:
      return {
        ...state,
        edit: { state: FormState.Submitting },
      };
    case types.SCHEDULES_EDIT_SUCCESS:
      return {
        ...state,
        edit: { state: FormState.Success },
      };
    case types.SCHEDULES_EDIT_FAILURE:
      return {
        ...state,
        edit: { state: FormState.Failure, error: action.payload },
      };
    default:
      return state;
  }
};
