import React from 'react';
import {
  Badge,
  Stack,
  Spinner,
  Subheading,
} from '@shopify/polaris';
import { Query } from '@apollo/react-components';
import { Loader } from '../common/Loader';
import { Error } from '../common/Error';
import { Product } from './Product';
import { ProductIncluded } from './ProductIncluded';
import { ProductDislike } from './ProductDislike';
import { ProductExaddon } from './ProductExaddon';
import {
  GET_CURRENT_SELECTION,
} from '../../graphql/local-queries';

export const ProductList = ({ type }) => {
  
  console.log(type);
  let status;
  let title;

  switch(type) {
    case 'including':
      status = 'success';
      title = 'box products';
      break;
    case 'dislikes':
      status = 'warning';
      title = 'dislikes';
      break;
    case 'exaddons':
      status = 'attention';
      title = 'available addons';
      break;
  }

  return (
    <Query
      query={GET_CURRENT_SELECTION}
    >
      {({ loading, error, data }) => {
        if (loading) return <Loader lines={2} />;
        if (error) return <Error message={error.message} />;
        if (type === 'including') {
           var products = data.current.including.concat(data.current.addons);
        } else {
          var products = data.current[type];
        };
        console.log(type, products);

        return (
          <div style={{ margin: '1em 0 1em 0' }}>
            <Subheading>{title}</Subheading>
            <Stack
              spacing='extraTight'
            >
              { products.map(el => <Product key={el.id} product={el} type={type} /> ) }
            </Stack>
          </div>
        );
      }}
    </Query>
  );
}
// products.map((el) => <Product key={el.id} product={el} type={type} /> )
