
let instance = null;

class DigitalSitrepAPI {
  constructor(token) {
    if(!instance){
      instance = this;
      if (token) {
        instance.token = token;
      }
      else {
        instance.token = '4815d67d546ce6a5d4670dcec330e7c413fad59c601f5ace209b3f256bb10c5c';
      }
    }
    return instance;
  }

  async get (params) {
    let url = 'https://cdn.contentful.com/spaces/ejsx83ka8ylz/environments/master/entries?include=4&content_type=sitrep&';
    let keys = Object.keys(params);
    if (keys.length) {
      keys.forEach(function (key) {
        url += key + '=' + params[key] + '&';
      });
    }
    const options = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token
      }
    };
    const results = await fetch(url, options);
    const data = await results.json();
    return data;
  }

}

export default DigitalSitrepAPI;
