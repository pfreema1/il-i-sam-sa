import React, { Component } from 'react';
import { connect } from 'react-redux';
import SongModePatternView from '../Components/SongModePatternView';
import ReactSortable from 'react-sortablejs';

const styling = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100vw',
  height: '30vh',
  background: 'RGBA(55, 57, 62, 1.00)'
};

class SongModePatternSelectContainer extends Component {
  render() {
    const { patternsArr } = this.props;
    return (
      <ReactSortable
        options={{
          animation: 150,
          sort: false,
          group: {
            name: 'clone1',
            pull: 'clone',
            put: false
          }
        }}
        style={styling}
      >
        {patternsArr.map((pattern, index) => (
          <SongModePatternView key={index} patternName={pattern} />
        ))}
      </ReactSortable>
    );
  }
}

function mapStateToProps(state) {
  return {
    patternsArr: state.patternsArr
  };
}

export default connect(mapStateToProps)(SongModePatternSelectContainer);
