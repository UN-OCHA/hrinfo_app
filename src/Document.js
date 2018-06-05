import React from 'react';

class Document extends React.Component {

    constructor(props) {
      super(props);

      this.state = {
        doc: null,
        canEdit: true
      };

      this.canEdit = this.canEdit.bind(this);
    }

    getDocument () {
      return fetch("https://www.humanitarianresponse.info/api/v1.0/documents/" + this.props.match.params.id)
          .then(results => {
              return results.json();
          }).then(data => {
            return data.data[0];
          }).catch(function(err) {
              console.log("Fetch error: ", err);
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

    async componentDidMount() {
      const doc = await this.getDocument();
      this.setState({
        doc: doc,
        canEdit: this.canEdit(doc)
      });
    }

    render() {
      const editLink = this.state.canEdit ? (
        <a href={'/documents/' + this.props.match.params.id + '/edit'}>Edit this document</a>
      ) : '';
      return (
        <div className="document">
          {this.state.doc &&
            <div>
              <p>{this.state.doc.label}</p>
              <a href={ 'https://www.humanitarianresponse.info/node/' + this.props.match.params.id } target="blank">View this document in humanitarianresponse.info</a><br />
              {editLink}
            </div>
          }
        </div>
      );
    }
}

export default Document;
