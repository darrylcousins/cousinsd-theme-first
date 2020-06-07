import React, { useEffect, useState, useCallback } from 'react';
import {
  AppProvider,
  Banner,
  Button,
  Card,
  Frame,
} from '@shopify/polaris';
import { ApolloProvider } from '@apollo/react-hooks';
import { Query } from 'react-apollo';
import Client from '../../graphql/client'
import { SHOP_ID } from '../../config';
import { LoadingTextMarkup } from '../common/LoadingTextMarkup';
import { DateSelect } from './DateSelect';
import { Box } from './Box';
import {
  GET_BOXES,
} from '../../graphql/queries';

export const App = () => {

  const [formSubmitted, setFormSubmitted] = useState(false);
  /* load current session cart (don't need to wait for this!)*/
  useEffect(() => {
    fetch(`/cart.js`)
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result);
        },
        (error) => {
          console.log(error);
        }
      )
  }, [])

  /* end load current session cart */

  async function postToCart(data) {
    const response = await fetch('/cart/add.js',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }
    );
    console.log(response);
  }

  /* get the add form on page */
  const form = document.querySelector('form[action="/cart/add"]');
  const button = document.querySelector('button[name="add"]');
  const priceElement = document.querySelector('span[data-regular-price]');

  console.log('price element', priceElement.innerHTML);
  console.log('form action', form.action);
  form.addEventListener('submit',(e) => {
    if (!formSubmitted) {
      setFormSubmitted(true);
      var select = form.elements.id;
      var option = select.options[select.selectedIndex]
      console.log(option.value);
      console.log(e); // already submitted?
      postToCart({
        items: [
          {
            quantity: 1,
            id: 31683438706746
          },
          {
            quantity: 1,
            id: option.value,
            properties: {
              'Delivery Date': 'Wed 17 June 2020',
            }
          },
        ]
      }).then(data => console.log('returned', data));
    };
    e.preventDefault();
  });


  // button.removeAttribute('disabled');
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
