import { API_MAIN_URL } from './const';

export default class Api {
  constructor() {
    this.data = {};
  }

  async fetchData(url) {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };
    const fetch_url = API_MAIN_URL + (url || '');

    return fetch(fetch_url, requestOptions)
      .then(response => response.json())
      .then(data => data)
      .catch(error => console.log('error', error));
  }

}
