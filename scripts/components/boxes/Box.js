import React, { useEffect, useState, useCallback } from 'react';
import {
  Banner,
  Button,
  Icon,
  Frame,
} from '@shopify/polaris';
import { Query } from 'react-apollo';
import { LoadingTextMarkup } from '../common/LoadingTextMarkup';
import { BoxListing } from './BoxListing';
import {
  GET_BOX,
} from '../../graphql/queries';

export const Box = ({ id, title, delivered }) => {

  const input = { id };

  return (
      <Query
        query={GET_BOX}
        variables={{ input }}
        fetchPolicy='cache'
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
            <React.Fragment>
              <div style={{
                margin: '1rem 0',
                display: 'flex',
                width: '100%',
                position: 'relative',
              }}>
                <BoxListing
                  title={title}
                  delivered={delivered}
                  productList={products}
                  addOnProductList={addOnProducts}
                />
              </div>
            </React.Fragment>
          )
        }}
      </Query>
  );
}
