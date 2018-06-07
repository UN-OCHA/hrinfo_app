import React from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Card, CardImg, CardBody, CardTitle, CardSubtitle, CardText, Badge, CardFooter, CardLink } from 'reactstrap';
import renderHTML from 'react-render-html';

class Document extends React.Component {

    constructor(props) {
      super(props);

      this.state = {
        doc: null,
        canEdit: true,
        filesOpen: false
      };

      this.canEdit = this.canEdit.bind(this);
      this.renderBadges = this.renderBadges.bind(this);
      this.openFiles = this.openFiles.bind(this);
    }

    getDocument () {
      const that = this;
      return fetch("https://www.humanitarianresponse.info/api/v1.0/documents/" + this.props.match.params.id)
          .then(results => {
              return results.json();
          }).then(data => {
            return data.data[0];
          }).catch(function(err) {
              console.log("Fetch error: ", err);
              that.props.setAlert('danger', 'Could not fetch document');
          });
    }

    canEdit (doc) {
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
      doc.operation.forEach(canWriteInSpace);
      doc.space.forEach(canWriteInSpace);
      return canEdit;
    }

    openFiles () {
      this.setState({
        filesOpen: !this.state.filesOpen
      });
    }

    async componentDidMount() {
      if (this.props.match.params.id) {
        const doc = await this.getDocument();
        this.setState({
          doc: doc,
          canEdit: this.canEdit(doc)
        });
      }
    }

    async componentDidUpdate () {
      if (this.state.doc.id && this.state.doc.id !== this.props.match.params.id) {
        const doc = await this.getDocument();
        this.setState({
          doc: doc,
          canEdit: this.canEdit(doc)
        });
      }
    }

    renderBadges () {
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
      const that = this;
      let badges = [];
      attributes.forEach(function (a) {
        if (that.state.doc[a]) {
          for (let i = 0; i < that.state.doc[a].length; i++) {
            if (that.state.doc[a][i]) {
              badges.push(<Badge key={a + '_' + that.state.doc[a][i].id}>{that.state.doc[a][i].label}</Badge>);
            }
          }
        }
      });
      return badges;
    }

    render() {
      const editLink = this.state.canEdit ? (
        <CardLink href={'/documents/' + this.props.match.params.id + '/edit'}>Edit</CardLink>
      ) : '';
      if (this.state.doc) {
        return (
          <Card>
            <CardBody>
              <CardTitle>{this.state.doc.label}</CardTitle>
              <CardSubtitle>{this.renderBadges()}</CardSubtitle>
            </CardBody>
            <div className="crop-image">
              <CardImg top width="100%" src={this.state.doc.files[0].file.preview} alt="Card image cap" />
            </div>
            <ButtonDropdown isOpen={this.state.filesOpen} toggle={this.openFiles} className="mx-auto">
              <DropdownToggle caret color="primary">
                Download
              </DropdownToggle>
              <DropdownMenu>
                {this.state.doc.files.map(function (f) {
                  return <DropdownItem key={f.file.fid}><a href={f.file.url} target="_blank">{f.file.filename}</a></DropdownItem>;
                })}
              </DropdownMenu>
            </ButtonDropdown>
            <CardText>{this.state.doc['body-html'] ? renderHTML(this.state.doc['body-html']) : ''}</CardText>
            <CardFooter>
              <CardLink href={ 'https://www.humanitarianresponse.info/node/' + this.props.match.params.id }>View in HR.info</CardLink>
              {editLink}
            </CardFooter>
          </Card>
        );
      }
      else {
        return null;
      }
    }
}

export default Document;
