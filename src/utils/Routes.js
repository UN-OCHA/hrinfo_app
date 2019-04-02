import React from "react";
import { Switch } from "react-router-dom";

import Login                from "../containers/Login";
import DocumentForm         from "../containers/DocumentForm";
import EventForm            from '../containers/EventForm';
import AssessmentForm       from "../containers/AssessmentForm";
import AssessmentsPage      from "../containers/AssessmentsPage";
import OperationForm        from "../containers/OperationForm";
import ClusterForm          from "../containers/ClusterForm";
import Home                 from "../containers/Home";
import Admin                from "../containers/Admin";
import ItemPage             from "../containers/ItemPage";
import User                 from "../containers/User";
import SpacePage            from "../containers/SpacePage";
import GroupsPage           from '../containers/GroupsPage';
import ContactsPage         from '../containers/ContactsPage';
import OfficesPage          from '../containers/OfficesPage';
import OfficesForm          from '../containers/OfficesForm';
import DocumentsPage        from '../containers/DocumentsPage';
import InfographicsPage     from '../containers/InfographicsPage';
import DisastersPage        from '../containers/DisastersPage';
import EventsPage           from '../containers/EventsPage';
import DatasetsPage         from '../containers/DatasetsPage';
import SpaceManagePage      from '../containers/SpaceManagePage';
import SpaceManagePeople    from '../containers/SpaceManagePeople';
import SearchPage           from '../containers/SearchPage';
import ContributionsPage    from '../containers/ContributionsPage';
import ContributorsPage     from '../containers/ContributorsPage';
import OrganizationForm     from '../containers/OrganizationForm';

import AuthenticatedRoute   from "./AuthenticatedRoute";
import UnauthenticatedRoute from "./UnauthenticatedRoute";
import withForm             from './withForm';

export default ({ childProps }) =>
  <Switch>
    <UnauthenticatedRoute path="/" exact component={Home} props={childProps} />

{/* General */}
    <AuthenticatedRoute path="/admin"                    exact component={Admin}             props={childProps} />
    <AuthenticatedRoute path="/admin/contributions"      exact component={ContributionsPage} props={childProps}  />
    <AuthenticatedRoute path="/admin/contributors"       exact component={ContributorsPage}  props={childProps}  />
    <AuthenticatedRoute path="/users/:id"                exact component={User}              props={childProps} />
    <UnauthenticatedRoute path="/search/:q"              exact component={SearchPage}        props={childProps} />
    <UnauthenticatedRoute path="/login" exact component={Login} props={childProps} />

{/* Documents */}
    <AuthenticatedRoute path="/documents/new"      exact component={withForm(DocumentForm, 'documents', 'document')} props={childProps} />
    <UnauthenticatedRoute path="/documents/:id"      exact component={ItemPage}                                        props={childProps} />
    <AuthenticatedRoute path="/documents/:id/edit" exact component={withForm(DocumentForm, 'documents', 'document')} props={childProps} />
    <AuthenticatedRoute path="/documents/:id/clone" exact component={withForm(DocumentForm, 'documents', 'document', true)} props={childProps} />

{/* Infographics */}
    <AuthenticatedRoute path="/infographics/new"      exact component={withForm(DocumentForm, 'infographics', 'infographic')} props={childProps} />
    <AuthenticatedRoute path="/infographics/:id/edit" exact component={withForm(DocumentForm, 'infographics', 'infographic')} props={childProps} />
    <AuthenticatedRoute path="/infographics/:id/clone" exact component={withForm(DocumentForm, 'infographics', 'infographic', true)} props={childProps} />
    <UnauthenticatedRoute path="/infographics/:id"      exact component={ItemPage}                                              props={childProps} />

{/* Events */}
    <AuthenticatedRoute path="/events/new"      exact component={withForm(EventForm, 'events', 'event')}  props={childProps} />
    <AuthenticatedRoute path="/events/:id/edit" exact component={withForm(EventForm, 'events', 'event')}  props={childProps} />
    <AuthenticatedRoute path="/events/:id/clone" exact component={withForm(EventForm, 'events', 'event', true)}  props={childProps} />
    <UnauthenticatedRoute path="/events/:id"      exact component={ItemPage}                                props={childProps} />

