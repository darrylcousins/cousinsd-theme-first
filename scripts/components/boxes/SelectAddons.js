import React, { useState, useCallback } from 'react';
import {
  ActionList,
  Button,
  Popover,
} from '@shopify/polaris';
import { Query } from '@apollo/react-components';
import { Client } from '../../graphql/client'
import { Loader } from '../common/Loader';
import { Error } from '../common/Error';
import { nameSort, numberFormat, updateTotalPrice } from '../../lib';
import { GET_CURRENT_SELECTION } from '../../graphql/local-queries';

export const SelectAddons = () => {
  
  /* XXX products are current.exaddons */
  
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
    >Select items you&apos;d like to add to the box</Button>
  );
  /* end action select stuff */

  const handleAction = ({ product }) => {
    const data = Client.readQuery({ 
      query: GET_CURRENT_SELECTION,
    });
    toggleSelectActive();
    const current = { ...data.current };
    current.exaddons = current.exaddons.filter(el => el.id !== product.id);
    current.addons = current.addons.concat([product]);
    current.addons.sort(nameSort);
    Client.writeQuery({ 
      query: GET_CURRENT_SELECTION,
      data: { current },
    });

    updateTotalPrice();
  };

  return (
    <Query
      query={GET_CURRENT_SELECTION}
    >
      {({ loading, error, data }) => {
        if (loading) return <Loader lines={2} />;
        if (error) return <Error message={error.message} />;
        const products = data.current.exaddons;

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
                    content: `${product.title} ${numberFormat(product.shopify_price*0.01)}`,
                    onAction: () => handleAction({ product }),
                  }
                ))
              }
            />
          </Popover>
        );
      }}
    </Query>
  );
}



