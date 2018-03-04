import React from 'react';
import { connect } from 'react-redux';
import './ModeSelector.css';
import ModeSelectorView from '../Components/Toolbar/ModeSelectorView';

class ModeSelector extends React.Component {
  handleModeSelectorClick = mode => {
    this.props.dispatch({ type: 'MODE_SELECTOR_CLICKED', mode: mode });
  };

  render() {
    return (
      <ModeSelectorView
        handleModeSelectorClick={this.handleModeSelectorClick}
        UiMode={this.props.UiMode}
      />
    );
  }
}

/*****************************/

const mapStateToProps = state => {
  return {
    UiMode: state.UiMode
  };
};

export default connect(mapStateToProps)(ModeSelector);
