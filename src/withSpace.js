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
      const parts = this.props.match.url.split('/');
      this.spaceType = parts[1].slice(0, -1);
      this.hrinfoFilter = this.spaceType + 's';
      this.hidFilter = this.spaceType + 's';
      this.hrinfoType = this.spaceType + 's';
      if (this.spaceType === 'operation') {
        this.hrinfoFilter = 'operation';
      }
      if (this.spaceType === 'group') {
        this.hrinfoFilter = 'bundles';
        this.hidFilter = 'bundles';
        this.hrinfoType = 'bundles';
      }
      if (this.spaceType === 'organization') {
        this.hidFilter = 'organization';
      }
      // spaceType = ['operation', 'group', 'organization', 'disaster', 'office']
      // hrinfoFilter = ['operation', 'bundles', 'organizations', 'disasters', 'offices']
      // hidFilter = ['operations', 'bundles', 'organization', 'disasters', 'offices']
      // hrinfoType = ['operations', 'bundles', 'organizations', 'disasters', 'offices']
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
        params['filter[' + this.hrinfoFilter + ']'] = this.state.doc.id;
        content = await this.hrinfoAPI.get(options.contentType, params);
      }
      else {
        params.limit = this.state.rowsPerPage;
        params.offset = page * this.state.rowsPerPage;
        params[this.hidFilter + '.list'] = this.state.list._id;
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
        params['filter[' + this.hrinfoFilter +']'] = this.state.doc.id;
        content = await this.hrinfoAPI.get(options.contentType, params);
      }
      else {
        params.limit = event.target.value;
        params.offset = this.state.page * event.target.value;
        params[this.hidFilter + '.list'] = this.state.list._id;
        content = await this.hidAPI.get(options.contentType, params);
      }
      this.setState({
        rowsPerPage: event.target.value,
        content
      });
    }


    async componentDidMount() {
      if (this.props.match.params.id) {
        let newState = {};
        newState.doc = await this.hrinfoAPI.getItem(this.hrinfoType, this.props.match.params.id);
        newState.doc.type = this.spaceType;
        let breadcrumb = [];
        if ((this.spaceType === 'group' || this.spaceType === 'office') && newState.doc.operation) {
          breadcrumb.push({
            href: '/operations/' + newState.doc.operation[0].id,
            label: newState.doc.operation[0].label
          });
        }
        breadcrumb.push({
          href: '/' + this.spaceType + 's/' + newState.doc.id,
          label: newState.doc.label
        });
        if (options.contentType) {
          let params = {
            sort: options.sort
          };
          if (options.contentType !== 'user') {
            params.range = this.state.rowsPerPage;
            params.page = this.state.page + 1;
            params['filter[' + this.hrinfoFilter + ']'] = this.props.match.params.id;
            newState.content = await this.hrinfoAPI.get(options.contentType, params);
          }
          else {
            params.limit = this.state.rowsPerPage;
            let listType = this.spaceType;
            if (listType === 'group') {
              listType = 'bundle';
            }
            const listParams = {
              type: listType,
              remote_id: newState.doc.id
            };
            const lists = await this.hidAPI.get('list', listParams);
            newState.list = lists.data[0];
            params.limit = this.state.rowsPerPage;
            params[this.hidFilter + '.list'] = newState.list._id;
            newState.content = await this.hidAPI.get(options.contentType, params);
          }
          let contentType = options.contentType;
          if (contentType === 'user') {
            contentType = 'contacts';
          }
          breadcrumb.push({
            href: '/' + this.spaceType + 's/' + newState.doc.id + '/' + contentType,
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
        spaceType: this.spaceType,
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
