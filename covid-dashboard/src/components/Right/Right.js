import Table from './Table/Table';
import Filters from './Filters/Filters';
import Graph from './Graph/Graph';

import React, { useState } from 'react';
import Modal from 'react-modal';

const root = document.getElementById("root");
Modal.setAppElement(root);

export default function Right(props) {

  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }


  return (
    <div className="Right">
      <div className="Right_content">
        <Table api={props.api} />
        <Filters api={props.api} />
      </div>


      {/* вот лучше так или отдельно уже в Graph сделать? */}
      <div className="Right_graph">
        <button className="expand" onClick={openModal}></button>
        <Graph api={props.api} />
      </div>


      <Modal isOpen={modalIsOpen}
        contentLabel="onRequestClose Example"
        onRequestClose={closeModal}
        className="Modal Table"
        overlayClassName="Overlay">

        <Graph api={props.api} />

      </Modal>
    </div>
  )
}
