import React, { useEffect, useState, useCallback } from 'react';
import {
  Banner,
  Button,
  Icon,
  Frame,
} from '@shopify/polaris';
import { Query } from '@apollo/react-components';
import { LoadingTextMarkup } from '../common/LoadingTextMarkup';
import { Client } from '../../graphql/client'
import { ProductList } from './ProductList';
import { SelectDislikes } from './SelectDislikes';
import { checkLengths } from '../../lib';
import {
  GET_BOX,
} from '../../graphql/queries';
import {
  GET_CURRENT_BOX,
} from '../../graphql/local-queries';

export const Box = ({ show, initialData }) => {

  const [input, setInput] = useState(null);
  const [showBox, setShowBox] = useState(show);

  useEffect(() => {
    const id = initialData.boxId;
    if (id) setInput({id});
    if (show) setShowBox(show);
  }, [show]);

  if (!showBox) return null;

  const writeClient = (products) => {
    Client.writeQuery({ 
      query: GET_CURRENT_BOX,
      data: { 
      }
    });
  };

  return (
      <Query
        query={GET_BOX}
        variables={{ input }}
        fetchPolicy='cache'
      >
        {({ loading, error, data, refetch }) => {
          if (loading) { 
            return (
              <div style={{ margin: '1rem 0', width: '100%' }}>
                <LoadingTextMarkup lines={8} />
              </div>
            );
          }
          if (error) { return (
            <Banner status="critical">{error.message}</Banner>
          )}


          /* the objects in the arrays are immutable so cannot add attribute
           * hence doing the json thing to denature the objects
           */
          const boxProducts = JSON.parse(JSON.stringify(data.getBox.products))
            .filter(item => item.available)
            .map(item => {
              item.isAddOn = false;
              return item;
            });
          const AvailAddOns = JSON.parse(JSON.stringify(data.getBox.addOnProducts))
            .filter(item => item.available)
            .map(item => {
              item.isAddOn = true;
              return item;
            });

          const including = (initialData.including.length)
            ? boxProducts.filter(el => initialData.including.indexOf(el.shopify_handle) > -1)
            : boxProducts;
          const addons = AvailAddOns.filter(el => initialData.addons.indexOf(el.shopify_handle) > -1);
          const exaddons = AvailAddOns.filter(el => initialData.addons.indexOf(el.shopify_handle) === -1);
          const dislikes = boxProducts.filter(el => initialData.dislikes.indexOf(el.shopify_handle) > -1);

          try {
            /* checkLengths throws error if not matching
             * however for subscriptions something will need to happen!
             * hence I'll get a reminder
             */
            checkLengths(
              [boxProducts.length, AvailAddOns.length],
              [including.length, addons.length, dislikes.length, exaddons.length]
            );
          } catch(e) { console.error(e) };


          /*
          console.log('addons', addons);
          console.log('exaddons', addons);
          console.log('dislikes', dislikes);
          console.log(boxProducts.length + availAddOns.length);
          console.log(including.length + addons.length + dislikes.length + exaddons.length);
          */
          //writeClient(including);

          return (
            <>
              <ProductList type='boxproducts' />
            </>
          )
        }}
      </Query>
  );
}
            /*
              <SelectDislikes products={including} />
              <ProductList type='dislikes' products={dislikes} />
              <ProductList type='addons' products={addons} />
              <ProductList type='exaddons' products={exaddons} />
              */
