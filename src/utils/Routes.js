import React from "react";
import { Switch } from "react-router-dom";
import Login from "../containers/Login";
import DocumentForm from "../containers/DocumentForm";
import EventForm from "../containers/EventForm";
import AssessmentForm from "../containers/AssessmentForm";
import OperationForm from "../containers/OperationForm";
import Home from "../containers/Home";
import Admin from "../containers/Admin";
import ItemPage from "../containers/ItemPage";
import User from "../containers/User";
import OperationPage from "../containers/OperationPage";
import AuthenticatedRoute from "./AuthenticatedRoute";
import UnauthenticatedRoute from "./UnauthenticatedRoute";
import withForm from './withForm';

export default ({ childProps }) =>
  <Switch>
    <UnauthenticatedRoute path="/" exact component={Login} props={childProps} />
    <AuthenticatedRoute path="/documents/new" exact component={withForm(DocumentForm, 'documents', 'Document')} props={childProps} />
    <AuthenticatedRoute path="/documents/:id" exact component={ItemPage} props={childProps} />
    <AuthenticatedRoute path="/documents/:id/edit" exact component={withForm(DocumentForm, 'documents', 'Document')} props={childProps} />
    <AuthenticatedRoute path="/home" exact component={Home} props={childProps} />
    <AuthenticatedRoute path="/admin" exact component={Admin} props={childProps} />
    <AuthenticatedRoute path="/infographics/new" exact component={withForm(DocumentForm, 'infographics', 'Infographic')} props={childProps} />
    <AuthenticatedRoute path="/infographics/:id" exact component={ItemPage} props={childProps} />
    <AuthenticatedRoute path="/infographics/:id/edit" exact component={withForm(DocumentForm, 'infographics', 'Infographic')} props={childProps} />
    <AuthenticatedRoute path="/events/new" exact component={withForm(EventForm, 'events', 'Event')} props={childProps} />
    <AuthenticatedRoute path="/events/:id" exact component={ItemPage} props={childProps} />
    <AuthenticatedRoute path="/events/:id/edit" exact component={withForm(EventForm, 'events', 'Event')} props={childProps} />
    <AuthenticatedRoute path="/assessments/new" exact component={AssessmentForm} props={childProps} />
    <AuthenticatedRoute path="/operations/new" exact component={withForm(OperationForm, 'operations', 'Operation')} props={childProps} />
    <AuthenticatedRoute path="/operations/:id/edit" exact component={withForm(OperationForm, 'operations', 'Operation')} props={childProps} />
    <AuthenticatedRoute path="/operations/:id" exact component={OperationPage} props={childProps} />
    <AuthenticatedRoute path="/users/:id" exact component={User} props={childProps} />
  </Switch>;
