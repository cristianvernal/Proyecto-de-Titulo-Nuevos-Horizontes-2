import * as types from "../../constants";

export interface IAuthState {
  user?: {
    id?: string;
    email?: string;
    name?: string;
    image?: string;
    token?: string;
    activo?: boolean;
    tipoUsuario?: string;
  };
}

const initialState = {} as IAuthState;

export default function reducer(state = initialState, actions: any) {
  switch (actions.type) {
    case types.AUTH_SIGN_IN_SUCCESS:
      return {
        ...state,
        user: {
          ...actions,
        },
      };

    case types.AUTH_SIGN_OUT:
      return {
        ...state,
        user: undefined,
      };

    default:
      return state;
  }
}
