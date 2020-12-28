import './Footer.scss';
import React from 'react';
import News from './News/News';

export default function Footer(props) {
  return (
    <div className="Footer">
      <div className="Footer_links">
        <a className="Footer_link" href="https://github.com/i3-code/" target="blank" rel="noopener noreferrer"><i className="fab fa-github"></i>i3-code</a>
        <a className="Footer_link" href="https://github.com/Marsocode/" target="blank" rel="noopener noreferrer"><i className="fab fa-github"></i>marsocode</a>
      </div>
      <News api={props.api} />
      <div className="Footer_links">
          <a href="https://rs.school/js/" target="blank" rel="noopener noreferrer">
            <span className="Footer_logo">
                <img src="https://rs.school/images/rs_school_js.svg" alt="RS School"></img>
            </span>
          </a>, 2020
      </div>
    </div>
  );
}
