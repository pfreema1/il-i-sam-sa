import React from 'react';
import { ContextMenuTrigger } from 'react-contextmenu';
import Trigger from '../Containers/Trigger';
import { Tooltip } from 'react-tippy';
import TriggerHoverComponent from './TriggerHoverComponent';

const TriggerWrapperComponent = ({
  sequencerToRender,
  returnSlicedTriggers,
  sequencerId,
  triggersToRender,
  handleMenuItemClick,
  handleSliceMenuItemClick,
  handleUnSliceMenuItemClick
}) => (
  <div className="sequencer__trigger-wrapper">
    {triggersToRender &&
      triggersToRender.map(trigger => {
        if (trigger.isSliced) {
          return returnSlicedTriggers(trigger);
        } else {
          return (
            <ContextMenuTrigger
              key={trigger.id}
              id={'triggerMenu' + sequencerId}
              //this is passed in as data to MenuItem
              attributes={{ id: trigger.id }}
              collect={props => props}
              holdToDisplay={1000}
              disable="true"
            >
              <Tooltip
                html={
                  <TriggerHoverComponent
                    handleMenuItemClick={handleMenuItemClick}
                    handleSliceMenuItemClick={handleSliceMenuItemClick}
                    handleUnSliceMenuItemClick={handleUnSliceMenuItemClick}
                    triggerId={trigger.id}
                  />
                }
                position="bottom"
                trigger="mouseenter"
                interactive="true"
                unmountHTMLWhenHide="true"
                hideOnClick="false"
              >
                <Trigger
                  sequencerId={sequencerId}
                  id={trigger.id}
                  parentTriggerId={null}
                  key={trigger.id}
                  width={'100%'}
                  height={'100%'}
                  isSlicee={false}
                  barStarter={trigger.id % 4 === 0 ? true : false}
                />
              </Tooltip>
            </ContextMenuTrigger>
          );
        }
      })}
  </div>
);

export default TriggerWrapperComponent;
