import React from 'react';
import Dialog from 'material-ui/Dialog';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import PropTypes from 'prop-types';

const DialogStyling = {
  display: 'flex',
  // flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '720px',
  height: '350px'
};

const AddPatternDialog = (
  {
    addPatternDialogOpen,
    handleDialogClose,
    patternsArr,
    handleNewPatternClick,
    handleCopyPatternClick,
    copyPatternPopoverOpen,
    handlePopoverClose,
    anchorEl,
    handlePopoverPatternSelect
  },
  context
) => (
  <Dialog
    bodyStyle={DialogStyling}
    open={addPatternDialogOpen}
    onRequestClose={handleDialogClose}
  >
    <div>
      <h1 className="add-pattern-header">Add Pattern</h1>
    </div>
    <div>
      <RaisedButton
        label="New Pattern"
        primary={true}
        onClick={handleNewPatternClick}
        className="new-pattern-button"
        disableTouchRipple={context.mobileViewportContext}
      />
    </div>
    <div>
      <RaisedButton
        label="Copy Pattern"
        secondary={true}
        onClick={handleCopyPatternClick}
        className="copy-pattern-button"
        disableTouchRipple={context.mobileViewportContext}
      />
    </div>
    <Popover
      anchorEl={anchorEl}
      open={copyPatternPopoverOpen}
      onRequestClose={handlePopoverClose}
    >
      <Menu>
        {patternsArr.map((item, index) => (
          <MenuItem
            onClick={handlePopoverPatternSelect.bind(null, item)}
            key={index}
            value={index}
            primaryText={item}
          />
        ))}
      </Menu>
    </Popover>
  </Dialog>
);

AddPatternDialog.contextTypes = {
  mobileViewportContext: PropTypes.bool
};

export default AddPatternDialog;
