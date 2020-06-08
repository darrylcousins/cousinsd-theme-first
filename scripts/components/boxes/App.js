import React, { useEffect, useState, useCallback } from 'react';
import {
  AppProvider,
  Banner,
  Card,
  Frame,
  Spinner,
} from '@shopify/polaris';
import { ApolloProvider } from '@apollo/react-hooks';
import { Query } from 'react-apollo';
import Client from '../../graphql/client'
import { SHOP, SHOP_ID } from '../../config';
import { LoadingTextMarkup } from '../common/LoadingTextMarkup';
import { DateSelect } from './DateSelect';
import { Box } from './Box';
import { Get } from '../common/Get';
import {
  GET_BOXES,
} from '../../graphql/queries';

export const App = () => {

  /* get some existing form elements */
  const form = document.querySelector('form[action="/cart/add"]');
  const button = document.querySelector('button[name="add"]');

  // get the selected product id
  const shopify_id = form.getAttribute('id').split('_')[2];
  const input = {
    shopify_id: parseInt(shopify_id),
    shopId: SHOP_ID,
  };
  /* end get the add form on page */

  /* boxes stuff */
  const [delivered, setDelivered] = useState(null);
  const [id, setId] = useState(0);
  /* end boxes stuff */

  return (
    <AppProvider>
      <ApolloProvider client={Client}>
        <Query
          query={GET_BOXES}
          variables={{ input }}
          fetchPolicy='no-cache'
        >
          {({ loading, error, data, refetch }) => {
            if (loading) { 
              return (
                <div style={{
                  margin: '1rem 0',
                  width: '100%'
                }}>
                  <LoadingTextMarkup lines={4} />
                </div>
              );
            };
            if (error) { return (
              <Banner status="critical">{error.message}</Banner>
            )};

            const handleSelect = ({ delivered, id }) => {
              setDelivered(delivered);
              setId(id);
              button.removeAttribute('disabled');
            };

            const boxes = data.getBoxesByShopifyId;

            return (
              <div style={{
                paddingBottom: '1rem',
                width: '100%',
                height: '100%',
                position: 'relative',
              }}>
                { !delivered && (
                  <div style={{ marginBottom: '1rem' }}>
                    <Banner status='warning'>Please choose a date for delivery</Banner> 
                  </div>
                )}
                <DateSelect boxes={data.getBoxesByShopifyId} onSelect={handleSelect} />
                { delivered && id && <Box id={ id } /> }
              </div>
            );
          }}
        </Query>
      </ApolloProvider>
    </AppProvider>
  );
}

  /*
  <Get
    url={`${SHOP}/cart.js`}
  >
    {({ loading, error, response }) => {
      if (loading) return <Spinner />
      if (error) return <Banner status='critical'>{ JSON.stringify(error, null, 2) }></Banner>
      if (response) return <pre>{JSON.stringify(response, null, 2)}</pre>
    }}
  </Get>
  */
