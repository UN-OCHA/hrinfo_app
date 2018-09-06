
let instance = null;

class FTSApi {

  getFlow(params) {
    let url = 'https://api.hpc.tools/v1/public/fts/flow';
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
        return data;
      });
  }

  getAppeals (year) {
    let url = 'https://api.hpc.tools/v1/public/plan/year/' + year;
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
        return data;
      });
  }

  getGlobalClusters() {
    let url = 'https://api.hpc.tools/v1/public/global-cluster';
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
        return data;
      });
  }

}

export default FTSApi;
