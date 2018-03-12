import React from "react";
import { connect } from "react-redux";
import PatternIndicatorView from "../Components/Toolbar/PatternIndicatorView";
import "./PatternIndicator.css";
import "../Components/AddPatternDialog";
import AddPatternDialog from "../Components/AddPatternDialog";

class PatternIndicator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      addPatternDialogOpen: false,
      copyPatternPopoverOpen: false
    };
  }

  handlePatternChange = (e, index, value) => {
    this.props.dispatch({ type: "PATTERN_CHANGED", patternIndex: value });
  };

  handleAddPatternClick = () => {
    this.setState({
      addPatternDialogOpen: true
    });
  };

  handleDialogClose = () => {
    this.setState({
      addPatternDialogOpen: false
    });
  };

  handleNewPatternClick = () => {
    this.props.dispatch({ type: "BLANK_PATTERN_ADDED" });

    this.handleDialogClose();
  };

  handleCopyPatternClick = e => {
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
    this.props.dispatch({ type: "BLANK_PATTERN_ADDED" });
    this.props.dispatch({
      type: "COPIED_PATTERN_ADDED",
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
