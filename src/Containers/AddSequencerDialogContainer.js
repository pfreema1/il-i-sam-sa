import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import FileDragContainer from '../Containers/FileDragContainer';
import SampleSelectContainer from '../Containers/SampleSelectContainer';

class AddSequencerDialogContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <Dialog
        open={this.props.addSequencerDialogOpen}
        onRequestClose={this.props.handleDialogClose}
        className="dialog-root"
      >
        <h1>Add Sequencer</h1>
        <div className="add-sequencer__dialog-container">
          <FileDragContainer handleDialogClose={this.props.handleDialogClose} />
          <SampleSelectContainer
            handleDialogClose={this.props.handleDialogClose}
            menuItemsArr={this.props.menuItemsArr}
            samples={this.props.samples}
          />
        </div>
      </Dialog>
    );
  }
}

export default AddSequencerDialogContainer;
