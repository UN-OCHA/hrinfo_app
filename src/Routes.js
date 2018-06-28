import React from "react";
import { Switch } from "react-router-dom";
import Login from "./Login";
import DocumentForm from "./DocumentForm";
import EventForm from "./EventForm";
import Home from "./Home";
import Admin from "./Admin";
import ItemPage from "./ItemPage";
import User from "./User";
import AuthenticatedRoute from "./AuthenticatedRoute";
import UnauthenticatedRoute from "./UnauthenticatedRoute";

export default ({ childProps }) =>
  <Switch>
    <UnauthenticatedRoute path="/" exact component={Login} props={childProps} />
    <AuthenticatedRoute path="/documents/new" exact component={DocumentForm} props={childProps} />
    <AuthenticatedRoute path="/documents/:id" exact component={ItemPage} props={childProps} />
    <AuthenticatedRoute path="/documents/:id/edit" exact component={DocumentForm} props={childProps} />
    <AuthenticatedRoute path="/home" exact component={Home} props={childProps} />
    <AuthenticatedRoute path="/admin" exact component={Admin} props={childProps} />
    <AuthenticatedRoute path="/infographics/new" exact component={DocumentForm} props={childProps} />
    <AuthenticatedRoute path="/infographics/:id" exact component={ItemPage} props={childProps} />
    <AuthenticatedRoute path="/infographics/:id/edit" exact component={DocumentForm} props={childProps} />
    <AuthenticatedRoute path="/events/new" exact component={EventForm} props={childProps} />
    <AuthenticatedRoute path="/events/:id" exact component={ItemPage} props={childProps} />
    <AuthenticatedRoute path="/events/:id/edit" exact component={EventForm} props={childProps} />
    <AuthenticatedRoute path="/users/:id" exact component={User} props={childProps} />
  </Switch>;
