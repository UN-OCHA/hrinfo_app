
let instance = null;

class ReliefwebAPI {
  constructor(token) {
    if(!instance){
      instance = this;
    }
    if (token) {
      instance.token = token;
    }
    return instance;
  }

  getFilter (type) {
    let url = 'https://api.reliefweb.int/v1/reports';
    const params = {
      appname: 'hrinfo',
      offset: 0,
      limit: 0,
      'facets[0][field]': type,
      'facets[0][sort]': 'value:asc',
      'facets[0][limit]': 9999
    };
    let keys = Object.keys(params);
    if (keys.length) {
      url += '?';
      keys.forEach(function (key) {
        url += key + '=' + params[key] + '&';
      });
    }
    return fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      .then(results => {
        return results.json();
      })
      .then(data => {
        if (data.embedded && data.embedded.facets[type]) {
          return data.embedded.facets[type].data;
        }
        else {
          return null;
        }
      });
  }

  get (params) {
    let url = 'https://api.reliefweb.int/v1/reports';
    let keys = Object.keys(params);
    if (keys.length) {
      url += '?';
      keys.forEach(function (key) {
        url += key + '=' + params[key] + '&';
      });
    }
    return fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      .then(results => {
        return results.json();
      })
      .then(data => {
        data.data.forEach(function (item) {
          item.type = 'reports';
        });
        return {
          count: data.totalCount,
          data: data.data
        };
      });
  }

}

export default ReliefwebAPI;