{/* Assessments */}
    <AuthenticatedRoute path="/assessments/new"          exact component={withForm(AssessmentForm, 'assessments', 'assessment')}    props={childProps} />
    <AuthenticatedRoute path="/assessments/:id/edit"     exact component={withForm(AssessmentForm, 'assessments', 'assessment')}    props={childProps} />
    <AuthenticatedRoute path="/assessments/:id/clone"     exact component={withForm(AssessmentForm, 'assessments', 'assessment', true)}    props={childProps} />
    <UnauthenticatedRoute path="/assessments/:id"          exact component={ItemPage}                                props={childProps} />

{/* Operations */}
    <AuthenticatedRoute path="/operations/new"              exact component={withForm(OperationForm, 'operations', 'Operation')} props={childProps} />
    <AuthenticatedRoute path="/operations/:id/edit"         exact component={withForm(OperationForm, 'operations', 'Operation')} props={childProps} />
    <UnauthenticatedRoute path="/operations/:id"              exact component={SpacePage}                                          props={childProps} />
    <AuthenticatedRoute path="/operations/:id/manage"       exact component={SpaceManagePage}                                    props={childProps} />
    <AuthenticatedRoute path="/operations/:id/manage/people"exact component={SpaceManagePeople}                                  props={childProps} />
    <UnauthenticatedRoute path="/operations/:id/groups"       exact component={GroupsPage}                                         props={childProps} />
    <UnauthenticatedRoute path="/operations/:id/documents"    exact component={DocumentsPage}                                      props={childProps} />
    <UnauthenticatedRoute path="/operations/:id/infographics" exact component={InfographicsPage}                                   props={childProps} />
    <UnauthenticatedRoute path="/operations/:id/events"       exact component={EventsPage}                                         props={childProps} />
    <AuthenticatedRoute path="/operations/:id/contacts"     exact component={ContactsPage}                                       props={childProps} />
    <UnauthenticatedRoute path="/operations/:id/offices"      exact component={OfficesPage}                                        props={childProps} />
    <UnauthenticatedRoute path="/operations/:id/disasters"    exact component={DisastersPage}                                      props={childProps} />
    <UnauthenticatedRoute path="/operations/:id/datasets"     exact component={DatasetsPage}                                       props={childProps} />
    <UnauthenticatedRoute path="/operations/:id/assessments"  exact component={AssessmentsPage}                                    props={childProps} />

{/* Spaces */}
    <UnauthenticatedRoute path="/spaces/:id"                  exact component={SpacePage}                                          props={childProps} />
    <AuthenticatedRoute path="/spaces/:id/manage"           exact component={SpaceManagePage}                                    props={childProps} />
    <AuthenticatedRoute path="/spaces/:id/manage/people"    exact component={SpaceManagePeople}                                  props={childProps} />
    <UnauthenticatedRoute path="/spaces/:id/documents"        exact component={DocumentsPage}                                      props={childProps} />
    <UnauthenticatedRoute path="/spaces/:id/infographics"     exact component={InfographicsPage}                                   props={childProps} />
    <UnauthenticatedRoute path="/spaces/:id/events"           exact component={EventsPage}                                         props={childProps} />

