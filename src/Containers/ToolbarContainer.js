import React, { Component } from 'react';
import './ToolbarContainer.css';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import ModeSelector from './ModeSelector';
import MetronomeContainer from './MetronomeContainer';
import PlayControl from './PlayControl';
import PatternIndicator from './PatternIndicator';

const ToolbarStyleObj = {
  height: '60px',
  background: 'RGBA(26, 26, 26, 1.00)'
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
          <ToolbarGroup>
            <MetronomeContainer />
          </ToolbarGroup>

          <ToolbarGroup>
            <PlayControl />
          </ToolbarGroup>
          <ToolbarGroup>
            <ModeSelector />
          </ToolbarGroup>
          <ToolbarGroup>
            <PatternIndicator />
          </ToolbarGroup>
        </Toolbar>
      </div>
    );
  }
}

/*****************************/

export default ToolbarContainer;
