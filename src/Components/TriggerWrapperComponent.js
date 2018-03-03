import React from 'react';
import { ContextMenuTrigger } from 'react-contextmenu';
import Trigger from '../Trigger';

const TriggerWrapperComponent = ({
  sequencerToRender,
  returnSlicedTriggers,
  sequencerId
}) => (
  <div className="sequencer__trigger-wrapper">
    {sequencerToRender.triggers.map(trigger => {
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
          </ContextMenuTrigger>
        );
      }
    })}
  </div>
);

export default TriggerWrapperComponent;
