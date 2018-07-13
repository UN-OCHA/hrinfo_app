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
import {OperationPage, GroupPage} from "./OperationPage";
import GroupsPage from './GroupsPage';
import ContactsPage from './ContactsPage';
import OfficesPage from './OfficesPage';
import DocumentsPage from './DocumentsPage';
import InfographicsPage from './InfographicsPage';
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
    <AuthenticatedRoute path="/operations/:id" exact component={OperationPage} props={childProps} />
    <AuthenticatedRoute path="/groups/:id" exact component={GroupPage} props={childProps} />
    <AuthenticatedRoute path="/operations/:id/groups" exact component={GroupsPage} props={childProps} />
    <AuthenticatedRoute path="/operations/:id/documents" exact component={DocumentsPage} props={childProps} />
    <AuthenticatedRoute path="/operations/:id/infographics" exact component={InfographicsPage} props={childProps} />
    <AuthenticatedRoute path="/operations/:id/contacts" exact component={ContactsPage} props={childProps} />
    <AuthenticatedRoute path="/operations/:id/offices" exact component={OfficesPage} props={childProps} />
    <AuthenticatedRoute path="/groups/:id/contacts" exact component={ContactsPage} props={childProps} />
    <AuthenticatedRoute path="/groups/:id/documents" exact component={DocumentsPage} props={childProps} />
    <AuthenticatedRoute path="/groups/:id/infographics" exact component={InfographicsPage} props={childProps} />
    <AuthenticatedRoute path="/users/:id" exact component={User} props={childProps} />
  </Switch>;
