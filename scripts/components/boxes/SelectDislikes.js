import React, { useState, useCallback } from 'react';
import {
  ActionList,
  Button,
  Popover,
} from '@shopify/polaris';
import { Query } from '@apollo/react-components';
import { Loader } from '../common/Loader';
import { Error } from '../common/Error';
import { Client } from '../../graphql/client'
import { GET_CURRENT_SELECTION } from '../../graphql/local-queries';

export const SelectDislikes = () => {
  
  /* XXX products are current.including */
  
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
    >Select items you&apos;d prefer not to receive</Button>
  );
  /* end action select stuff */

  const handleAction = ({ product, data }) => {
    toggleSelectActive();
    const current = { ...data.current };
    current.including = current.including.filter(el => el.id !== product.id);
    current.dislikes = current.dislikes.concat([product]);
    Client.writeQuery({ 
      query: GET_CURRENT_SELECTION,
      data: { current },
    });
  };

  return (
    <Query
      query={GET_CURRENT_SELECTION}
    >
      {({ loading, error, data }) => {
        if (loading) return <Loader lines={2} />;
        if (error) return <Error message={error.message} />;
        const products = data.current.including;

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
                    onAction: () => handleAction({ product, data }),
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
