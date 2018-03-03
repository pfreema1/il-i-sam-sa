import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';

const FileDragLoadingComponent = () => (
  <div className="file-drag-container__loading">
    <CircularProgress size={80} thickness={7} />
    <h1>Loading Sample</h1>
  </div>
);

export default FileDragLoadingComponent;
