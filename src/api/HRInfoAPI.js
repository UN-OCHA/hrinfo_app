import Cookies from 'universal-cookie';
import i18next from 'i18next';

let instance = null;
const hrinfoUrl = 'https://www.humanitarianresponse.info/';

class HRInfoAPI {
  constructor(token) {
    if (!instance){
      instance = this;
    }
    if (token) {
      instance.token = token;
    }
    else {
      const cookies = new Cookies();
      instance.token = cookies.get('hid-token');
    }
    return instance;
  }

  async getItem(type, id) {
    const options = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
    if (this.token) {
      options.headers.Authorization = 'Bearer ' + this.token;
    }
    const results = await fetch(hrinfoUrl + i18next.languages[0] + "/api/v1.0/" + type + "/" + id, options);
    const json = await results.json();
    if (json.data) {
      return json.data[0];
    }
    else {
      return {};
    }
  }

  async getAll (type, params, anonymous = true) {
    const that = this;
    let items = [], clonedParams = Object.assign({}, params);
    if (!clonedParams.page) {
      clonedParams.page = 1;
    }
    return this
      .get(type, clonedParams, anonymous)
      .then(async function(data) {
        items = items.concat(data.data);
        if (data.next) {
          clonedParams.page = clonedParams.page + 1;
          let newItems = await that.getAll(type, clonedParams, anonymous);
          items = items.concat(newItems);
        }
        return items;
      });
  }

  async get (type, params, anonymous = true) {
    let url = hrinfoUrl + i18next.languages[0] + '/api/v1.0/' + type;
    let keys = Object.keys(params);
    if (keys.length) {
      url += '?';
      for (let i = 0; i < keys.length; i++) {
        url += keys[i] + '=' + params[keys[i]];
        if (i < keys.length - 1) {
          url += '&';
        }
      }
    }
    let queryParams = {};
    if (!anonymous) {
      queryParams.headers = {
        'Authorization': 'Bearer ' + this.token,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
    }
    const results = await fetch(url, queryParams);
    const data = await results.json();
    data.data.forEach(function (item) {
      item.type = type;
    });
    return data;
  }

  async getProfile () {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + this.token,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
    try {
      const response = await fetch(hrinfoUrl + 'api/v1.0/user/me', options);
      const json = await response.json();
      return json.data[0];
    }
    catch (err) {
      return {
        roles: [],
        spaces: [],
      };
    }
  }

  async save(type, body) {
    let httpMethod = 'POST';
    let url = hrinfoUrl + i18next.languages[0] + '/api/v1.0/' + type;
    if (body.id) {
      httpMethod = 'PATCH';
      url = hrinfoUrl + i18next.languages[0] + '/api/v1.0/' + type + '/' + body.id;
      delete body.created;
      delete body.changed;
      delete body.url;
      // TODO: this fixes an issue with the API, but will need to be removed at some point.
      delete body.language;
      delete body.published;
      delete body.author;
    }

    const options = {
      method: httpMethod,
      body: JSON.stringify(body),
      headers: {
        'Authorization': 'Bearer ' + this.token,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
    const results = await fetch(url, options);
    const data = await results.json();
    return data.data[0];
  }

  remove (type, id) {
    return fetch(hrinfoUrl + 'api/v1.0/' + type + '/' + id, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + this.token,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
  }

  saveFieldCollection (body) {
    let url = hrinfoUrl + 'api/v1.0/files_collection';
    let httpMethod = 'POST';
    if (body.item_id) {
      url = hrinfoUrl + '/api/v1.0/files_collection/' + body.item_id;
      httpMethod = 'PATCH';
      delete body.item_id;
    }
    return fetch(url, {
      method: httpMethod,
      body: JSON.stringify(body),
      headers: {
        'Authorization': 'Bearer ' + this.token,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  }

  async saveFile (files) {
    let requestParams = {};
    if (files instanceof FileList) {
      let data = new FormData();
      data.append('file', files[0]);
      requestParams = {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + this.token
        },
        body: data
      };
    }
    else {
      requestParams = {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + this.token,
          'Accept' : 'application/json',
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify(files[0])
      };
    }

    const response = await fetch(hrinfoUrl + '/api/files', requestParams);
    const data = await response.json();
    return data.data[0];
  }
}

export default HRInfoAPI;
