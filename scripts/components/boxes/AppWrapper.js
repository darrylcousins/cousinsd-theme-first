import React, { useEffect, useState, useCallback } from 'react';
import {
  AppProvider,
  Banner,
} from '@shopify/polaris';
import { ApolloProvider } from '@apollo/client';
import { Query } from '@apollo/react-components';
import { Client } from '../../graphql/client'
import { LoadingTextMarkup } from '../common/LoadingTextMarkup';
import { Get } from '../common/Get';
import { App } from './App';
import {
  GET_INITIAL,
  GET_CURRENT_BOX,
} from '../../graphql/local-queries';

export const AppWrapper = () => {

  /* get current cart data */
  const LABELKEYS = ['Delivery Date', 'Including', 'Add on items', 'Removed items', 'Subscription'];
  const [delivery_date, p_in, p_add, p_dislikes, subscription] = LABELKEYS;

  const cart = Client.readQuery({
    query: GET_INITIAL,
  });
  console.log('cart', cart);

  const Loader = ({ lines }) => (
    <div style={{
      margin: '1rem 0',
      width: '100%'
    }}>
      <LoadingTextMarkup lines={lines} />
    </div>
  );

  const Error = ({ message }) => (
    <Banner status="critical">{message}</Banner>
  );

  return (
    <ApolloProvider client={Client}>
      <Get
        url='/cart.js'
      >
        {({ loading, error, response }) => {
          if (loading) return <Loader lines={4} />
          if (error) return <Error message={error.message} />
          console.log(loading, error, response);

          let cart = {
            delivered: null,
            including: [],
            addons: [],
            dislikes: [],
            shopify_title: '',
            shopify_id: 0,
            subscribed: false,
            total_price: 0,
          };

          const toHandle = (title) => title.replace(' ', '-').toLowerCase();

          if (response.items) {
            response.items.forEach((el, idx) => {
              if (el.product_type == 'Veggie Box' && window.location.pathname.split('/').indexOf(el.handle)) {
                const total_price = response.total_price; // true total including addons
                const shopify_title = el.title;
                const shopify_id = el.product_id;
                const delivered = new Date(el.properties[delivery_date]).getTime();
                const subscribed = subscription in el.properties ? true : false;
                const including = el.properties[p_in].split(',')
                  .map(el => el.trim())
                  .filter(el => el != '')
                  .map(el => toHandle(el));
                const addons = el.properties[p_add].split(',')
                  .map(el => el.trim())
                  .filter(el => el != '')
                  .map(el => toHandle(el));
                const dislikes = el.properties[p_dislikes].split(',')
                  .map(el => el.trim())
                  .filter(el => el != '')
                  .map(el => toHandle(el));
                cart = Object.assign(cart, {total_price, delivered, shopify_id, shopify_title, including, addons, dislikes, subscribed});
              };
            });
          };

          // idea is that we can use initial also for subscriptions
          const initial = cart;

          const ProxyApp = () => (
            <Query
              query={GET_CURRENT_BOX}
            >
              {({ loading, error, data }) => {
                if (loading) <Loader lines={4} />
                if (error) <Error message={error.message} />
                  //return <App initial={initial} />;
                return <div>Fuck Fuck Fuck</div>;
              }}
            </Query>
          )

          if (response) {
            Client.cache.writeQuery({ query: GET_INITIAL, data: { initial } });
            return <ProxyApp />
          };
          return <div>Fuck Fuck Fuck</div>
        }}
      </Get>
    </ApolloProvider>
  );
}

