import React from 'react';

class RelatedContent extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        inputNumber: 1,
        value: [{
          title: '',
          url: ''
        }],
        status: 'initial'
      };
      this.getRow = this.getRow.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.onAddBtnClick = this.onAddBtnClick.bind(this);
    }

    getRow (number) {
      return (
        <div className="row" key={number}>
          <div className="col-sm-6">
            <label>Title</label><br />
            <input type="text" className="form-control" name={'related_content_titles_' + number} placeholder="Title" value={this.state.value[number]['title']} onChange={(v) => this.handleChange(number, 'title', v)} />
          </div>
          <div className="col-sm-6">
            <label>URL</label>
            <input type="text" className="form-control" name={'related_content_urls_' + number} placeholder="URL" value={this.state.value[number]['url']} onChange={(v) => this.handleChange(number, 'url', v)} />
          </div>
        </div>
      );
    }

    handleChange (number, elt, evt) {
      const target = evt.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      let val = this.state.value;
      val[number][elt] = value;
      this.setState({
        status: 'ready',
        value: val
      });
      if (this.props.onChange) {
        this.props.onChange(val);
      }
    }

    onAddBtnClick (event) {
      let val = this.state.value;
      for (let i = 0; i < this.state.inputNumber + 1; i++) {
        if (!val[i]) {
          val[i] = {
            title: '',
            url: ''
          };
        }
      }
      this.setState({
        inputNumber: this.state.inputNumber + 1,
        value: val
      });
    }

    componentDidUpdate() {
      if (this.props.value && this.state.status === 'initial') {
        this.setState({
          status: 'ready',
          value: this.props.value,
          inputNumber: this.props.value.length
        });
      }
    }

    render () {
      let rows = [];
      for (let i = 0; i < this.state.inputNumber; i++) {
        rows.push(this.getRow(i));
      }
      return (
        <div>
          {rows}
          <button type="button" onClick={this.onAddBtnClick}>Add related content</button>
        </div>
        );
    }
}

export default RelatedContent;
