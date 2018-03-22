import React, { Component } from 'react';
import { connect } from 'react-redux';
import FileDragComponent from '../Components/FileDragComponent';

const wrapperStyling = {
  width: '130px',
  height: '100px',
  border: '5px dashed RGBA(130, 130, 123, 1.00)',
  borderRadius: '2px',
  // marginLeft: '5px',
  boxSizing: 'border-box',
  color: 'white',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
  alignItems: 'center',
  fontSize: '15px',
  marginTop: '10px'
};

/*****************************/

class FileDragContainer extends Component {
  // constructor(props) {
  //   super(props);

  //   this.state = {
  //     isLoadingFile: false
  //   };
  // }

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

  handleDragOver = e => {
    e.stopPropagation();
    e.preventDefault();
  };

  handleFileDrop = e => {
    e.stopPropagation();
    e.preventDefault();
    //if dropped items aren't files, reject them
    let dt = e.dataTransfer;
    if (dt.items) {
      //use datatransferitemlist interface to access the file(s)
      for (let i = 0; i < dt.items.length; i++) {
        if (dt.items[i].kind === 'file') {
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
      let shortenedURL = URL.createObjectURL(file);
      this.props.dispatch({
        type: 'ADD_NEW_SEQUENCER',
        sequencerId: file.name + Date.now(),
        sample: shortenedURL
      });

      this.props.dispatch({
        type: 'PATTERN_SELECT_RERENDERED',
        updateAll: true
      });

      //prevents flash back to original visual state after finished loading
      setTimeout(() => {
        // this.setState({ isLoadingFile: false });
        this.props.handleIsLoading(false);
      }, 1000);

      //call function in parent to close dialog
      // this.props.handleDialogClose();
    };

    reader.onloadstart = () => {
      // this.setState({ isLoadingFile: true });
      this.props.handleIsLoading(true);
    };

    //do work
    reader.readAsDataURL(file);
  };

  handleClick = () => {
    //turds
  };

  render() {
    return (
      <div style={wrapperStyling}>
        <FileDragComponent
          onDragEnd={this.handleDragEnd}
          onDragOver={this.handleDragOver}
          onDrop={this.handleFileDrop}
          onClick={this.handleClick}
        />
      </div>
    );
  }
}

/*****************************/

export default connect()(FileDragContainer);
