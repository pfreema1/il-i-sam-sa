import React, { Component } from 'react';
import { connect } from 'react-redux';
import './ToolbarContainer.css';
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarTitle
} from 'material-ui/Toolbar';
import PlayButton from './PlayButton';

class ToolbarContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="toolbar-container">
        <Toolbar>
          <PlayButton />
        </Toolbar>
      </div>
    );
  }
}

/*****************************/

export default ToolbarContainer;
