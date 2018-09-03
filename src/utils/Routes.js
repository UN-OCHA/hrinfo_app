import React from "react";
import { Switch } from "react-router-dom";

import Login                from "../containers/Login";
import DocumentForm         from "../containers/DocumentForm";
import EventForm            from '../containers/EventForm';
import AssessmentForm       from "../containers/AssessmentForm";
import AssessmentsPage      from "../containers/AssessmentsPage";
import OperationForm        from "../containers/OperationForm";
import Home                 from "../containers/Home";
import Admin                from "../containers/Admin";
import ItemPage             from "../containers/ItemPage";
import User                 from "../containers/User";
import SpacePage            from "../containers/SpacePage";
import GroupsPage           from '../containers/GroupsPage';
import ContactsPage         from '../containers/ContactsPage';
import OfficesPage          from '../containers/OfficesPage';
import DocumentsPage        from '../containers/DocumentsPage';
import InfographicsPage     from '../containers/InfographicsPage';
import DisastersPage        from '../containers/DisastersPage';
import EventsPage           from '../containers/EventsPage';
import DatasetsPage         from '../containers/DatasetsPage';
import SpaceManagePage      from '../containers/SpaceManagePage';
import SpaceManagePeople    from '../containers/SpaceManagePeople';
import SearchPage           from '../containers/SearchPage';

import AuthenticatedRoute   from "./AuthenticatedRoute";
import UnauthenticatedRoute from "./UnauthenticatedRoute";
import withForm             from './withForm';

export default ({ childProps }) =>
  <Switch>
    <UnauthenticatedRoute path="/" exact component={Login} props={childProps} />

{/* General */}
    <AuthenticatedRoute path="/assessments/new" exact component={AssessmentForm} props={childProps} />
    <AuthenticatedRoute path="/home"            exact component={Home}           props={childProps} />
    <AuthenticatedRoute path="/admin"           exact component={Admin}          props={childProps} />
    <AuthenticatedRoute path="/users/:id"       exact component={User}           props={childProps} />
    <AuthenticatedRoute path="/search/:q"       exact component={SearchPage}     props={childProps} />

{/* Documents */}
    <AuthenticatedRoute path="/documents/new"      exact component={withForm(DocumentForm, 'documents', 'document')} props={childProps} />
    <AuthenticatedRoute path="/documents/:id"      exact component={ItemPage}                                        props={childProps} />
    <AuthenticatedRoute path="/documents/:id/edit" exact component={withForm(DocumentForm, 'documents', 'document')} props={childProps} />

{/* Infographics */}
    <AuthenticatedRoute path="/infographics/new"      exact component={withForm(DocumentForm, 'infographics', 'infographic')} props={childProps} />
    <AuthenticatedRoute path="/infographics/:id/edit" exact component={withForm(DocumentForm, 'infographics', 'infographic')} props={childProps} />
    <AuthenticatedRoute path="/infographics/:id"      exact component={ItemPage}                                              props={childProps} />

{/* Events */}
    <AuthenticatedRoute path="/events/new"      exact component={withForm(EventForm, 'events', 'event')}  props={childProps} />
    <AuthenticatedRoute path="/events/:id/edit" exact component={withForm(EventForm, 'events', 'event')}  props={childProps} />
    <AuthenticatedRoute path="/events/:id"      exact component={ItemPage}                                props={childProps} />

{/* Operations */}
    <AuthenticatedRoute path="/operations/new"              exact component={withForm(OperationForm, 'operations', 'Operation')} props={childProps} />
    <AuthenticatedRoute path="/operations/:id/edit"         exact component={withForm(OperationForm, 'operations', 'Operation')} props={childProps} />
    <AuthenticatedRoute path="/operations/:id"              exact component={SpacePage}                                          props={childProps} />
    <AuthenticatedRoute path="/operations/:id/manage"       exact component={SpaceManagePage}                                    props={childProps} />
    <AuthenticatedRoute path="/operations/:id/manage/people"exact component={SpaceManagePeople}                                  props={childProps} />
    <AuthenticatedRoute path="/operations/:id/groups"       exact component={GroupsPage}                                         props={childProps} />
    <AuthenticatedRoute path="/operations/:id/documents"    exact component={DocumentsPage}                                      props={childProps} />
    <AuthenticatedRoute path="/operations/:id/infographics" exact component={InfographicsPage}                                   props={childProps} />
    <AuthenticatedRoute path="/operations/:id/events"       exact component={EventsPage}                                         props={childProps} />
    <AuthenticatedRoute path="/operations/:id/contacts"     exact component={ContactsPage}                                       props={childProps} />
    <AuthenticatedRoute path="/operations/:id/offices"      exact component={OfficesPage}                                        props={childProps} />
    <AuthenticatedRoute path="/operations/:id/disasters"    exact component={DisastersPage}                                      props={childProps} />
    <AuthenticatedRoute path="/operations/:id/datasets"     exact component={DatasetsPage}                                       props={childProps} />
    <AuthenticatedRoute path="/operations/:id/assessments"  exact component={AssessmentsPage}                                    props={childProps} />

