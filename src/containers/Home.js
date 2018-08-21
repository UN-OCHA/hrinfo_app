import React  from 'react';
import {Link} from 'react-router-dom';
import { translate, Trans } from 'react-i18next';

class Home extends React.Component {

    render() {
      const { t } = this.props;
      return (
        <div>
          <p>Welcome {this.props.user.name}, you are logged in</p>
          <p>{t('home.what_do')}</p>
          <ul>
            <li><Link to="/documents/new">Add a document</Link></li>
            <li><Link to="/infographics/new">Add a map/infographic</Link></li>
            <li><Link to="/events/new">Add a new event</Link></li>
            <li><Link to="/operations/new">Add a new operation</Link></li>
          </ul>
        </div>
      );
    }
}

export default translate('common')(Home);
