import React, { Component } from 'react';
import { connect } from 'react-redux';
import SongBuilderDropArea from '../Components/SongBuilderDropArea';
import SongBuilderOptionsArea from './SongBuilderOptionsArea';

const styling = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '70vh'
};

/*****************************/

class SongBuilderContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedPattern: ''
    };
  }
  printIds = els => {
    for (let i = 0; i < els.length; i++) {
      console.log('at ' + i + ':  ' + els[i].id);
    }
  };

  returnIdList = els => {
    //convert html collection to array
    els = Array.from(els);
    return els.map(el => el.id);
  };

  onAddFn = evt => {
    const listIdArr = this.returnIdList(evt.to.children);
    this.props.dispatch({ type: 'SONG_UPDATED', listIdArr });
  };

  onChoose = evt => {
    this.props.dispatch({
      type: 'SONG_MODE_PATTERN_SELECTED',
      sequenceInSongIndex: evt.oldIndex,
      patternName: evt.item.id,
      patternDomRef: evt.item
    });
  };

  //changed sorting within list
  onUpdateFn = evt => {
    const listIdArr = this.returnIdList(evt.to.children);
    this.props.dispatch({ type: 'SONG_UPDATED', listIdArr });
  };

  render() {
    const { songArr } = this.props;

    return (
      <div style={styling}>
        <SongBuilderDropArea
          onAdd={this.onAddFn}
          onUpdate={this.onUpdateFn}
          songArr={songArr}
          onChoose={this.onChoose}
        />
        <SongBuilderOptionsArea />
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
