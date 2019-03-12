import React from 'react';
import {Link} from "react-router-dom";
import PropTypes from 'prop-types';
import Breadcrumbs from '@material-ui/lab/Breadcrumbs';
import Toolbar from '@material-ui/core/Toolbar';

class HRBreadcrumb extends React.Component {

  state = {
    breadcrumb: []
  };

  getBreadcrumb = () => {
    const {item, contentType} = this.props;
    let breadcrumb = [];
    if ((item.type === 'group' || item.type === 'office') && item.operation) {
      breadcrumb.push({
        href: '/operations/' + item.operation[0].id,
        label: item.operation[0].label
      });
    }
    breadcrumb.push({
      href: '/' + item.type + 's/' + item.id,
      label: item.label
    });
    if (contentType) {
      let cType = contentType.slug;
      if (cType === 'users') {
        cType = 'contacts';
      }
      breadcrumb.push({
        href: '/' + item.type + 's/' + item.id + '/' + cType,
        label: contentType.label
      });
    }
    return breadcrumb;
  };

  componentDidMount () {
    const breadcrumb = this.getBreadcrumb();
    this.setState({breadcrumb});
  }

  componentDidUpdate () {
    this.componentDidMount();
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (JSON.stringify(nextProps) !== JSON.stringify(this.props) || JSON.stringify(nextState) !== JSON.stringify(this.state)) {
      return true;
    }
    return false;
  }

  render () {
    let list = '';
    list = this.state.breadcrumb.map(function (elt, index) {
      return <Link to={elt.href} key={elt.href} className="link" variant="display1">{elt.label}</Link>;
    });

    return (
      <Toolbar>
        <Breadcrumbs separator=">" aria-label="Breadcrumb">
          {list}
        </Breadcrumbs>
      </Toolbar>
    );
  }
}

HRBreadcrumb.propTypes = {
  item: PropTypes.element.isRequired
};

export default HRBreadcrumb;
