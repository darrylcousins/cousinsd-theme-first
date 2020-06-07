import React, { useEffect, useState, useCallback } from 'react';
import {
  Banner,
  Button,
  Frame,
} from '@shopify/polaris';
import { Query } from 'react-apollo';
import { LoadingTextMarkup } from '../common/LoadingTextMarkup';
import { BoxListing } from './BoxListing';
import {
  GET_BOX,
} from '../../graphql/queries';

export const Box = ({ id }) => {

  const input = { id };

  return (
      <Query
        query={GET_BOX}
        variables={{ input }}
        fetchPolicy='no-cache'
      >
        {({ loading, error, data, refetch }) => {
          if (loading) { 
            return (
              <div style={{ margin: '1rem 0', width: '100%' }}>
                <LoadingTextMarkup lines={8} />
              </div>
            );
          }
          if (error) { return (
            <Banner status="critical">{error.message}</Banner>
          )}

          const products = data.getBox.products
            .filter(item => item.available);
          const addOnProducts = data.getBox.addOnProducts
            .filter(item => item.available);

          return (
            <BoxListing productList={products} addOnProductList={addOnProducts} />
          )
        }}
      </Query>
  );
}