{/* Groups */}
    <AuthenticatedRoute path="/groups/new"       exact component={withForm(ClusterForm, 'bundles', 'Cluster')}  props={childProps} />
    <AuthenticatedRoute path="/groups/:id/edit"  exact component={withForm(ClusterForm, 'bundles', 'Cluster')}  props={childProps} />
    <UnauthenticatedRoute path="/groups/:id"              exact component={SpacePage}         props={childProps} />
    <AuthenticatedRoute path="/groups/:id/manage"       exact component={SpaceManagePage}   props={childProps} />
    <AuthenticatedRoute path="/groups/:id/manage/people"exact component={SpaceManagePeople} props={childProps} />
    <AuthenticatedRoute path="/groups/:id/contacts"     exact component={ContactsPage}      props={childProps} />
    <UnauthenticatedRoute path="/groups/:id/documents"    exact component={DocumentsPage}     props={childProps} />
    <UnauthenticatedRoute path="/groups/:id/infographics" exact component={InfographicsPage}  props={childProps} />
    <UnauthenticatedRoute path="/groups/:id/events"       exact component={EventsPage}        props={childProps} />
    <UnauthenticatedRoute path="/groups/:id/assessments"  exact component={AssessmentsPage}   props={childProps} />

{/* Offices */}
    <AuthenticatedRoute path="/offices/new"              exact component={withForm(OfficesForm, 'offices', 'Offices')}        props={childProps} />
    <AuthenticatedRoute path="/offices/:id/edit"         exact component={withForm(OfficesForm, 'offices', 'Offices')}        props={childProps} />
    <UnauthenticatedRoute path="/offices/:id"              exact component={SpacePage}          props={childProps} />
    <UnauthenticatedRoute path="/offices/:id/events"       exact component={EventsPage}         props={childProps} />
    <AuthenticatedRoute path="/offices/:id/contacts"     exact component={ContactsPage}       props={childProps} />
    <UnauthenticatedRoute path="/offices/:id/documents"    exact component={DocumentsPage}      props={childProps} />
    <UnauthenticatedRoute path="/offices/:id/infographics" exact component={InfographicsPage}   props={childProps} />
    <UnauthenticatedRoute path="/offices/:id/events"       exact component={EventsPage}         props={childProps} />

{/* Organizations */}
    <AuthenticatedRoute path="/organizations/new"              exact component={withForm(OrganizationForm, 'organizations', 'Organization')}  props={childProps} />
    <AuthenticatedRoute path="/organizations/:id/edit"         exact component={withForm(OrganizationForm, 'organizations', 'Organization')}  props={childProps} />
    <UnauthenticatedRoute path="/organizations/:id"              exact component={SpacePage}                                                    props={childProps} />
    <AuthenticatedRoute path="/organizations/:id/contacts"     exact component={ContactsPage}                                                 props={childProps} />
    <UnauthenticatedRoute path="/organizations/:id/documents"    exact component={DocumentsPage}                                                props={childProps} />
    <UnauthenticatedRoute path="/organizations/:id/infographics" exact component={InfographicsPage}                                             props={childProps} />
    <UnauthenticatedRoute path="/organizations/:id/events"       exact component={EventsPage}                                                   props={childProps} />
    <UnauthenticatedRoute path="/organizations/:id/assessments"  exact component={AssessmentsPage}                                              props={childProps} />

{/* Disaster */}
    <UnauthenticatedRoute path="/disasters/:id"              exact component={SpacePage}        props={childProps} />
    <AuthenticatedRoute path="/disasters/:id/contacts"     exact component={ContactsPage}     props={childProps} />
    <UnauthenticatedRoute path="/disasters/:id/documents"    exact component={DocumentsPage}    props={childProps} />
    <UnauthenticatedRoute path="/disasters/:id/infographics" exact component={InfographicsPage} props={childProps} />
    <UnauthenticatedRoute path="/disasters/:id/assessments"  exact component={AssessmentsPage}  props={childProps} />

{/* Locations */}
    <UnauthenticatedRoute path="/locations/:id"              exact component={SpacePage}        props={childProps} />
    <UnauthenticatedRoute path="/locations/:id/documents"    exact component={DocumentsPage}    props={childProps} />
    <UnauthenticatedRoute path="/locations/:id/infographics" exact component={InfographicsPage} props={childProps} />
    <UnauthenticatedRoute path="/locations/:id/events"       exact component={EventsPage}       props={childProps} />
    <UnauthenticatedRoute path="/locations/:id/assessments"  exact component={AssessmentsPage}  props={childProps} />

{/* Users */}
  </Switch>;
