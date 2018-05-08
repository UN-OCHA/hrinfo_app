import React from "react";
import { Switch } from "react-router-dom";
import Login from "./Login";
import DocumentForm from "./DocumentForm";
import Home from "./Home";
import AuthenticatedRoute from "./AuthenticatedRoute";
import UnauthenticatedRoute from "./UnauthenticatedRoute";

export default ({ childProps }) =>
  <Switch>
    <UnauthenticatedRoute exact path="/" component={Login} props={childProps} />
    <AuthenticatedRoute path="/home" component={Home} props={childProps} />
    <AuthenticatedRoute path="/document/new" component={DocumentForm} props={childProps} />
  </Switch>;
