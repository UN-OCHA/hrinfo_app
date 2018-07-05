import React from "react";
import { Switch } from "react-router-dom";
import Login from "./Login";
import DocumentForm from "./DocumentForm";
import EventForm from "./EventForm";
import AssessmentForm from "./AssessmentForm";
import OperationForm from "./OperationForm";
import Home from "./Home";
import Admin from "./Admin";
import ItemPage from "./ItemPage";
import User from "./User";
import OperationPage from "./OperationPage";
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
    <AuthenticatedRoute path="/assessments/new" exact component={AssessmentForm} props={childProps} />
    <AuthenticatedRoute path="/operations/new" exact component={OperationForm} props={childProps} />
    <AuthenticatedRoute path="/operations/:id/edit" exact component={OperationForm} props={childProps} />
    <AuthenticatedRoute path="/operations/:id" exact component={OperationPage} props={childProps} />
    <AuthenticatedRoute path="/users/:id" exact component={User} props={childProps} />
  </Switch>;
