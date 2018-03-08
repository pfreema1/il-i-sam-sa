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
    /*
      var itemEl = evt.item;  // dragged HTMLElement
      evt.to;    // target list
      evt.from;  // previous list
      evt.oldIndex;  // element's old index within old parent
      evt.newIndex;  // element's new index within new parent
      evt.item.id // elements' id
      evt.to.children[X].id //id of sorted list at X
    */
    // this.printIds(evt.to.children);
    const listIdArr = this.returnIdList(evt.to.children);
    this.props.dispatch({ type: 'SONG_UPDATED', listIdArr });
  };

  //changed sorting within list
  onUpdateFn = evt => {
    // this.printIds(evt.to.children);
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
        />
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
