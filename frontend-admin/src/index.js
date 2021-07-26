/*!

=========================================================
* Material Dashboard React - v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

// core components
import Admin from "layouts/Admin.js";
import Login from 'layouts/Login.js'
import { Provider } from "react-redux";
import store from "./store";

import {  CssBaseline } from "@material-ui/core";

import "assets/css/material-dashboard-react.css?v=1.9.0";

import PublicRoute from './components/PublicRoute'
import PrivateRoute from './components/PrivateRoute'

const hist = createBrowserHistory();

ReactDOM.render(
  <Provider store={store}>
  <Router history={hist}>
    <Switch>
      <PrivateRoute path="/admin" component={Admin} />
      <PublicRoute exact path="/login" component={Login} />
      <Redirect from="/" to="/admin/dashboard" />
    </Switch>
  </Router>
  <CssBaseline/>
  </Provider>,
  document.getElementById("root")
);
