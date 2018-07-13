import React from 'react';
import HRInfoAPI from './HRInfoAPI';
import HidAPI from './HidAPI';

const withSpace = function withSpace(Component, options) {
  return class extends React.Component {
    constructor (props) {
      super(props);

      this.state = {
        doc: null,
        content: {
          data: [],
          count: 0
        },
        list: null,
        page: 0,
        rowsPerPage: 50
      };

      this.hrinfoAPI = new HRInfoAPI();
      this.hidAPI = new HidAPI();
      this.handleChangePage = this.handleChangePage.bind(this);
      this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    }

    async handleChangePage (event, page) {
      let content = null;
      let params = {
        sort: options.sort,
      };
      if (options.contentType !== 'user') {
        params.range = this.state.rowsPerPage;
        params.page = page + 1;
        params['filter[operation]'] = this.state.doc.id;
        content = await this.hrinfoAPI.get(options.contentType, params);
      }
      else {
        params.limit = this.state.rowsPerPage;
        params.offset = page * this.state.rowsPerPage;
        params['operations.list'] = this.state.list._id;
        content = await this.hidAPI.get(options.contentType, params);
      }
      this.setState({
        page,
        content
      });
    }

    async handleChangeRowsPerPage(event) {
      let content = null;
      let params = {
        sort: options.sort
      };
      if (options.contentType !== 'user') {
        params.range = event.target.value;
        params.page = this.state.page + 1;
        params['filter[operation]'] = this.state.doc.id;
        content = await this.hrinfoAPI.get(options.contentType, params);
      }
      else {
        params.limit = event.target.value;
        params.offset = this.state.page * event.target.value;
        params['operations.list'] = this.state.list._id;
        content = await this.hidAPI.get(options.contentType, params);
      }
      this.setState({
        rowsPerPage: event.target.value,
        content
      });
    }


    async componentDidMount() {
      if (this.props.match.params.id) {
        let type = options.spaceType;
        if (type === 'groups') {
          type = 'bundles';
        }
        let newState = {};
        newState.doc = await this.hrinfoAPI.getItem(type, this.props.match.params.id);
        let breadcrumb = [
          {
            href: '/' + options.spaceType + '/' + newState.doc.id,
            label: newState.doc.label
          },
        ];
        if (options.contentType) {
          let filterType = type;
          if (filterType === 'operations') {
            filterType = 'operation';
          }
          let params = {
            sort: options.sort
          };
          if (options.contentType !== 'user') {
            params.range = this.state.rowsPerPage;
            params.page = this.state.page + 1;
            params['filter[' + filterType + ']'] = this.props.match.params.id;
            newState.content = await this.hrinfoAPI.get(options.contentType, params);
          }
          else {
            params.limit = this.state.rowsPerPage;
            const listParams = {
              type: filterType,
              remote_id: newState.doc.id
            };
            const lists = await this.hidAPI.get('list', listParams);
            newState.list = lists.data[0];
            params.limit = this.state.rowsPerPage;
            params[options.spaceType + '.list'] = newState.list._id;
            newState.content = await this.hidAPI.get(options.contentType, params);
          }
          breadcrumb.push({
            href: '/' + options.spaceType + '/' + newState.doc.id + '/' + options.contentType,
            label: options.contentLabel
          });
        }
        this.setState(newState);
        this.props.setGroup(newState.doc);
        this.props.setBreadcrumb(breadcrumb);
      }
    }

    componentWillUnmount() {
      this.props.setGroup(null);
      this.props.setBreadcrumb([]);
    }

    render () {
      const newProps = {
        spaceType: options.spaceType,
        doc: this.state.doc,
        content: this.state.content,
        handleChangePage: this.handleChangePage,
        handleChangeRowsPerPage: this.handleChangeRowsPerPage,
        rowsPerPage: this.state.rowsPerPage,
        page: this.state.page
      };
      return <Component {...this.props} {...newProps} />;
    }
  }
}

export default withSpace;
