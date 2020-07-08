import React from 'react';
import {
  Stack,
  Subheading,
} from '@shopify/polaris';
import { Query } from '@apollo/react-components';
import styled from 'styled-components';
import { Loader } from '../common/Loader';
import { Error } from '../common/Error';
import { Spacer } from '../common/Spacer';
import { Product } from './Product';
import {
  GET_CURRENT_SELECTION,
} from '../../graphql/local-queries';

const ListWrapper = styled.div` 
  margin: 1em 0;
  border-bottom: 1px silver solid;
  padding-bottom: 1em;
`;

export const ProductList = ({ type }) => {
  
  let title;
  let status;

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

        const products = type === 'including'
          ? data.current.including.concat(data.current.addons)
          : data.current[type]

        if (products.length) {
          return (
            <ListWrapper>
              <Subheading>{title}</Subheading>
              <Spacer />
              <Stack
                spacing='extraTight'
              >
                { products.map(el => <Product key={el.id} product={el} type={type} data={data} /> ) }
              </Stack>
            </ListWrapper>
          );
        } else {
          return (
            <div style={{ marginBottom: '1rem' }}>
              &nbsp;
            </div>
          );
        }
      }}
    </Query>
  );
}
// products.map((el) => <Product key={el.id} product={el} type={type} /> )
