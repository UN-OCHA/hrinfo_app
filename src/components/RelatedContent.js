import React from 'react';

import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

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
		  <Card key={number} className="card-container">
			  <CardContent>
				  <FormControl>
					  <TextField type="text"
						  name={'related_content_titles_' + number}
						  label="Title"
						  value={this.state.value[number]['title']}
						  onChange={(v) => this.handleChange(number, 'title', v)}
						  helperText="Type in the title of the related content."/>
				  </FormControl>
				  <FormControl>
					  <TextField type="text"
						  name={'related_content_urls_' + number}
						  label="URL"
						  value={this.state.value[number]['url']}
						  onChange={(v) => this.handleChange(number, 'url', v)}
						  helperText="Type in the URL of the related content."/>
				  </FormControl>
			  </CardContent>
		  </Card>

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
		  	<Button variant="outlined" onClick={this.onAddBtnClick}>
				<i className="icon-news" /> &nbsp; Add another
			</Button>
        </div>
        );
    }
}

export default RelatedContent;
