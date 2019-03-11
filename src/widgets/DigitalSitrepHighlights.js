import React from 'react';

import DigitalSitrepAPI from '../api/DigitalSitrepAPI';

class DigitalSitrepHighlights extends React.Component {

  state = {
    highlights: []
  };

  dsAPI = new DigitalSitrepAPI();

  async updateData () {
    const params = {
      "fields.slug": this.props.slug
    };
    const data = await this.dsAPI.get(params);
    const highlights = [];
    if (data && data.includes) {
      data.includes.Entry.forEach(function (entry) {
        if  (entry.fields.keyMessage) {
          highlights.push(entry.fields.keyMessage);
        }
      });
    }
    this.setState({highlights});
  }

  async componentDidMount() {
    this.updateData();
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
      this.updateData();
    }
  }

  render() {
    const highlights = this.state.highlights;
    return (
      <div>
        {highlights ?
        <ul>
            {highlights.map(function (highlight, index) {
              return (
                <li key={index}>{highlight}</li>
              );
            })}
        </ul> : '' }
      </div>
    );
  }
}

export { DigitalSitrepHighlights };
