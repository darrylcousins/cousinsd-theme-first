import React, { useCallback, useState } from 'react';
import { Query } from '@apollo/react-components';
import { Client } from './../graphql/client'
import { SHOP_ID } from './../config';
import { Loader } from './common/Loader';
import { Error } from './common/Error';
import { DateSelect } from './boxes/DateSelect';
import { Subscription } from './boxes/Subscription';
import { Box } from './boxes/Box';
import { Spacer } from './common/Spacer';
import { makeCurrent, numberFormat } from './../lib';
import {
  GET_BOXES,
} from './../graphql/queries';
import {
  GET_INITIAL,
  GET_CURRENT_SELECTION,
} from './../graphql/local-queries';

export const App = ({ shopify_id }) => {

  /* XXX my idea is that we can use the initial data not only for reloading a
   * cart item but also for subscriptions
   */

  const [loaded, setLoaded] = useState(false);

  /* subscription selector */
  const handleSubscriptionChange = (subscription) => {
    const { current } = Client.readQuery({ 
      query: GET_CURRENT_SELECTION,
    });
    const update = { ...current };
    update.subscription = subscription;
    Client.writeQuery({ 
      query: GET_CURRENT_SELECTION,
      data: { current: update },
    });
    console.log('reading selection from client', Client.readQuery({
      query: GET_CURRENT_SELECTION,
    }));
  };
  /* end subscription selector */

  return (
    <Query
      query={GET_INITIAL}
    >
      {({ loading, error, data }) => {
        if (loading) return <Loader lines={4} />;
        if (error) return <Error message={error.message} />;

        const { initial } = data;

        if (initial.total_price > 0) {
          const price = (numberFormat(parseInt(initial.total_price) * 0.01));
          document.querySelector('span[data-regular-price]').innerHTML = price;
        }

        const input = {
          ShopId: SHOP_ID,
          shopify_id: shopify_id,
        };

        return (
          <Query
            query={GET_BOXES}
            variables={{ input }}
            fetchPolicy='cache'
          >
            {({ loading, error, data }) => {
              if (loading) return <Loader lines={4} />;
              if (error) return <Error message={error.message} />;

              const boxes = data.getBoxesByShopifyId;
              const initialCopy = JSON.parse(JSON.stringify(initial));

              // we re running a stored box (cart or subscription)
              if (initialCopy.delivered.length > 0) {
                var box = boxes.filter(el => new Date(Date.parse((initialCopy.delivered))).getTime() === parseInt(el.delivered));
                if (box.length > 0) initialCopy.box_id = box[0].id;
              }

              const handleSelect = (initial) => {
                Client.writeQuery({ 
                  query: GET_INITIAL,
                  data: { initial },
                });
                var temp = boxes.filter(el => el.id === initial.box_id);
                if (temp.length > 0) {
                  var box = temp[0];
                  var start = {
                    box,
                    delivered: initial.delivered,
                    including: initial.including,
                    addons: initial.addons,
                    exaddons: [],
                    dislikes: initial.dislikes,
                    quantities: initial.quantities,
                    subscription: initial.subscription,
                  };
                  var { current } = makeCurrent({ current: start });
                  Client.writeQuery({ 
                    query: GET_CURRENT_SELECTION,
                    data: { current },
                  });
                }
                setLoaded(true);

                //console.log(Client.cache.data.data);
                console.log('reading initial from client', Client.readQuery({
                  query: GET_INITIAL,
                }));
                console.log('reading current from client', Client.readQuery({
                  query: GET_CURRENT_SELECTION,
                }));

                /* get some existing form elements */
                const button = document.querySelector('button[name="add"]');
                button.removeAttribute('disabled');
                // loaded existing cart or subscription values
                if (initial.is_loaded) {
                  button.querySelector('[data-add-to-cart-text]').innerHTML = 'Update selection';
                };

              };
              /*
              */

              return (
                <div style={{
                  paddingBottom: '1rem',
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                }}>
                <DateSelect
                  boxes={boxes}
                  initialData={initialCopy}
                  onSelect={handleSelect} />
                <Box
                  loaded={loaded}
                  />
                <Spacer />
                <Subscription
                  state={initial.subscription}
                  handleChange={handleSubscriptionChange} />
                </div>
              );
            }}
          </Query>
        )
      }}
    </Query>
  );
};
/*
                <Box
                  loaded={loaded}
                  />
                  */
