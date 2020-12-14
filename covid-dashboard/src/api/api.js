
export default class Api {
  constructor(query='', resultCallBack, errorCallBack) {
    this.mainURL = 'https://disease.sh/v3/covid-19/';
    this.fetchData(query, resultCallBack, errorCallBack)
  }

  async fetchData(query, resultCallBack, errorCallBack) {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };
    const url = `${this.mainURL}${query}&allowNull=false`;
    console.log(url);
    fetch(url, requestOptions)
    .then(res => res.json())
    .then(
      resultCallBack,
      errorCallBack,
    )
  }
}