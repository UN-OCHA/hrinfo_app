
import Cookies from 'universal-cookie';

let instance = null;

class HidAPI {
  constructor() {
    if (!instance){
      instance = this;
    }
    const cookies = new Cookies();
    instance.token = cookies.get('hid-token');
    return instance;
  }

  async getItem(type, id) {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + this.token,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
    const results = await fetch("https://api.humanitarian.id/api/v2/" + type + "/" + id, options);
    const data = await results.json();
    data.type = 'users';
    return data;
  }

  async get (type, params) {
    let url = 'https://api.humanitarian.id/api/v2/' + type;
    let keys = Object.keys(params);
    if (keys.length) {
      url += '?';
      keys.forEach(function (key) {
        url += key + '=' + params[key] + '&';
      });
    }
    let count = 0;
    const options = {
      headers: {
        'Authorization': 'Bearer ' + this.token,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
    const results = await fetch(url, options);
    const data = await results.json();
    data.forEach(function (item) {
      item.type = 'users';
    });
    return {
      count: parseInt(results.headers.get('x-total-count'), 10),
      data: data
    };
  }

  async getJWT (email, password) {
    let body = {
      email: email,
      password: password
    };
    body.exp = Math.floor(Date.now() / 1000) + 7 * 24 * 3600;
    const options = {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
    const results = await fetch('https://auth.humanitarian.id/api/v2/jsonwebtoken', options);
    const data = await results.json();
    return data;
  }

}

export default HidAPI;
