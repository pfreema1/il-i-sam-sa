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
import MetronomeContainer from './Containers/MetronomeContainer';

const ToolbarStyleObj = {
  height: '60px'
};

/*****************************/

class ToolbarContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="toolbar-container">
        <Toolbar style={ToolbarStyleObj}>
          <ToolbarGroup firstChild={true}>
            <MetronomeContainer />
          </ToolbarGroup>
          <ToolbarGroup firstChild={true}>
            <PlayButton />
          </ToolbarGroup>
          <ToolbarGroup firstChild={true}>modeselector</ToolbarGroup>
          <ToolbarGroup firstChild={true}>pattern indicator</ToolbarGroup>
        </Toolbar>
      </div>
    );
  }
}

/*****************************/

export default ToolbarContainer;
