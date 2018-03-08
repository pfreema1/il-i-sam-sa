import React, { Component } from 'react';
import { connect } from 'react-redux';
import SongBuilderDropArea from '../Components/SongBuilderDropArea';

const styling = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '70vh'
};

class SongBuilderContainer extends Component {
  render() {
    const { songArr } = this.props;

    return (
      <div style={styling}>
        <SongBuilderDropArea songArr={songArr} />
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    songArr: state.songArr
  };
}

export default connect(mapStateToProps)(SongBuilderContainer);
