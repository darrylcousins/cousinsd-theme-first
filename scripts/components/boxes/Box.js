import React from 'react';
import { Query } from '@apollo/react-components';
import { ProductList } from './ProductList';
import { SelectDislikes } from './SelectDislikes';
import { Loader } from '../common/Loader';
import { Error } from '../common/Error';
import { Get } from '../common/Get';
import {
  GET_CURRENT_SELECTION,
} from '../../graphql/local-queries';

export const Box = ({ loaded, ids }) => {

  if (!loaded) return null;

  return (
    <Query
      query={GET_CURRENT_SELECTION}
    >
      {({ loading, error, data }) => {
        if (loading) return <Loader lines={2} />;
        if (error) return <Error message={error.message} />;
        const current = data.current;
        const url = `/admin/api/2020-04/products.json?${ids.join(',')}`;
        return (
          <Get
            url={url}
          >
            {({ loading, error, response }) => {
              if (loading) return <Loader lines={2} />;
              if (error) return <Error message={error.message} />;
              console.log(response);
              console.log(current);

              return (
                <>
                  <ProductList type='including' />
                  <SelectDislikes />
                  <ProductList type='dislikes' />
                  <ProductList type='exaddons' />
                </>
              );
           }}
          </Get>
        );
      }}
    </Query>
  );
};
