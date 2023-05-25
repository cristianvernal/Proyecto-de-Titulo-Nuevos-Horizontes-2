import * as types from "../../constants";
import { THEMES } from "../../constants";
import { Action } from "../../models/action";

export interface IThemeState {
  currentTheme: string;
}

const initialState = {
  currentTheme: THEMES.BLUE,
} as IThemeState;

export default function reducer(state = initialState, action: Action) {
  switch (action.type) {
    case types.THEME_SET:
      return {
        ...state,
        currentTheme: action.payload,
      };

    default:
      return state;
  }
}
