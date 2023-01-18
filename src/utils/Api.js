import axios from 'axios';
import { api_base_uri } from '../constants/env';

class Api {
  GET(endpoint, params) {
    return new Promise(resolve => {
      axios({
        method: 'GET',
        url: this.normalizePath(endpoint),
        params,
        headers: { 'Content-Type': 'application/json' },
        validateStatus: function (status) {
          return status !== 404;
        },
      })
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          console.log('GET error', error);
          resolve({ success: 0, message: 'Oops!  Something is wrong' });
        });
    });
  }

  POST(endpoint, params, headers) {
    return new Promise(resolve => {
      const data = new FormData();
      if (params) {
        Object.keys(params).forEach(key => {
          data.append(key, params[key]);
        });
      }
      axios({
        method: 'post',
        url: this.normalizePath(endpoint),
        data: data,
        headers: { 'Content-Type': 'multipart/form-data', ...headers },
        validateStatus: function (status) {
          return status !== 404;
        },
      })
        .then(response => {
          resolve(response.data);
        })
        .catch((error, response) => {
          console.log('post error', error);
          resolve({ success: 0, message: 'API: Oops!  Something is wrong' });
        });
    });
  }

  normalizePath(endpoint) {
    return `${api_base_uri}/${endpoint}`;
  }
}

export default new Api();
