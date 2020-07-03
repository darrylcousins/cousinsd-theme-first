import React, { useEffect, useState, useCallback } from 'react';
import {
  Banner,
} from '@shopify/polaris';
import { Query } from '@apollo/react-components';
import { Client } from '../../graphql/client'
import { SHOP_ID } from '../../config';
import { LoadingTextMarkup } from '../common/LoadingTextMarkup';
import { DateSelect } from './DateSelect';
import { Box } from './Box';
import {
  GET_BOXES,
} from '../../graphql/queries';
import {
  GET_INITIAL,
} from '../../graphql/local-queries';

export const App = ({ initial }) => {

  /* XXX my idea is that we can use initial also for subscriptions */

  /* get some existing form elements */
  const button = document.querySelector('button[name="add"]');
  button.setAttribute('disabled', 'disabled');

  if (initial.total_price > 0) {
    const x = (parseFloat(initial.total_price)*.01).toString().padEnd(2, '0');
    document.querySelector('span[data-regular-price]').innerHTML = `$${x}0`;
  };

  const [input, setInput] = useState({
    ShopId: SHOP_ID,
    shopify_id: initial.shopify_id > 0 ? initial.shopify_id : parseInt(
      document.querySelector('form[action="/cart/add"]')
      .getAttribute('id').split('_')[2]
    ),
  });

  /* boxes stuff */
  const [initialData, setInitialData] = useState(initial);
  const [showBox, setShowBox] = useState(false);
  /* end boxes stuff */

  /* delivered date selected from DateSelect */
  const handleSelect = useCallback((data) => {
    const newData = Object.assign(initialData, data);
    // update our data
    Client.writeQuery({
      query: GET_INITIAL,
      data: { initial: newData }
    });
    setInitialData(newData);
    setShowBox(true);
    button.removeAttribute('disabled');
  });

  return (
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

        const boxes = data.getBoxesByShopifyId;

        if (initialData.delivered) {
          const box = boxes.filter((el) => {
            return parseInt(el.delivered) === initialData.delivered;
          });
          if (box.length) initialData.boxId = box[0].id;
        };

        return (
          <div style={{
            paddingBottom: '1rem',
            width: '100%',
            height: '100%',
            position: 'relative',
          }}>
            <DateSelect
              boxes={data.getBoxesByShopifyId}
              initialData={initialData}
              onSelect={handleSelect} />
            <Box
              show={showBox}
              initialData={initialData} />
          </div>
        );
      }}
    </Query>
  );
};
