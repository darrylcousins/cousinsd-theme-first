import React, { useEffect, useState, useCallback } from 'react';
import {
  Button,
  Popover,
  ActionList,
} from '@shopify/polaris';
import { Query } from 'react-apollo';

export const DateSelect = ({ boxes, onSelect }) => {

  /* delivery date stuff */
  const [deliveryDate, setDeliveryDate] = useState(null);
  /* end delivery date stuff */

  /* action select stuff */
  const [selectActive, setSelectActive] = useState(false);
  const toggleSelectActive = useCallback(
    () => setSelectActive((selectActive) => !selectActive),
    [],
  );
  const activator = (
    <Button
      onClick={toggleSelectActive}
      disclosure
      fullWidth
    >{ deliveryDate ? new Date(parseInt(deliveryDate)).toDateString() : 'Choose delivery date' }</Button>
  );
  /* end action select stuff */

  const handleDateSelect = ({ delivered, id }) => {
    console.log('selected', new Date(parseInt(delivered)).toDateString());
    setDeliveryDate(delivered);
    setSelectActive(false);
    onSelect({ delivered, id });
  };

  useEffect(() => {
    if (boxes.length == 1) {
      handleDateSelect({
        delivered: boxes[0].delivered,
        id: boxes[0].id,
      });
    };
  }, [boxes]);

  return (
    <Popover
      fullWidth
      active={selectActive}
      activator={activator}
      onClose={toggleSelectActive}
    >
      <ActionList
        items={
          boxes.map(item => (
            {
              content: new Date(parseInt(item.delivered)).toDateString(),
              onAction: () => handleDateSelect({ delivered: item.delivered, id: item.id }),
            }
          ))
        }
      />
    </Popover>
  );
}



