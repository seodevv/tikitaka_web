import "./index.css";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./app/store";

const start = () => {
  ReactDOM.render(
    <>
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    </>,
    document.querySelector("#root")
  );
};

start();
