import React from 'react';
import {Link} from 'react-router-dom';
import { translate } from 'react-i18next';

class Admin extends React.Component {

  render() {
    const { t } = this.props;
    const isAdmin = this.props.user.hrinfo.roles.indexOf('administrator') === -1 ? false : true;
    const adminLinks = isAdmin ? <div>
      <li><Link to="/operations/new">Add a new operation</Link></li>
      <li><Link to="/groups/new">Add a new cluster</Link></li>
      <li><Link to="/organizations/new">Add a new organization</Link></li>
    </div> : '';
    return (
      <div>
        <p>{t('home.what_do')}</p>
        <ul>
          <li><Link to="/documents/new">Add a document</Link></li>
          <li><Link to="/infographics/new">Add a map/infographic</Link></li>
          <li><Link to="/events/new">Add a new event</Link></li>
          <li><Link to="/assessments/new">Add a new assessment</Link></li>
          <li><Link to="/offices/new">Add a new office</Link></li>
          {adminLinks}
        </ul>
      </div>
    );
  }
}

export default translate('common')(Admin);
