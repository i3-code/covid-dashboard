import "./CountryFilter.scss";
import "./kb-style.css";
import "./icons.css";

import React from "react";
import Keyboard from "./keyboard";
export default class CountryFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      api: props.api,
    };
  }

  writeFilter(value= '') {
    const filter = (value.match(/[a-z.-\s]+/gi) || [""])[0];
    this.state.api.toggleApiState("filter", filter);
  }

  onChange(event) {
    this.writeFilter(event.target.value);
  }
  
  componentDidMount() {
    const input = document.getElementById("keyboard-input");
    new Keyboard(document.body, input, this.writeFilter.bind(this));
  }

  render() {
    return (
      <input
        id="keyboard-input"
        type="text"
        onChange={this.onChange.bind(this)}
        placeholder="Search.."
        title="Type in a country name"
        className="CountryFilter"
      />
    );
  }
}
