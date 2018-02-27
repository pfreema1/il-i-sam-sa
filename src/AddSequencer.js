import React, { Component } from 'react';
import { connect } from 'react-redux';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import './AddSequencer.css';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import openHiHat1 from './samples/openHiHat1.wav';

class AddSequencer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addSequencerDialogOpen: false
    };
  }

  handleOpenAddSequencerDialogClick = () => {
    this.setState({
      addSequencerDialogOpen: true
    });
  };

  handleAddSequencer = () => {
    this.setState({
      addSequencerDialogOpen: false
    });
  };

  handleDialogClose = () => {
    this.setState({
      addSequencerDialogOpen: false
    });
  };

  returnMenuItems = () => {
    const items = ['foo', 'bar', 'baz', 'bat'];

    return items.map(item => (
      <MenuItem value={item} key={item} primaryText={item} />
    ));
  };

  render() {
    return (
      <div className="add-sequencer-container">
        <FloatingActionButton onClick={this.handleOpenAddSequencerDialogClick}>
          <ContentAdd />{' '}
        </FloatingActionButton>

        <Dialog
          open={this.state.addSequencerDialogOpen}
          onRequestClose={this.handleDialogClose}
          className="dialog-root"
        >
          <div className=" add-sequencer__dialog-container">
            <div className="add-sequencer__dialog-file-drop-container">
              drag file here bruh
            </div>
            <div className="add-sequencer__dialog-menu-container">
              <DropDownMenu
                maxHeight={300}
                value={this.state.dropDownMenuValue}
                onChange={this.handleDropDownMenuChange}
              >
                {this.returnMenuItems()}
              </DropDownMenu>
            </div>
            <RaisedButton
              label="Add Sequencer"
              primary={true}
              onClick={this.handleAddSequencer}
            />
          </div>
        </Dialog>
      </div>
    );
  }
}

/*****************************/

export default AddSequencer;
