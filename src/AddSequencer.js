import React, { Component } from 'react';
import { connect } from 'react-redux';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import './AddSequencer.css';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';

class AddSequencer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addSequencerDialogOpen: false,
      isLoadingFile: false,
      dropDownMenuValue: 0,
      menuItemsArr: []
    };
  }

  // componentDidMount() {
  //   debugger;
  //   let items = [];

  //   for (let sample in this.props.samples) {
  //     items.push(sample);
  //   }

  //   //prepend info as first item
  //   items.unshift('Select Sample');

  //   this.setState({ menuItemsArr: items });
  // }

  componentWillReceiveProps(nextProps) {
    if (nextProps.samples !== this.props.samples) {
      let items = [];

      for (let sample in nextProps.samples) {
        items.push(sample);
      }

      //prepend info as first item
      items.unshift('Select Sample');

      this.setState({ menuItemsArr: items });
    }
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
    return this.state.menuItemsArr.map((item, index) => {
      return <MenuItem value={index} key={item} primaryText={item} />;
    });
  };

  handleDropDownMenuChange = (e, index, value) => {
    const id = this.state.menuItemsArr[value];
    const sample = this.props.samples[id];

    if (value !== 0) {
      //close dialog and dispatch action
      this.props.dispatch({
        type: 'ADD_NEW_SEQUENCER',
        sequencerId: id + Date.now(),
        sample: sample
      });

      this.setState({ addSequencerDialogOpen: false });
    }
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

          this.readFile(f);
        }
      }
    } else {
      //use datatransfer interface to access the file(s)
      for (let i = 0; i < dt.files.length; i++) {
        this.readFile(dt.files[i]);
      }
    }
  };

  readFile = file => {
    const reader = new FileReader();

    reader.onloadend = e => {
      // let result = e.target.result;

      let shortenedURL = URL.createObjectURL(file);
      this.props.dispatch({
        type: 'ADD_NEW_SEQUENCER',
        sequencerId: file.name + Date.now(),
        sample: shortenedURL
      });

      this.setState({ isLoadingFile: false, addSequencerDialogOpen: false });
    };

    reader.onloadstart = () => {
      this.setState({ isLoadingFile: true });
    };

    //do work
    reader.readAsDataURL(file);
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
          {this.state.isLoadingFile ? (
            <div className="add-sequencer__dialog-loading-container">
              <CircularProgress size={80} thickness={7} />
              <h1>Loading Sample</h1>
            </div>
          ) : (
            <div className="add-sequencer__dialog-container">
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
          )}
        </Dialog>
      </div>
    );
  }
}

/*****************************/

const mapStateToProps = state => {
  return {
    samples: state.samples
  };
};

export default connect(mapStateToProps)(AddSequencer);
