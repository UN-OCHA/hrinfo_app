import React from 'react';

import DigitalSitrepAPI from '../api/DigitalSitrepAPI';

class DigitalSitrepFigures extends React.Component {

  state = {
    figures: []
  };

  dsAPI = new DigitalSitrepAPI();

  async updateData () {
    const params = {
      "fields.slug": this.props.slug
    };
    const data = await this.dsAPI.get(params);
    const figures = [];
    if (data && data.includes) {
      data.includes.Entry.forEach(function (entry) {
        if  (entry.fields.figure) {
          figures.push(entry.fields);
        }
      });
    }
    this.setState({figures});
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
    const figures = this.state.figures;
    return (
      <div>
        {figures ?
        <ul>
            {figures.map(function (figure, index) {
              return (
                <li key={index}>{figure.figure} {figure.caption}</li>
              );
            })}
        </ul> : '' }
      </div>
    );
  }
}

export { DigitalSitrepFigures };
