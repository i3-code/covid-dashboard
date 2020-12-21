import './Center.css';
import Map from './Map/Map';
import React, { useState } from 'react';
import Modal from 'react-modal';

const root = document.getElementById("root");
Modal.setAppElement(root);

export default function Center(props) {

  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <main className="Center">
      <button className="expand" onClick={openModal}></button>

      <Modal isOpen={modalIsOpen}
        contentLabel="onRequestClose Example"
        onRequestClose={closeModal}
        className="Modal Table"
        overlayClassName="Overlay">

        <Map api={props.api} />

      </Modal>

      <Map api={props.api} />
    </main>
  );
}