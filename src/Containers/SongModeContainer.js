import React, { Component } from 'react';
import { connect } from 'react-redux';
import Drawer from 'material-ui/Drawer';
import SongModePatternSelectContainer from './SongModePatternSelectContainer';
import SongBuilderContainer from './SongBuilderContainer';

const styling = {
  top: '60px' //height of toolbar
};

class SongModeContainer extends Component {
  render() {
    return (
      <Drawer
        containerStyle={styling}
        width={'100%'}
        open={this.props.UiMode === 'song'}
      >
        <SongModePatternSelectContainer />
        <SongBuilderContainer />
      </Drawer>
    );
  }
}

function mapStateToProps(state) {
  return {
    UiMode: state.UiMode
  };
}

export default connect(mapStateToProps)(SongModeContainer);
