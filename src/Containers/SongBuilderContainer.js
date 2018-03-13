import React, { Component } from 'react';
import { connect } from 'react-redux';
import SongBuilderDropArea from '../Components/SongBuilderDropArea';

const styling = {
  display: 'flex',
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

  onChoose = evt => {
    this.props.dispatch({
      type: 'SONG_MODE_PATTERN_SELECTED',
      sequenceInSongIndex: evt.oldIndex,
      patternName: evt.item.id
    });

    //set style here for the selected elem and iterate through the other elements and set their styles?
    //evt.target.children = all nodes
    //evt.item = selected node

    // Array.from(evt.target.children).forEach((elem, index) => {
    //   let nodeElem = evt.target.children.item(index);
    //   nodeElem.classList.remove('selected-pattern');
    // });

    // evt.item.classList.add('selected-pattern');
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
          onChoose={this.onChoose}
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
