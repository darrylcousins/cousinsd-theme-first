import React, { useState } from 'react';
import { Query } from '@apollo/react-components';
import { Client } from '../../graphql/client'
import { SHOP_ID } from '../../config';
import { Loader } from '../common/Loader';
import { Error } from '../common/Error';
import { DateSelect } from './DateSelect';
import { Box } from './Box';
import { makeProductArrays, numberFormat } from '../../lib';
import {
  GET_BOXES,
} from '../../graphql/queries';
import {
  GET_INITIAL,
  GET_CURRENT_SELECTION,
} from '../../graphql/local-queries';

export const App = ({ shopify_id }) => {

  /* XXX my idea is that we can use the initial data not only for reloading a
   * cart item but also for subscriptions
   */

  const [loaded, setLoaded] = useState(false);

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
              if (initial.delivered > 0) {
                var box = boxes.filter(el => parseInt(el.delivered) === initial.delivered);
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
                  };
                  var { current } = makeProductArrays({ current: start });
                  Client.writeQuery({ 
                    query: GET_CURRENT_SELECTION,
                    data: { current },
                  });
                }
                setLoaded(true);
                console.log(Client.readQuery({ 
                  query: GET_INITIAL,
                }));

                /* get some existing form elements */
                const button = document.querySelector('button[name="add"]');
                button.removeAttribute('disabled');

              };
              /*
              console.log(Client.cache.data.data);
              console.log('reading from client', Client.readQuery({
                query: GET_CURRENT_SELECTION,
              }));
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
