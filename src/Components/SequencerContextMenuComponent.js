import React from 'react';
import { ContextMenu, MenuItem } from 'react-contextmenu';

const SequencerContextMenuComponent = ({
  sequencerId,
  handleMenuItemClick,
  handleSliceMenuItemClick,
  handleUnSliceMenuItemClick
}) => (
  <ContextMenu id={'triggerMenu' + sequencerId}>
    <MenuItem onClick={handleMenuItemClick} data={{ item: 0 }}>
      note
    </MenuItem>
    <MenuItem onClick={handleMenuItemClick} data={{ item: 1 }}>
      velocity
    </MenuItem>
    <MenuItem onClick={handleMenuItemClick} data={{ item: 2 }}>
      duration
    </MenuItem>
    <MenuItem onClick={handleMenuItemClick} data={{ item: 3 }}>
      nudge
    </MenuItem>
    <MenuItem divider />
    <MenuItem onClick={handleSliceMenuItemClick} data={{ item: 4 }}>
      slice
    </MenuItem>
    <MenuItem onClick={handleUnSliceMenuItemClick} data={{ item: 5 }}>
      un-slice
    </MenuItem>
  </ContextMenu>
);

export default SequencerContextMenuComponent;
