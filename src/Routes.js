import React from "react";
import { Switch } from "react-router-dom";
import Login from "./Login";
import DocumentForm from "./DocumentForm";
import InfographicForm from "./InfographicForm";
import Home from "./Home";
import Admin from "./Admin";
import Document from "./Document";
import AuthenticatedRoute from "./AuthenticatedRoute";
import UnauthenticatedRoute from "./UnauthenticatedRoute";

export default ({ childProps }) =>
  <Switch>
    <UnauthenticatedRoute path="/" exact component={Login} props={childProps} />
    <AuthenticatedRoute path="/documents/new" exact component={DocumentForm} props={childProps} />
    <AuthenticatedRoute path="/documents/:id" exact component={Document} props={childProps} />
    <AuthenticatedRoute path="/documents/:id/edit" exact component={DocumentForm} props={childProps} />
    <AuthenticatedRoute path="/home" exact component={Home} props={childProps} />
    <AuthenticatedRoute path="/admin" exact component={Admin} props={childProps} />
    <AuthenticatedRoute path="/infographics/new" exact component={InfographicForm} props={childProps} />
  </Switch>;
