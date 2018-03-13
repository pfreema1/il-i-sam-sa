import React from 'react';
import ReactSortable from 'react-sortablejs';

const styling = {
  height: '150px',
  width: '70vw',
  border: '5px solid black',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center'
};

const SongBuilderDropArea = ({ songArr, onAdd, onUpdate, onChoose }) => {
  return (
    <ReactSortable
      id="songBuilderDropArea"
      style={styling}
      options={{
        animation: 150,
        group: {
          name: 'clone1',
          pull: true,
          put: true
        },
        onAdd: onAdd,
        onUpdate: onUpdate,
        onChoose: onChoose
      }}
    />
  );
};

export default SongBuilderDropArea;
