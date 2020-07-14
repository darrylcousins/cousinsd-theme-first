import React, { useState, useCallback } from 'react';
import {
  ActionList,
  Button,
  Popover,
} from '@shopify/polaris';
import { SUBSCRIPTIONS } from '../../config';

export const Subscription = ({ state, handleChange }) => {

  const [popoverActive, setPopoverActive] = useState(false);
  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    [],
  );

  const [subscription, setSubscription] = useState(state);
  const onetime = 'One time purchase (default)';
  const options = SUBSCRIPTIONS;

  const setSubscriptionChange = (value) => {
    setSubscription(value);
    handleChange(value);
    togglePopoverActive();
  }

  return (
    <Popover
      fullWidth
      fluidContent={true}
      active={popoverActive}
      onClose={togglePopoverActive}
      activator={(
        <Button
          fullWidth
          onClick={togglePopoverActive}
          disclosure={!popoverActive ? 'down' : 'up'}
          >
            { subscription ? subscription : 'Subscription options'}
        </Button>
      )}>
      <ActionList
        items={ [{ content: onetime, onAction: () => setSubscriptionChange(onetime) }].concat(options.map((el) => {
          return { 
            content: el, 
            onAction: () => setSubscriptionChange(el),
          }
        }))}
      />
    </Popover>
  );
}
