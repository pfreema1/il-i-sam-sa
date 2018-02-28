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

  handleFileDrop = e => {
    e.stopPropagation();
    e.preventDefault();
    //if dropped items aren't files, reject them
    let dt = e.dataTransfer;
    if (dt.items) {
      //use datatransferitemlist interface to access the file(s)
      for (let i = 0; i < dt.items.length; i++) {
        if (dt.items[i].kind == 'file') {
          let f = dt.items[i].getAsFile();
          console.log('111111... file[' + i + '].name = ' + f.name);
          debugger;
          this.props.dispatch({
            type: 'ADD_NEW_SEQUENCER',
            sequencerId: f.name,
            sample: f
          });
        }
      }
    } else {
      //use datatransfer interface to access the file(s)
      for (let i = 0; i < dt.files.length; i++) {
        console.log('2222222... file[' + i + '].name = ' + dt.files[i].name);
        this.props.dispatch({
          type: 'ADD_NEW_SEQUENCER',
          sequencerId: dt.files[i].name,
          sample: dt.files[i]
        });
      }
    }
  };

  handleDragOver = e => {
    e.stopPropagation();
    e.preventDefault();
  };

  handleDragEnd = e => {
    //remove all of the drag data
    const dt = e.dataTransfer;
    if (dt.items) {
      //use DataTransferItemList interface to remove the drag data
      for (let i = 0; i < dt.items.length; i++) {
        dt.items.remove(i);
      }
    } else {
      // use DataTransfer interface to remove the drag data
      e.dataTransfer.clearData();
    }
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
            <div
              onDragEnd={this.handleDragEnd}
              onDragOver={this.handleDragOver}
              onDrop={this.handleFileDrop}
              className="add-sequencer__dialog-file-drop-container"
            >
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

const mapStateToProps = state => {
  return {
    sequencers: state.sequencers
  };
};

export default connect(mapStateToProps)(AddSequencer);
