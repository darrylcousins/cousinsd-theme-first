import React, { useEffect, useState, useCallback } from 'react';
import {
  Banner,
  Button,
  Popover,
  ActionList,
} from '@shopify/polaris';

export const DateSelect = ({ initialData, boxes, onSelect }) => {

  /* delivery date stuff */
  const [deliveryDate, setDeliveryDate] = useState(initialData.delivered);
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
    >{ deliveryDate ? deliveryDate : 'Choose delivery date' }</Button>
  );
  /* end action select stuff */

  const handleDateSelect = (data) => {
    setDeliveryDate(data.delivered);
    setSelectActive(false);
    onSelect(data);
  };

  useEffect(() => {
    if (initialData.delivered.length > 0) {
      handleDateSelect(initialData);
    } else {
      if (boxes.length == 1) {
        const data = Object.assign(initialData, {
          delivered: new Date(parseInt(boxes[0].delivered)).toDateString(),
          shopify_id: boxes[0].shopify_id,
          box_id: boxes[0].id,
          shopify_title: boxes[0].shopify_title,
          /* reset because selected different box */
          including: [],
          dislikes: [],
          addons: [],
          quantities: [],
          subscription: '',
          is_loaded: false,
        });
        handleDateSelect(data);
      }
    }
  }, []);

  const ShowBanner = () => {
    if (!deliveryDate) {
      return (
        <div style={{ marginBottom: '1rem' }}>
          <Banner status='warning'>Please choose a date for delivery</Banner> 
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <ShowBanner />
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
                onAction: () => handleDateSelect(Object.assign(initialData, {
                  shopify_title: item.shopify_title,
                  delivered: new Date(parseInt(item.delivered)).toDateString(),
                  shopify_id: item.shopify_id,
                  box_id: item.id,
                  /* reset because selected different box */
                  including: [],
                  dislikes: [],
                  addons: [],
                  quantities: [],
                  subscription: '',
                  is_loaded: false,
                })),
              }
            ))
          }
        />
      </Popover>
    </>
  );
}



