import React from 'react';
import { ContextMenuTrigger } from 'react-contextmenu';
import Trigger from '../Containers/Trigger';
import { Tooltip } from 'react-tippy';
import TriggerHoverContainer from '../Containers/TriggerHoverContainer';

const TriggerWrapperComponent = ({
  sequencerToRender,
  returnSlicedTriggers,
  sequencerId,
  triggersToRender
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
            >
              <Tooltip
                html={<TriggerHoverContainer />}
                useContext
                position="bottom"
                trigger="mouseenter"
                interactive="true"
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
