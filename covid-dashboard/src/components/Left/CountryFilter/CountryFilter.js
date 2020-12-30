import "./CountryFilter.scss";
import "./kb-style.css";
import "./icons.css";

import React from "react";
import Keyboard from "./keyboard";
export default class CountryFilter extends React.Component {
  componentDidMount() {
    const input = document.getElementById("keyboard-input");
    new Keyboard(document.body, input, this.props.writeFilter);
  }

  render() {
    return (
      <input
        id="keyboard-input"
        type="text"
        onChange={this.props.onChange}
        placeholder="Search..."
        title="Type in a country name"
        className="CountryFilter"
      />
    );
  }
}
