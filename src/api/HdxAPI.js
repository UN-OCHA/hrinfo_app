
let instance = null;

class HdxAPI {
  constructor(token) {
    if(!instance){
      instance = this;
    }
    if (token) {
      instance.token = token;
    }
    return instance;
  }

  get (params) {
    let url = 'https://data.humdata.org/api/3/action/package_search';
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
        return {
          count: data.result.count,
          data: data.result.results
        };
      })
  }

}

export default HdxAPI;
