import * as types from "../../constants";

export function setTheme(value: any) {
  return {
    type: types.THEME_SET,
    payload: value,
  };
}
