import React, { useEffect, useState, useCallback } from 'react';
import {
  ActionList,
  Button,
  Popover,
} from '@shopify/polaris';
import { Query } from '@apollo/react-components';

export const SelectDislikes = ({ products }) => {
  
  console.log(products);

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
    >Select items you'd prefer not to receive</Button>
  );
  /* end action select stuff */

  const handleAction = (product) => {
    toggleSelectActive();
    console.log(product);
  };

  return (
    <Popover
      fullWidth
      active={selectActive}
      activator={activator}
      onClose={toggleSelectActive}
    >
      <ActionList
        items={
          products.map(product => (
            {
              content: product.title,
              onAction: () => handleAction(product.title),
            }
          ))
        }
      />
    </Popover>
  );
}


