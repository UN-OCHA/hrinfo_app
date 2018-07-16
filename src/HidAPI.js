
let instance = null;

class HidAPI {
  constructor(token) {
    if(!instance){
      instance = this;
    }
    if (token) {
      instance.token = token;
    }
    return instance;
  }

  getItem(type, id) {
    return fetch("https://api.humanitarian.id/api/v2/" + type + "/" + id, {
        headers: {
          'Authorization': 'Bearer ' + this.token,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }})
        .then(results => {
            return results.json();
        })
        .then(data => {
          return data;
        });
  }

  get (type, params) {
    let url = 'https://api.humanitarian.id/api/v2/' + type;
    let keys = Object.keys(params);
    if (keys.length) {
      url += '?';
      keys.forEach(function (key) {
        url += key + '=' + params[key] + '&';
      });
    }
    let count = 0;
    return fetch(url, {
        headers: {
          'Authorization': 'Bearer ' + this.token,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      .then(results => {
        count = parseInt(results.headers.get('x-total-count'), 10);
        return results.json();
      })
      .then(data => {
        return {
          count: count,
          data: data
        };
      })
  }

  getJWT (email, password) {
    let body = {
      email: email,
      password: password
    };
    body.exp = Math.floor(Date.now() / 1000) + 3600;
    return fetch('https://auth.humanitarian.id/api/v2/jsonwebtoken', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(results => {
        return results.json();
    });
  }

}

export default HidAPI;
