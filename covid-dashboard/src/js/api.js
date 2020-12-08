export default class Api {
  constructor() {
    this.data = {};
  }

  async fetchData() {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    fetch("https://api.covid19api.com/", requestOptions)
      .then(response => response.text())
      .then(result => {
        console.log(result);
        return result;
      })
      .catch(error => console.log('error', error));
  }
}
