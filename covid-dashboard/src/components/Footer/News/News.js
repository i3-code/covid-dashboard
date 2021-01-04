import './News.scss';
import React from 'react';
import Marquee from 'react-double-marquee';

import { fetchNews } from '../../../utils';

export default class News extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        error: null,
        isLoaded: false,
        items: [],
      };
  }

  componentDidMount() {
    fetchNews(this);
  }

  render() {
    const { error, isLoaded, items } = this.state;
    if (error) return <div>Error: {error.message}</div>;
    if (!isLoaded) return <div>Loading...</div>;

    const articles = items.articles || [];
    const newsLine = articles.map(element => `${element.title}: ${element.description}. ${element.source.name}`).join(' | ');
    return (
      <div className="news-holder">
      <Marquee direction="left">
        {newsLine}
      </Marquee>
      </div>
    );
  }
}