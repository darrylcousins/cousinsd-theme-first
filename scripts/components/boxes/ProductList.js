import React, { useEffect, useState, useCallback } from 'react';
import {
  Banner,
  Spinner,
  Stack,
  Subheading,
} from '@shopify/polaris';
import { Query } from '@apollo/react-components';
import { LoadingTextMarkup } from '../common/LoadingTextMarkup';
import {
  GET_CURRENT_BOX,
  GET_INITIAL,
} from '../../graphql/local-queries';

export const ProductList = ({ key, type }) => {
  
  //console.log(products);
  let status;
  let query;

  switch(type) {
    case 'boxproducts':
      status = 'info';
      query = GET_CURRENT_BOX;
      break;
    case 'included':
      status = 'success';
      query = GET_INITIAL;
      break;
    case 'dislikes':
      status = 'warning';
      query = GET_DISLIKES;
      break;
    case 'exaddons':
      status = 'attention';
      query = GET_EX_ADDONS;
      break;
  }

  const products = [];

  return (
    <Query
      query={query}
    >
      {({ loading, error, data, refetch }) => {
        if (loading) { 
          return (
              <LoadingTextMarkup lines={1} />
          );
        };
        if (error) { return (
          <Banner status="critical">{error.message}</Banner>
        )};

        console.log(data);

        return (
          <div style={{ margin: '1em 0 1em 0' }}>
            <Subheading>{type}</Subheading>
            <Stack
              spacing='extraTight'
            >
                { products.map((el) => (
                  <Badge
                    key={ el.id }
                    status={status}
                  >{ el.title }</Badge> )
                )
              }
            </Stack>
          </div>
        );

      }}
    </Query>
  );
}

