import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";

import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";

import { Provider } from "react-redux";
import store from "./redux/store/index";
import "./mocks";
import "./firebase/firebase";
import "bootstrap/dist/css/bootstrap.min.css"

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
