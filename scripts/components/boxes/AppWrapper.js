import React, { useEffect } from 'react';
import { ApolloProvider } from '@apollo/client';
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
import { SUBSCRIPTIONS, LABELKEYS } from '../../config';

export const AppWrapper = () => {

  const shopify_id = parseInt(document.querySelector('form[action="/cart/add"]')
    .getAttribute('id').split('_')[2]);

  function postFetch(url, data) {
    console.log('sending to ', url,  data);
    return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }
    );
  }

  useEffect(() => {
    // get some page elements
    const form = document.querySelector('form[action="/cart/add"]');
    form.removeAttribute('action');
    const button = document.querySelector('button[name="add"]');
    button.removeAttribute('type');
    const buttonLoader = button.querySelector('span[data-loader]');
    const cartIcon = document.querySelector('div[data-cart-count-bubble');
    const cartCount = cartIcon.querySelector('span[data-cart-count]');
    const cartPopup = document.querySelector('div[data-cart-popup-wrapper');
    const cartPopupCount= cartPopup.querySelector('span[data-cart-popup-quantity]');
    const cartPopupCountCart = cartPopup.querySelector('span[data-cart-popup-cart-quantity]');
    let initialCount = parseInt(cartCount.innerHTML.trim());
    if (isNaN(initialCount)) initialCount = 0;

    const submitHandler = (e) => {
      buttonLoader.classList.remove('hide');
      var select = form.elements.id;
      var option = select.options[select.selectedIndex]

      const { current } = Client.readQuery({
        query: GET_CURRENT_SELECTION,
      });
      const { initial } = Client.readQuery({
        query: GET_INITIAL,
      });

      const title = current.box.shopify_title;
      const delivered = current.delivered;
      const items = [];

      current.addons.forEach((el) => {
        items.push({
          quantity: el.quantity,
          id: el.shopify_variant_id.toString(),
          properties: {
            'Delivery Date': `${delivered}`,
            'Add on product to': `${title}`
          }
        });
      });

      const addons = current.addons.map(el => el.title).join(', ');
      const removed = current.dislikes.map(el => el.title).join(', ');
      const including = current.including.map(el => el.title).join(', ');

      let properties = {
        'Delivery Date': `${delivered}`,
        'Including': including,
        'Add on items': addons,
        'Removed items': removed,
      }
      
      const subscription = current.subscription;
      if (SUBSCRIPTIONS.indexOf(subscription) > -1) {
        properties['Subscription'] = subscription;
      }

      items.push({
        quantity: 1,
        id: option.value,
        properties: properties,
      });

      const onFinish = (data, items) => {
        console.log('returned from post to cart', data);
        cartIcon.classList.remove('hide');
        cartPopup.classList.remove('cart-popup-wrapper--hidden');
        buttonLoader.classList.add('hide');
        const itemCount = items.map(el => el.quantity).reduce((acc, curr) => acc + curr);
        cartCount.innerHTML = itemCount;
        cartPopupCount.innerHTML = itemCount;
        cartPopupCountCart.innerHTML = itemCount;
      };

      console.log('In add to cart, initial:', initial);
      // XXX doing an update so delete items first
      // XXX will need a closer look when loading subscriptions
      if (initial.is_loaded) {
        const update = { updates: {} };
        let total_quantity = 1; // one for the main box the rest addons
        initial.quantities.forEach(({ handle, quantity, variant_id }) => {
          update.updates[variant_id] = 0;
          total_quantity += quantity;
        });
        update.updates[option.value] = 0;
        postFetch('/cart/update.js', update)
          .then(data => {
            cartCount.innerHTML = initialCount - total_quantity;
            postFetch('/cart/add.js', { items })
              .then(data => {
                onFinish(data, items);
              });
          });
      } else {
        postFetch('/cart/add.js', { items })
          .then(data => {
            onFinish(data, items);
          });
      }
      e.preventDefault();
      e.stopPropagation();
      return false;
    };
    form.addEventListener('submit', submitHandler);
    return () => {
      form.removeEventListener('submit', submitHandler);
    };
  }, []);


  console.log('App wrapper', Client.cache.data.data);
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
          }

          return <App shopify_id={shopify_id} />;
        }}
      </Get>
    </ApolloProvider>
  );
};
