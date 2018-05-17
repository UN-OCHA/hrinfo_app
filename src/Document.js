import React from 'react';

class Document extends React.Component {

    constructor(props) {
      super(props);

      this.state = {
        doc: null
      };
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

    async componentDidMount() {
      const doc = await this.getDocument();
      this.setState({
        doc: doc
      });
    }

    render() {
      return (
        <div className="document">
          {this.state.doc &&
            <div>
              <p>{this.state.doc.label}</p>
              <a href={'/documents/' + this.props.match.params.id + '/edit'}>Edit this document</a>
            </div>
          }
        </div>
      );
    }
}

export default Document;
