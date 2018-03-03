import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import FileDragContainer from '../Containers/FileDragContainer';
import SampleSelectContainer from '../Containers/SampleSelectContainer';

const AddSequencerDialogContainer = props => (
  <Dialog
    open={props.addSequencerDialogOpen}
    onRequestClose={props.handleDialogClose}
    className="dialog-root"
  >
    <h1>Add Sequencer</h1>
    <div className="add-sequencer__dialog-container">
      <FileDragContainer handleDialogClose={props.handleDialogClose} />
      <SampleSelectContainer
        handleDialogClose={props.handleDialogClose}
        menuItemsArr={props.menuItemsArr}
        samples={props.samples}
      />
    </div>
  </Dialog>
);

export default AddSequencerDialogContainer;
