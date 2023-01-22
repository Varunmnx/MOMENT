import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import authSlice from "./store/auth";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Routessuperset from "./Navigation/router";            //Navigation wrapped with routes


const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
    <Router>
      <Provider store={store}>
        <Routessuperset />
      </Provider>
    </Router>
);
