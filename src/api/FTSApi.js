
class FTSApi {

  async getFlow(params) {
    let url = 'https://api.hpc.tools/v1/public/fts/flow';
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
    return data;
  }

  async getAppeals (year) {
    let url = 'https://api.hpc.tools/v1/public/plan/year/' + year;
    const options = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
    const results = await fetch(url, options);
    const data = await results.json();
    return data;
  }

  async getGlobalClusters() {
    let url = 'https://api.hpc.tools/v1/public/global-cluster';
    const options = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
    const results = await fetch(url, options);
    const data = await results.json();
    return data;
  }

}

export default FTSApi;
