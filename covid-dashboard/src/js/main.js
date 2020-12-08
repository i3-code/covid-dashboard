import Create from './component';

class Main {
  constructor() {
    const cookieVersion = 0;
    const settings = JSON.parse(localStorage.getItem('c19d-settings')) || { cookieVersion };
    const savedVersion = settings.cookieVersion;
    if (savedVersion !== cookieVersion) localStorage.clear();
    this.init();
  }

  init() {
    console.log('Main class loaded');
    this.helloDiv = new Create('div', document.body, '', 'Hello world!');
  }
}

const main = new Main();
window.main = main;
