
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

  async get (params) {
    let url = 'https://data.humdata.org/api/3/action/package_search';
    let keys = Object.keys(params);
    if (keys.length) {
      url += '?';
      keys.forEach(function (key) {
        url += key + '=' + params[key] + '&';
      });
    }
    const options = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
    const results = await fetch(url, options);
    const data = await results.json();
    data.result.results.forEach(function (item) {
      item.type = 'dataset';
    });
    return {
      count: data.result.count,
      data: data.result.results
    };
  }

}

export default HdxAPI;
