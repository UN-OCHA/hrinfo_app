import React  from 'react';
import {Link} from 'react-router-dom';
import { translate, Trans } from 'react-i18next';

class Home extends React.Component {

    render() {
      const { t } = this.props;
      const name = this.props.user.name;
      return (
        <div>
          <p><Trans i18nKey='home.welcome' name={name}>Welcome {{name}}, you are logged in</Trans></p>
          <p>{t('home.what_do')}</p>
          <div>
            <ul>
              <li><Link to="/documents/new">Add a document</Link></li>
              <li><Link to="/infographics/new">Add a map/infographic</Link></li>
              <li><Link to="/events/new">Add a new event</Link></li>
              <li><Link to="/operations/new">Add a new operation</Link></li>
              <li><Link to="/groups/new">Add a new cluster</Link></li>
              <li><Link to="/organizations/new">Add a new organization</Link></li>
              <li><Link to="/assessments/new">Add a new assessment</Link></li>
              <li><Link to="/offices/new">Add a new office</Link></li>
            </ul>
          </div>
          <div>
            <ul>
              <li><Link to="/documents/170942">See a document</Link></li>
              <li><Link to="/infographics/170943">See a map/infographic</Link></li>
              <li><Link to="/events/21873">See a new event</Link></li>
              <li><Link to="/operations/109020">See a new operation</Link></li>
              <li><Link to="/groups/145994">See a new cluster</Link></li>
              <li><Link to="/organizations/63200">See a new organization</Link></li>
              <li><Link to="/assessments/129257">See a new assessment</Link></li>
              <li><Link to="/offices/22256">See a new office</Link></li>
            </ul>
          </div>
        </div>
      );
    }
}

export default translate('common')(Home);
