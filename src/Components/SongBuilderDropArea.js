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

const instructionsStyling = {
  fontFamily: "'Oswald', sans-serif",
  position: 'absolute',
  width: '70vw',
  height: '80px',
  border: '1px solid black',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  pointerEvents: 'none'
};

const SongBuilderDropArea = ({
  songArr,
  onAdd,
  onUpdate,
  onChoose,
  onRemove
}) => {
  return (
    <div>
      {songArr.length === 0 ? (
        <div style={instructionsStyling}>Drop Patterns Here to Build Song</div>
      ) : (
        ''
      )}
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
    </div>
  );
};

export default SongBuilderDropArea;
