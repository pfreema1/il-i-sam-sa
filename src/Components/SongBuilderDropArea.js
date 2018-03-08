import React from 'react';
import SongModePatternView from './SongModePatternView';
import ReactSortable from 'react-sortablejs';

const styling = {
  height: '150px',
  width: '70vw',
  border: '5px solid black',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center'
};

const SongBuilderDropArea = ({ songArr, onAdd, onUpdate }) => {
  return (
    <ReactSortable
      style={styling}
      options={{
        animation: 150,
        group: {
          name: 'clone1',
          pull: false,
          put: true
        },
        onAdd: onAdd,
        onUpdate: onUpdate
      }}
    >
      {/*songArr.map((pattern, index) => {
        return <SongModePatternView key={index} patternName={pattern} />;
      })*/}
    </ReactSortable>
  );
};

export default SongBuilderDropArea;
