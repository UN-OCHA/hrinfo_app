import React from 'react';
import {Link} from "react-router-dom";
import ChevronRight from '@material-ui/icons/ChevronRight';

function Breadcrumb(props) {
  let list = '';
  list = props.elts.map(function (elt) {
    return <span key={elt.href}><Link to={elt.href} className="link">{elt.label}</Link><ChevronRight /></span>;
  });

  return (
    <span id="breadcrumb">
      {list}
    </span>
  );
}

export default Breadcrumb;