{/* Spaces */}
    <AuthenticatedRoute path="/spaces/:id"                  exact component={SpacePage}                                          props={childProps} />
    <AuthenticatedRoute path="/spaces/:id/manage"           exact component={SpaceManagePage}                                    props={childProps} />
    <AuthenticatedRoute path="/spaces/:id/manage/people"    exact component={SpaceManagePeople}                                  props={childProps} />
    <AuthenticatedRoute path="/spaces/:id/documents"        exact component={DocumentsPage}                                      props={childProps} />
    <AuthenticatedRoute path="/spaces/:id/infographics"     exact component={InfographicsPage}                                   props={childProps} />
    <AuthenticatedRoute path="/spaces/:id/events"           exact component={EventsPage}                                         props={childProps} />

{/* Groups */}
    <AuthenticatedRoute path="/groups/:id"              exact component={SpacePage}         props={childProps} />
    <AuthenticatedRoute path="/groups/:id/manage"       exact component={SpaceManagePage}   props={childProps} />
    <AuthenticatedRoute path="/groups/:id/manage/people"exact component={SpaceManagePeople} props={childProps} />
    <AuthenticatedRoute path="/groups/:id/contacts"     exact component={ContactsPage}      props={childProps} />
    <AuthenticatedRoute path="/groups/:id/documents"    exact component={DocumentsPage}     props={childProps} />
    <AuthenticatedRoute path="/groups/:id/infographics" exact component={InfographicsPage}  props={childProps} />
    <AuthenticatedRoute path="/groups/:id/events"       exact component={EventsPage}        props={childProps} />
    <AuthenticatedRoute path="/groups/:id/assessments"  exact component={AssessmentsPage}   props={childProps} />

{/* Offices */}
    <AuthenticatedRoute path="/offices/:id"              exact component={SpacePage}          props={childProps} />
    <AuthenticatedRoute path="/offices/:id/contacts"     exact component={ContactsPage}       props={childProps} />
    <AuthenticatedRoute path="/offices/:id/documents"    exact component={DocumentsPage}      props={childProps} />
    <AuthenticatedRoute path="/offices/:id/infographics" exact component={InfographicsPage}   props={childProps} />
    <AuthenticatedRoute path="/offices/:id/events"       exact component={EventsPage}         props={childProps} />

{/* Organizations */}
    <AuthenticatedRoute path="/organizations/:id"              exact component={SpacePage}        props={childProps} />
    <AuthenticatedRoute path="/organizations/:id/contacts"     exact component={ContactsPage}     props={childProps} />
    <AuthenticatedRoute path="/organizations/:id/documents"    exact component={DocumentsPage}    props={childProps} />
    <AuthenticatedRoute path="/organizations/:id/infographics" exact component={InfographicsPage} props={childProps} />
    <AuthenticatedRoute path="/organizations/:id/events"       exact component={EventsPage}       props={childProps} />
    <AuthenticatedRoute path="/organizations/:id/assessments"  exact component={AssessmentsPage}  props={childProps} />

{/* Disaster */}
    <AuthenticatedRoute path="/disasters/:id"              exact component={SpacePage}        props={childProps} />
    <AuthenticatedRoute path="/disasters/:id/contacts"     exact component={ContactsPage}     props={childProps} />
    <AuthenticatedRoute path="/disasters/:id/documents"    exact component={DocumentsPage}    props={childProps} />
    <AuthenticatedRoute path="/disasters/:id/infographics" exact component={InfographicsPage} props={childProps} />
    <AuthenticatedRoute path="/disasters/:id/assessments"  exact component={AssessmentsPage}  props={childProps} />

{/* Locations */}
    <AuthenticatedRoute path="/locations/:id"              exact component={SpacePage}        props={childProps} />
    <AuthenticatedRoute path="/locations/:id/documents"    exact component={DocumentsPage}    props={childProps} />
    <AuthenticatedRoute path="/locations/:id/infographics" exact component={InfographicsPage} props={childProps} />
    <AuthenticatedRoute path="/locations/:id/events"       exact component={EventsPage}       props={childProps} />
    <AuthenticatedRoute path="/locations/:id/assessments"  exact component={AssessmentsPage}  props={childProps} />

{/* Users */}
  </Switch>;
