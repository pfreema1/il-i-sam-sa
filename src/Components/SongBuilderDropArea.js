import React from 'react';
import ReactSortable from 'react-sortablejs';

const styling = {
  height: '80px',
  width: '70vw',
  // border: '5px solid black',
  background: 'RGBA(207, 193, 184, 1.00)',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  borderRadius: '2px'
};

const SongBuilderDropArea = ({
  songArr,
  onAdd,
  onUpdate,
  onChoose,
  onRemove
}) => {
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
        onChoose: onChoose,
        onRemove: onRemove
      }}
    />
  );
};

export default SongBuilderDropArea;
