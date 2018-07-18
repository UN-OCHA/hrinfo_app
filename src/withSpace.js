import React from 'react';
import moment from 'moment';
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
        rowsPerPage: 50,
        drawerState: false,
        filters: {}
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
      this.onRangeChange = this.onRangeChange.bind(this);
      this.toggleDrawer = this.toggleDrawer.bind(this);
      this.setFilter = this.setFilter.bind(this);
      this.removeFilter = this.removeFilter.bind(this);
    }

    handleChangePage (event, page) {
      this.setState({
        page
      });
    }

    handleChangeRowsPerPage(event) {
      this.setState({
        rowsPerPage: event.target.value
      });
    }

    async onRangeChange(r) {
      let range = {};
      if (Array.isArray(r)) {
        if (r.length > 1) {
          range.start = r[0];
          range.end = r[6];
        }
        else {
          if (r.length === 0) {
            range.start = new Date(moment().subtract(20, 'days'));
            range.end = new Date(moment().add(20, 'days'));
          }
          else {
            range.start = r[0];
            range.end = new Date(moment(r[0]).add(1, 'days'));
          }
        }
      }
      else {
        range = r;
      }
      range.start = range.start.toISOString();
      range.end = range.end.toISOString();
      let content = null;
      let params = {};
      params['filter[date][value][0]'] = range.start;
      params['filter[date][value][1]'] = range.end;
      params['filter[date][operator][0]'] = 'BETWEEN';
      params['filter[date][operator][1]'] = 'BETWEEN';
      params['filter[' + this.hrinfoFilter + ']'] = this.state.doc.id;
      content = await this.hrinfoAPI.get(options.contentType, params);
      this.setState({
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

    async componentDidUpdate(prevProps, prevState, snapshot) {
      if (prevState.rowsPerPage !== this.state.rowsPerPage ||
        prevState.page !== this.state.page ||
        JSON.stringify(prevState.filters) !== JSON.stringify(this.state.filters)) {

        let content = null;
        let params = {
          sort: options.sort
        };
        let filters = this.state.filters;
        if (options.contentType !== 'user') {
          params.range = this.state.rowsPerPage;
          params.page = this.state.page + 1;
          let filterKeys = Object.keys(filters);
          // TODO: this fixes a flaw in the hrinfo API which makes the API display empty results when filtered by both bundles and operation
          if (filterKeys.indexOf('bundles') === -1) {
            params['filter[' + this.hrinfoFilter +']'] = this.state.doc.id;
          }
          filterKeys.forEach(function (key) {
            if (Array.isArray(filters[key])) {
              for (let i = 0; i < filters[key].length; i++) {
                params['filter[' + key + '][value][' + i + ']'] = filters[key][i].id
              }
            }
            else {
              params['filter[' + key + ']'] = filters[key].id;
            }
          });
          content = await this.hrinfoAPI.get(options.contentType, params);
        }
        else {
          params.limit = this.state.rowsPerPage;
          params.offset = this.state.page * this.state.rowsPerPage;
          params[this.hidFilter + '.list'] = this.state.list._id;
          content = await this.hidAPI.get(options.contentType, params);
        }
        this.setState({
          content: content
        });
      }
    }

    toggleDrawer () {
      this.setState({
        drawerState: !this.state.drawerState
      });
    }

    removeFilter (key, filter) {
      const that = this;
      let newFilters = {};
      Object.keys(this.state.filters).forEach(function (key) {
        newFilters[key] = that.state.filters[key];
      });
      if (Array.isArray(newFilters[key])) {
        newFilters[key] = newFilters[key].filter(function (sfilter) {
          return sfilter.id !== filter.id;
        });
        if (newFilters[key].length === 0) {
          delete newFilters[key];
        }
      }
      else {
        delete newFilters[key];
      }
      this.setState({
        filters: newFilters
      });
    }

    setFilter(name, val) {
      const that = this;
      let filters = {};
      Object.keys(this.state.filters).forEach(function (key) {
        filters[key] = that.state.filters[key];
      });
      if ((Array.isArray(val) && val.length !== 0) || val.id) {
        filters[name] = val;
      }
      else {
        delete filters[name];
      }
      this.setState({
        filters: filters
      });

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
        contentType: options.contentType,
        handleChangePage: this.handleChangePage,
        handleChangeRowsPerPage: this.handleChangeRowsPerPage,
        rowsPerPage: this.state.rowsPerPage,
        page: this.state.page,
        onRangeChange: this.onRangeChange,
        drawerState: this.state.drawerState,
        toggleDrawer: this.toggleDrawer,
        setFilter: this.setFilter,
        removeFilter: this.removeFilter,
        filters: this.state.filters
      };
      return <Component {...this.props} {...newProps} />;
    }
  }
}

export default withSpace;
