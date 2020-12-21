import './Table.css';
import React from 'react';
import { AppContext } from '../../../Context';

import Modal from "react-modal";

const root = document.getElementById("root");
Modal.setAppElement(root);

export default class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      api: props.api,
      error: null,
      isLoaded: false,
      items: [],
      showModal: false
    };

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  fetchData() {
    const page = (this.state.api.country) ? 'countries' : 'all';
    this.state.api.fetchCountry(this, page);
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate() {
    if (this.throttle) return false;
    this.throttle = true;
    this.fetchData();
    setTimeout(() => this.throttle = false, this.state.api.throttleTime);
  }

  render() {
    const { error, isLoaded, items } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      const population = items.population;
      let cases = (this.state.api.today) ? items.todayCases : items.cases;
      cases = this.state.api.formatCounter(cases, population).toLocaleString();
      let deaths = (this.state.api.today) ? items.todayDeaths : items.deaths;
      deaths = this.state.api.formatCounter(deaths, population).toLocaleString();
      let recovered = (this.state.api.today) ? items.todayRecovered : items.recovered;
      recovered = this.state.api.formatCounter(recovered, population).toLocaleString();
      return (
        <AppContext.Consumer>
          {context => {
            const country = (context.api.country) ? context.api.country : 'Global';
            return (
              <div className="Table">
                <button className="expand" onClick={this.handleOpenModal}></button>

                <Modal
                  isOpen={this.state.showModal}
                  contentLabel="onRequestClose Example"
                  onRequestClose={this.handleCloseModal}
                  className="Modal Table"
                  overlayClassName="Overlay"
                >
                  <div className="Table_country_name">{country}:</div>
                  <hr />
                  <div>Cases: {cases}</div>
                  <div>Deaths: {deaths}</div>
                  <div>Recovered: {recovered}</div>

                  <button className="expand" onClick={this.handleCloseModal}></button>
                </Modal>

                <div className="Table_country_name">{country}:</div>
                <hr />
                <div>Cases: {cases}</div>
                <div>Deaths: {deaths}</div>
                <div>Recovered: {recovered}</div>
              </div>
            )
          }}
        </AppContext.Consumer>
      );
    }
  }
}