import Create from './component';
import Api from './api';

class Main {
  constructor() {
    const cookieVersion = 0;
    const settings = JSON.parse(localStorage.getItem('c19d-settings')) || { cookieVersion };
    const savedVersion = settings.cookieVersion;
    if (savedVersion !== cookieVersion) localStorage.clear();
    this.init();
  }

  async init() {
    this.api = new Api();
    this.data = await this.api.fetchData();
    console.log(this.data);
    console.log('Main class loaded');
    this.helloDiv = new Create('div', document.body, '', 'Hello world!');
  }
}

const main = new Main();
window.main = main;
