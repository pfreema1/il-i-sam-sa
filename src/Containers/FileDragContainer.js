import React, { Component } from 'react';
import { connect } from 'react-redux';
import './FileDragContainer.css';
import FileDragLoadingComponent from '../Components/FileDragLoadingComponent';
import FileDragComponent from '../Components/FileDragComponent';

class FileDragContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoadingFile: false
    };
  }

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

      //prevents flash back to original visual state after finished loading
      setTimeout(() => {
        this.setState({ isLoadingFile: false });
      }, 1000);

      //call function in parent to close dialog
      this.props.handleDialogClose();
    };

    reader.onloadstart = () => {
      this.setState({ isLoadingFile: true });
    };

    //do work
    reader.readAsDataURL(file);
  };

  handleClick = () => {
    //turds
  };

  render() {
    return (
      <div>
        {this.state.isLoadingFile ? (
          <FileDragLoadingComponent />
        ) : (
          <FileDragComponent
            onDragEnd={this.handleDragEnd}
            onDragOver={this.handleDragOver}
            onDrop={this.handleFileDrop}
            onClick={this.handleClick}
          />
        )}
      </div>
    );
  }
}

/*****************************/

export default connect()(FileDragContainer);
