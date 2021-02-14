import "./CountryFilter.scss";
import "./icons.css";

import React from "react";
export default class CountryFilter extends React.Component {
  render() {
    return (
      <input
        type="text"
        onChange={this.props.onChange}
        placeholder="Search..."
        title="Type in a country name"
        className="CountryFilter"
      />
    );
  }
}
