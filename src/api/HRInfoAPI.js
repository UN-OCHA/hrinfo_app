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

  getItem(type, id) {
    return fetch(hrinfoUrl + i18next.language + "/api/v1.0/" + type + "/" + id, {
        headers: {
          'Authorization': 'Bearer ' + this.token,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }})
        .then(results => {
            return results.json();
        })
        .then(data => {
          if (data.data) {
            return data.data[0];
          }
          else {
            return {};
          }
        });
  }

  async getAll (type, params) {
    const that = this;
    let items = [], clonedParams = Object.assign({}, params);
    if (!clonedParams.page) {
      clonedParams.page = 1;
    }
    return this
      .get(type, clonedParams)
      .then(async function(data) {
        items = items.concat(data.data);
        if (data.next) {
          clonedParams.page = clonedParams.page + 1;
          let newItems = await that.getAll(type, clonedParams);
          items = items.concat(newItems);
        }
        return items;
      });
  }

  get (type, params, anonymous = true) {
    let url = hrinfoUrl + i18next.language + '/api/v1.0/' + type;
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
    return fetch(url, queryParams)
      .then(results => {
        return results.json();
      }).then(data => {
        data.data.forEach(function (item) {
          item.type = type;
        });
        return data;
      });
  }

  getProfile () {
    return fetch(hrinfoUrl + 'api/v1.0/user/me',
      {
        headers: {
          'Authorization': 'Bearer ' + this.token,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      .then(results => {
        return results.json();
      })
      .then(data => {
        return data.data[0];
      });
  }

  save(type, body) {
    let httpMethod = 'POST';
    let url = hrinfoUrl + i18next.language + '/api/v1.0/' + type;
    if (body.id) {
      httpMethod = 'PATCH';
      url = hrinfoUrl + i18next.language + '/api/v1.0/' + type + '/' + body.id;
      delete body.created;
      delete body.changed;
      delete body.url;
      // TODO: this fixes an issue with the API, but will need to be removed at some point.
      delete body.language;
      delete body.published;
      delete body.author;
    }

    return fetch(url, {
        method: httpMethod,
        body: JSON.stringify(body),
        headers: {
          'Authorization': 'Bearer ' + this.token,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      .then(results => {
        return results.json();
      })
      .then(data => {
        return data.data[0];
      });
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

  saveFile (files) {
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

    return fetch(hrinfoUrl + '/api/files', requestParams)
      .then((response) => {
        return response.json();
      })
      .then(data => {
        return data.data[0];
      });
  }
}

export default HRInfoAPI;
