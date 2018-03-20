import React from 'react';
import { Card } from 'material-ui/Card';
import { VelocityComponent } from 'velocity-react';
import SequencerBrain from '../Containers/SequencerBrain';
import SequencerContextMenuComponent from '../Components/SequencerContextMenuComponent';
import TriggerEditDialogComponent from '../Components/TriggerEditDialogComponent';
import TriggerWrapperComponent from './TriggerWrapperComponent';

const CardParentStyle = {
  width: '100vw',
  minWidth: '950px'
};

const CardContainerStyle = {
  width: '100vw',
  minWidth: '950px',

  padding: '10px 0 10px 0'
};

const SequencerComponent = ({
  sequencerId,
  returnSlicedTriggers,
  sequencerToRender,
  handleMenuItemClick,
  handleSliceMenuItemClick,
  handleUnSliceMenuItemClick,
  isEditingTrigger,
  handleDialogClose,
  menuItemClicked,
  triggersToRender
}) => (
  <Card
    className="sequencer-card"
    containerStyle={CardContainerStyle}
    style={CardParentStyle}
  >
    <VelocityComponent
      runOnMount={true}
      animation={'transition.slideLeftIn'}
      duration={1000}
    >
      <div>
        <SequencerBrain sequencerId={sequencerId} />
        <TriggerWrapperComponent
          sequencerToRender={sequencerToRender}
          returnSlicedTriggers={returnSlicedTriggers}
          sequencerId={sequencerId}
          triggersToRender={triggersToRender}
          handleMenuItemClick={handleMenuItemClick}
          handleSliceMenuItemClick={handleSliceMenuItemClick}
          handleUnSliceMenuItemClick={handleUnSliceMenuItemClick}
        />
      </div>
    </VelocityComponent>

    <SequencerContextMenuComponent
      sequencerId={sequencerId}
      handleMenuItemClick={handleMenuItemClick}
      handleSliceMenuItemClick={handleSliceMenuItemClick}
      handleUnSliceMenuItemClick={handleUnSliceMenuItemClick}
    />

    <TriggerEditDialogComponent
      isEditingTrigger={isEditingTrigger}
      handleDialogClose={handleDialogClose}
      menuItemClicked={menuItemClicked}
    />
  </Card>
);

export default SequencerComponent;
