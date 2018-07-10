
let instance = null;

class HRInfoAPI {
  constructor(token) {
    if (!instance){
      instance = this;
    }
    if (token) {
      instance.token = token;
    }
    return instance;
  }

  getItem(type, id) {
    return fetch("https://www.humanitarianresponse.info/api/v1.0/" + type + "/" + id, {
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
    let items = [];
    if (!params.page) {
      params.page = 1;
    }
    return this
      .get(type, params)
      .then(async function(data) {
        items = items.concat(data.data);
        if (data.next) {
          params.page = params.page + 1;
          let newItems = await that.getAll(type, params);
          items = items.concat(newItems);
        }
        return items;
      });
  }

  get (type, params) {
    let url = 'https://www.humanitarianresponse.info/en/api/v1.0/' + type;
    let keys = Object.keys(params);
    if (keys.length) {
      url += '?';
      keys.forEach(function (key) {
        url += key + '=' + params[key] + '&';
      });
    }
    return fetch(url)
      .then(results => {
        return results.json();
      }).then(data => {
        return data;
      });
  }

  getProfile () {
    return fetch('https://www.humanitarianresponse.info/api/v1.0/user/me',
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
    let url = 'https://www.humanitarianresponse.info/api/v1.0/' + type;
    if (body.id) {
      httpMethod = 'PATCH';
      url = 'https://www.humanitarianresponse.info/api/v1.0/' + type + '/' + body.id;
      delete body.created;
      delete body.changed;
      delete body.url;
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
    return fetch('https://www.humanitarianresponse.info/api/v1.0/' + type + '/' + id, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + this.token,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
  }

  saveFieldCollection (body) {
    let url = 'https://www.humanitarianresponse.info/api/v1.0/files_collection';
    let httpMethod = 'POST';
    if (body.item_id) {
      url = 'https://www.humanitarianresponse.info/api/v1.0/files_collection/' + body.item_id;
      httpMethod = 'PATCH';
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

    return fetch('https://www.humanitarianresponse.info/api/files', requestParams)
      .then((response) => {
        return response.json();
      })
      .then(data => {
        return data.data[0];
      });
  }
}

export default HRInfoAPI;
