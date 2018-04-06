import React from 'react';
import { connect } from 'react-redux';
import PatternIndicatorView from '../Components/Toolbar/PatternIndicatorView';
import './PatternIndicator.css';

import AddPatternDialog from '../Components/AddPatternDialog';

class PatternIndicator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      addPatternDialogOpen: false,
      copyPatternPopoverOpen: false
    };
  }

  handlePatternChange = (e, index, value) => {
    this.props.dispatch({ type: 'PATTERN_CHANGED', patternIndex: value });
  };

  handleAddPatternClick = (test, e) => {
    this.addPatternRef.classList.remove('click-flasher');
    void this.addPatternRef.offsetWidth;
    this.addPatternRef.classList.add('click-flasher');
    this.setState({
      addPatternDialogOpen: true
    });
  };

  handleDialogClose = () => {
    this.setState({
      addPatternDialogOpen: false
    });
  };

  handleNewPatternClick = e => {
    // e.preventDefault();
    console.log('handleNewPatternClick rnning');
    this.props.dispatch({
      type: 'BLANK_PATTERN_ADDED',
      switchToPattern: true
    });

    this.handleDialogClose();
  };

  handleCopyPatternClick = e => {
    e.preventDefault();
    this.setState({
      copyPatternPopoverOpen: true,
      anchorEl: e.currentTarget
    });
  };

  handlePopoverClose = () => {
    this.setState({
      copyPatternPopoverOpen: false
    });
  };

  handlePopoverPatternSelect = patternName => {
    this.props.dispatch({
      type: 'BLANK_PATTERN_ADDED',
      switchToPattern: true
    });
    this.props.dispatch({
      type: 'COPIED_PATTERN_ADDED',
      patternToCopy: patternName
    });
    this.handlePopoverClose();
    this.handleDialogClose();
  };

  render() {
    return (
      <div>
        <PatternIndicatorView
          currentPatternIndex={this.props.currentPatternIndex}
          handlePatternChange={this.handlePatternChange}
          handleAddPatternClick={this.handleAddPatternClick}
          patternsArr={this.props.patternsArr}
          addPatternRef={el => (this.addPatternRef = el)}
        />

        <AddPatternDialog
          addPatternDialogOpen={this.state.addPatternDialogOpen}
          handleDialogClose={this.handleDialogClose}
          patternsArr={this.props.patternsArr}
          handleNewPatternClick={this.handleNewPatternClick}
          handleCopyPatternClick={this.handleCopyPatternClick}
          copyPatternPopoverOpen={this.state.copyPatternPopoverOpen}
          handlePopoverClose={this.handlePopoverClose}
          anchorEl={this.state.anchorEl}
          handlePopoverPatternSelect={this.handlePopoverPatternSelect}
        />
      </div>
    );
  }
}

/*****************************/

const mapStateToProps = state => {
  return {
    currentPatternIndex: state.currentPatternIndex,
    patternsArr: state.patternsArr
  };
};

export default connect(mapStateToProps)(PatternIndicator);
