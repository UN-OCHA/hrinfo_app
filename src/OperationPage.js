import React from 'react';
import withSpace from './withSpace';

class SpacePage extends React.Component {

    render() {
      return ('');
    }
}

const GroupPage = withSpace(SpacePage, { spaceType: 'groups' });
const OperationPage = withSpace(SpacePage, { spaceType: 'operations'});

export { GroupPage, OperationPage };
