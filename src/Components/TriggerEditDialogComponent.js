import React from 'react';
import Dialog from 'material-ui/Dialog';
import { Tabs, Tab } from 'material-ui/Tabs';
import Velocity from '../Containers/Velocity';
// import TriggerEditNote from '../TriggerEditNote';
import DurationContainer from '../Containers/DurationContainer';
import NudgeContainer from '../Containers/NudgeContainer';

const TriggerEditDialogComponent = ({
  isEditingTrigger,
  handleDialogClose,
  menuItemClicked
}) => (
  <Dialog
    open={isEditingTrigger}
    onRequestClose={handleDialogClose}
    autoScrollBodyContent={true}
    className="dialog-root"
  >
    <Tabs initialSelectedIndex={menuItemClicked}>
      {/* <Tab label="note">
        <TriggerEditNote />
      </Tab> */}
      <Tab label="velocity">
        <Velocity />
      </Tab>
      <Tab label="duration">
        <DurationContainer />
      </Tab>
      <Tab label="Nudge">
        <NudgeContainer />
      </Tab>
    </Tabs>
  </Dialog>
);

export default TriggerEditDialogComponent;
