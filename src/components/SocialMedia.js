import React from 'react';

import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

class SocialMedia extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        inputNumber: 1,
        value: [{
          url: '',
          title: null,
          attributes: []
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
				  <FormControl fullWidth>
            <TextField type="url"
                       id={"social_media_" + number}
                       name={"social_media_" + number}
                       value={this.state.value[number]['url']}
                       onChange={(e) => this.handleChange(number, e)} />
           </FormControl>
			  </CardContent>
		  </Card>
      );
    }

    handleChange (number, evt) {
      const target = evt.target;
      const value = target.value;
      let val = this.state.value;
      val[number]['url'] = value;
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
            url: '',
            title: null,
            attributes: []
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
				<i className="icon-rss-circle" /> &nbsp; Add another
			</Button>
        </div>
        );
    }
}

export default SocialMedia;
