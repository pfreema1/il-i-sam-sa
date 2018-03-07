import React from 'react';
import Dialog from 'material-ui/Dialog';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';

const DialogStyling = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '720px',
  height: '350px'
};

const AddPatternDialog = ({
  addPatternDialogOpen,
  handleDialogClose,
  patternsArr,
  handleNewPatternClick,
  handleCopyPatternClick,
  copyPatternPopoverOpen,
  handlePopoverClose,
  anchorEl,
  handlePopoverPatternSelect
}) => (
  <Dialog
    bodyStyle={DialogStyling}
    open={addPatternDialogOpen}
    onRequestClose={handleDialogClose}
  >
    <h1>Add Pattern</h1>
    <RaisedButton
      label="New Pattern"
      primary={true}
      onClick={handleNewPatternClick}
    />
    <RaisedButton
      label="Copy Pattern"
      secondary={true}
      onClick={handleCopyPatternClick}
    />
    <Popover
      anchorEl={anchorEl}
      open={copyPatternPopoverOpen}
      onRequestClose={handlePopoverClose}
    >
      <Menu>
        {patternsArr.map((item, index) => (
          <MenuItem
            onClick={handlePopoverPatternSelect.bind(null, item.name)}
            key={index}
            value={index}
            primaryText={item.name}
          />
        ))}
      </Menu>
    </Popover>
  </Dialog>
);

export default AddPatternDialog;
