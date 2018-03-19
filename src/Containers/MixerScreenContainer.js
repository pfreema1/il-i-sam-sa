import React, { Component } from 'react';
import { connect } from 'react-redux';
import Drawer from 'material-ui/Drawer';

const styling = {
  top: '60px', //height of toolbar
  background: 'yellow'
};

class MixerScreenContainer extends Component {
  render() {
    return (
      <Drawer
        containerStyle={styling}
        width={'100%'}
        open={this.props.UiMode === 'mixer'}
      >
        <div>foo</div>
      </Drawer>
    );
  }
}

function mapStateToProps(state) {
  return {
    UiMode: state.UiMode
  };
}

export default connect(mapStateToProps)(MixerScreenContainer);
