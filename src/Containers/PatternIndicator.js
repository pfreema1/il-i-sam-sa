import React from 'react';
import { connect } from 'react-redux';
import PatternIndicatorView from '../Components/Toolbar/PatternIndicatorView';
import './PatternIndicator.css';

class PatternIndicator extends React.Component {
  handlePatternChange = (e, index, value) => {
    this.props.dispatch({ type: 'PATTERN_CHANGED', patternIndex: value });
  };

  handleAddPatternClick = () => {
    this.props.dispatch({ type: 'PATTERN_ADDED' });
  };

  render() {
    return (
      <PatternIndicatorView
        currentPatternIndex={this.props.currentPatternIndex}
        handlePatternChange={this.handlePatternChange}
        handleAddPatternClick={this.handleAddPatternClick}
        patternsArr={this.props.patternsArr}
      />
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
