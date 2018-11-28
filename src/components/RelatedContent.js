import React from 'react';
import { translate } from 'react-i18next';
import lodash from 'lodash';

import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from "@material-ui/core/CardActions/CardActions";
import IconButton from "@material-ui/core/IconButton/IconButton";

class RelatedContent extends React.Component {
    state = {
      inputNumber: 1,
      value: [{
        title: '',
        url: ''
      }],
      status: 'initial'
    };

    getRow = (number) => {
      const { t } = this.props;
      return (
		  <Card key={number} className="card-container">
			  <CardContent>
				  <FormControl fullWidth>
					  <TextField type="text"
						  name={'related_content_titles_' + number}
						  label={t('related_content.title')}
						  value={this.state.value[number]['title']}
						  onChange={(v) => this.handleChange(number, 'title', v)}
						  helperText={t('related_content.helpers.title')}/>
				  </FormControl>
			  </CardContent>
        <CardContent>
          <FormControl fullWidth>
            <TextField type="text"
                       name={'related_content_urls_' + number}
                       label={t('related_content.url')}
                       value={this.state.value[number]['url']}
                       onChange={(v) => this.handleChange(number, 'url', v)}
                       helperText={t('related_content.helpers.url')}/>
          </FormControl>
        </CardContent>
        <CardActions>
          <IconButton color="primary" onClick={(e) => this.removeRelatedContent(number)}>
            <i className="icon-trash" />
          </IconButton>
        </CardActions>
		  </Card>

      );
    };

    handleChange = (number, elt, evt) => {
      const target = evt.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      let val = lodash.cloneDeep(this.state.value);
      val[number][elt] = value;
      this.setState({
        status: 'ready',
        value: val
      });
      if (this.props.onChange) {
        this.props.onChange(val);
      }
    };

    removeRelatedContent = (number) => {
      this.setState({
        value: this.state.value.filter(function (elt, index) {
          return index !== number;
        }),
        inputNumber: this.state.inputNumber - 1
      });
    };

    onAddBtnClick = (event) => {
      let val = lodash.cloneDeep(this.state.value);
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
    };

    componentDidUpdate() {
      if (this.props.value && this.state.status === 'initial') {
        this.setState({
          status: 'ready',
          value: this.props.value,
          inputNumber: this.props.value.length
        });
      }
    }

    shouldComponentUpdate(nextProps, nextState) {
      if (JSON.stringify(this.state.value) !== JSON.stringify(nextState.value) || this.state.inputNumber !== nextState.inputNumber) {
        return true;
      }
      return false;
    }

    render () {
      const { t } = this.props;
      let rows = [];
      for (let i = 0; i < this.state.inputNumber; i++) {
        rows.push(this.getRow(i));
      }
      return (
        <div>
          	{rows}
		  	<Button variant="outlined" onClick={this.onAddBtnClick}>
				<i className="icon-news" /> &nbsp; {t('add_another')}
			</Button>
        </div>
        );
    }
}

export default translate('forms')(RelatedContent);
