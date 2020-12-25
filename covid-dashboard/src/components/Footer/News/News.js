import './News.scss';
import React from 'react';
import Marquee from 'react-double-marquee';

export default class News extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        api: props.api,
        error: null,
        isLoaded: false,
        items: [],
      };
  }

  fetchData(url, resultCallBack, errorCallBack) {
    fetch(url)
    .then(response => response.json())
    .then(result => resultCallBack(result))
    .catch(error => errorCallBack(error));
  }

  resultCallBack(result) {
    const newState = {...this.state};
    newState.isLoaded = true;
    newState.items = result;
    this.setState(newState);
  }

  errorCallBack(error) {
    const newState = {...this.state};
    newState.isLoaded = true;
    newState.error = error;
    this.setState(newState);
  }

  componentDidMount() {
    const url = 'https://gnews.io/api/v4/search?q=COVID&lang=en&token=ea7ff07287becd7cfc5b336bac61d64c';
    const resultCallBack = this.resultCallBack.bind(this);
    const errorCallBack = this.errorCallBack.bind(this);
    this.fetchData(url, resultCallBack, errorCallBack);
  }

  render() {
    const { error, isLoaded, items } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
        const articles = items.articles || [];
        const content = [];
        articles.forEach(element => {
            content.push(`${element.title}: ${element.description}. ${element.source.name}`);
        });
        const newsLine = content.join(' | ');
        return (
        <div
        className="news-holder"
        style={{
            minWidth: '150px',
            maxWidth: '500px',
            whiteSpace: 'nowrap',
            margin: '0 10px',
        }}
        >
            <Marquee direction="left">
            {newsLine}
            </Marquee>
        </div>
        );
    }  
  }
}