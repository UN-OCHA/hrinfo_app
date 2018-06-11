import React from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Card, CardImg, CardBody, CardTitle, CardText, CardFooter, ListGroup, ListGroupItem, Button } from 'reactstrap';
import renderHTML from 'react-render-html';

class Item extends React.Component {

    constructor(props) {
      super(props);

      this.state = {
        canEdit: true,
        filesOpen: false
      };

      this.canEdit = this.canEdit.bind(this);
      this.renderBadges = this.renderBadges.bind(this);
      this.openFiles = this.openFiles.bind(this);
    }

    canEdit () {
      const user = this.props.user;
      if (user.hrinfo.roles.indexOf('administrator') !== -1 || user.hrinfo.roles.indexOf('editor') !== -1) {
        return true;
      }
      var canEdit = true;
      const canWriteInSpace = function (op) {
        if (op) {
          const opId = parseInt(op.id, 10);
          if (!user.hrinfo.spaces[opId]) {
            canEdit = false;
          }
          else {
            if (user.hrinfo.spaces[opId].indexOf('manager') === -1) {
              canEdit = false;
            }
          }
        }
      };
      this.props.item.operation.forEach(canWriteInSpace);
      this.props.item.space.forEach(canWriteInSpace);
      return canEdit;
    }

    openFiles () {
      this.setState({
        filesOpen: !this.state.filesOpen
      });
    }

    renderBadges () {
      const item = this.props.item;
      const attributes = [
        'operation',
        'space',
        'organizations',
        'bundles',
        'locations',
        'themes',
        'offices',
        'disasters'
      ];
      let badges = [];
      attributes.forEach(function (a) {
        if (item[a] && Array.isArray(item[a])) {
          for (let i = 0; i < item[a].length; i++) {
            if (item[a][i]) {
              badges.push(<ListGroupItem key={a + '_' + item[a][i].id}>{item[a][i].label}</ListGroupItem>);
            }
          }
        }
        else {
          if (item[a]) {
            badges.push(<ListGroupItem key={a}>{item[a]}</ListGroupItem>);
          }
        }
      });
      return badges;
    }

    render() {
      const item = this.props.item;
      const editLink = this.props.viewMode === 'full' && this.canEdit() ? (
        <Button href={'/' + item.type + '/' + item.id + '/edit'}>Edit</Button>
      ) : '';
      return (
        <Card className="p-3 my-3">
          <div className="crop-image">
            <a href={'/' + item.type + '/' + item.id}>
              <CardImg top width="100%" src={item.files[0].file.preview === 'https://www.humanitarianresponse.info/' ? 'https://www.humanitarianresponse.info/sites/www.humanitarianresponse.info/files/media-icons/default/application-octet-stream.png' : item.files[0].file.preview} alt="Card image cap" />
            </a>
          </div>
          <CardBody>
            <CardTitle>{item.label}</CardTitle>
            <ListGroup>
              {this.renderBadges()}
            </ListGroup>
            <div className="text-center">
              <ButtonDropdown isOpen={this.state.filesOpen} toggle={this.openFiles} className="mx-auto">
                <DropdownToggle caret color="primary">
                  Download
                </DropdownToggle>
                <DropdownMenu>
                  {item.files.map(function (f) {
                    return <DropdownItem key={f.file.fid}><a href={f.file.url} target="_blank">{f.file.filename}</a></DropdownItem>;
                  })}
                </DropdownMenu>
              </ButtonDropdown>
            </div>
            {this.props.viewMode === 'full' ? <CardText>{item['body-html'] ? renderHTML(item['body-html']) : ''}</CardText> : ''}
          </CardBody>
          <CardFooter className="text-center">
            {this.props.viewMode === 'search' ? <Button href={'/' + item.type + '/' + item.id}>View more</Button> : '' }
            &nbsp;<Button href={ 'https://www.humanitarianresponse.info/node/' + item.id }>View in HR.info</Button>&nbsp;
            {editLink}
          </CardFooter>
        </Card>
      );
    }
}

export default Item;
