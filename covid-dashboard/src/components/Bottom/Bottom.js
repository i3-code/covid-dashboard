import React from 'react';
import './Bottom.css';

export default function Bottom(props) {
  return (
    <div className="footer">

      <div className="footer_links">
        <a className="footer_link" href="https://github.com/i3-code/" target="blank" rel="noopener noreferrer"><i className="fab fa-github"></i>i3-code</a>
        <a className="footer_link" href="https://github.com/Marsocode/" target="blank" rel="noopener noreferrer"><i className="fab fa-github"></i>marsocode</a>
      </div>

      <div>2020</div>

      <div className="footer_links"> <a className="footer_logo" href="https://rs.school/js/" target="blank" rel="noopener noreferrer"></a> </div>
    </div>
  );
}
