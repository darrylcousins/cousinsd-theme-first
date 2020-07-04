import React, { useEffect, useState, useCallback } from 'react';
import {
  AppProvider,
  Banner,
} from '@shopify/polaris';
import { ApolloProvider } from '@apollo/client';
import { Query } from '@apollo/react-components';
import { Client } from '../../graphql/client'
import { makeInitialState } from '../../lib';
import { Loader } from '../common/Loader';
import { Error } from '../common/Error';
import { Get } from '../common/Get';
import { App } from './App';
import {
  GET_INITIAL,
  GET_CURRENT_SELECTION,
} from '../../graphql/local-queries';

export const AppWrapper = () => {

  /* get current cart data */

  return (
    <ApolloProvider client={Client}>
      <Get
        url='/cart.js'
      >
        {({ loading, error, response }) => {
          if (loading) return <Loader lines={4} />;
          if (error) return <Error message={error.message} />;

          const path = window.location.pathname.split('/');

          // idea is that we can use initial also for subscriptions
          // this returns an empty initial state if no data
          const initial = makeInitialState({ response, path });

          if (response) {
            Client.cache.writeQuery({ query: GET_INITIAL, data: { initial } });
          };

          return <App />;
        }}
      </Get>
      <Get
        url='/admin/api/2020-04/products.json'
      >
        {({ loading, error, response }) => {
          if (loading) return <Loader lines={4} />;
          if (error) return <Error message={error.message} />;
          console.log(response);
          return null;
        }}
      </Get>
    </ApolloProvider>
  );
}

/*
const ProxyApp = () => (
  <Query
    query={GET_INITIAL}
  >
    {({ loading, error, data }) => {
      if (loading) return <Loader lines={4} />;
      if (error) return <Error message={error.message} />;
      console.log('in appwrapper data', data);
      return <div>TESTING</div>;
    }}
  </Query>
);
*/

