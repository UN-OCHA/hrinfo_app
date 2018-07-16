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
import SpacePage from "../containers/SpacePage";
import GroupsPage from '../containers/GroupsPage';
import ContactsPage from '../containers/ContactsPage';
import OfficesPage from '../containers/OfficesPage';
import DocumentsPage from '../containers/DocumentsPage';
import InfographicsPage from '../containers/InfographicsPage';
import DisastersPage from '../containers/DisastersPage';
import AuthenticatedRoute from "./AuthenticatedRoute";
import UnauthenticatedRoute from "./UnauthenticatedRoute";
import withForm from './withForm';
import withSpace from './withSpace';

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
    <AuthenticatedRoute path="/operations/:id" exact component={SpacePage} props={childProps} />
    <AuthenticatedRoute path="/operations/:id/groups" exact component={GroupsPage} props={childProps} />
    <AuthenticatedRoute path="/operations/:id/documents" exact component={DocumentsPage} props={childProps} />
    <AuthenticatedRoute path="/operations/:id/infographics" exact component={InfographicsPage} props={childProps} />
    <AuthenticatedRoute path="/operations/:id/contacts" exact component={ContactsPage} props={childProps} />
    <AuthenticatedRoute path="/operations/:id/offices" exact component={OfficesPage} props={childProps} />
    <AuthenticatedRoute path="/operations/:id/disasters" exact component={DisastersPage} props={childProps} />

    <AuthenticatedRoute path="/groups/:id" exact component={SpacePage} props={childProps} />
    <AuthenticatedRoute path="/groups/:id/contacts" exact component={ContactsPage} props={childProps} />
    <AuthenticatedRoute path="/groups/:id/documents" exact component={DocumentsPage} props={childProps} />
    <AuthenticatedRoute path="/groups/:id/infographics" exact component={InfographicsPage} props={childProps} />

    <AuthenticatedRoute path="/offices/:id" exact component={SpacePage} props={childProps} />
    <AuthenticatedRoute path="/offices/:id/contacts" exact component={ContactsPage} props={childProps} />
    <AuthenticatedRoute path="/offices/:id/documents" exact component={DocumentsPage} props={childProps} />
    <AuthenticatedRoute path="/offices/:id/infographics" exact component={InfographicsPage} props={childProps} />

    <AuthenticatedRoute path="/organizations/:id" exact component={SpacePage} props={childProps} />
    <AuthenticatedRoute path="/organizations/:id/contacts" exact component={ContactsPage} props={childProps} />
    <AuthenticatedRoute path="/organizations/:id/documents" exact component={DocumentsPage} props={childProps} />
    <AuthenticatedRoute path="/organizations/:id/infographics" exact component={InfographicsPage} props={childProps} />

    <AuthenticatedRoute path="/disasters/:id" exact component={SpacePage} props={childProps} />
    <AuthenticatedRoute path="/disasters/:id/contacts" exact component={ContactsPage} props={childProps} />
    <AuthenticatedRoute path="/disasters/:id/documents" exact component={DocumentsPage} props={childProps} />
    <AuthenticatedRoute path="/disasters/:id/infographics" exact component={InfographicsPage} props={childProps} />

    <AuthenticatedRoute path="/users/:id" exact component={User} props={childProps} />
  </Switch>;