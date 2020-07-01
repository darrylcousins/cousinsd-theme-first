import React, { useEffect, useState, useCallback } from 'react';
import {
  AppProvider,
  Banner,
  Button,
  Card,
  Frame,
  Icon,
  Spinner,
} from '@shopify/polaris';
import {
    QuestionMarkMinor
} from '@shopify/polaris-icons';
import { ApolloProvider } from '@apollo/react-hooks';
import { Query } from 'react-apollo';
import Client from '../../graphql/client'
import { SHOP, SHOP_ID } from '../../config';
import { LoadingTextMarkup } from '../common/LoadingTextMarkup';
import { DateSelect } from './DateSelect';
import { Modal } from '../common/Modal';
import { Box } from './Box';
import { Get } from '../common/Get';
import { HelpStart } from '../common/HelpStart';
import {
  GET_BOXES,
} from '../../graphql/queries';

export const App = () => {

  /* get some existing form elements */
  /* get the add form on page */
  const form = document.querySelector('form[action="/cart/add"]');
  const button = document.querySelector('button[name="add"]');

  // get the selected product id
  const shopify_id = form.getAttribute('id').split('_')[2];
  const input = {
    shopify_id: parseInt(shopify_id),
    ShopId: SHOP_ID,
  };
  /* end get the add form on page */

  /* boxes stuff */
  const [delivered, setDelivered] = useState(null);
  const [id, setId] = useState(0);
  const [title, setTitle] = useState('');
  /* end boxes stuff */

  /* modal stuff */
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(() => {});
  const toggleModalOpen = useCallback(() => setModalOpen(!modalOpen), [modalOpen]);
  /* modal stuff */

  const showInitial = () => {
    setModalContent(HelpStart);

    setModalOpen(true);
    setTimeout(() => {
      setModalOpen(false);
      
    }, 3000);
  };

  const [options, setOptions] = useState({});

  useEffect(() => {
  fetch('/cart.js')
    .then(async response => await response.json())
    .then(data => {
      console.log(data);
      if (data.items) {
        data.items.forEach((el, idx) => {
          if (el.product_type == 'Veggie Box' && window.location.pathname.split('/').indexOf(el.handle)) {
            console.log(JSON.stringify(el.properties));
            const delivered = new Date(el.properties['Delivery Date']).getTime();
            const including = el.properties['Including'].split(',').map(el => el.trim()).filter(el => el != '');
            const addons = el.properties['Add on items'].split(',').map(el => el.trim()).filter(el => el != '');
            const removed = el.properties['Removed items'].split(',').map(el => el.trim()).filter(el => el != '');
            setOptions({delivered, including, addons, removed});
            setDelivered(delivered);
            console.log(delivered);
          };
        });
      };
    });
  }, []);

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

            const boxes = data.getBoxesByShopifyId;

            const handleSelect = ({ title, delivered, id }) => {
              setDelivered(delivered);
              setId(id);
              setTitle(title);
              showInitial();
              button.removeAttribute('disabled');
            };

            //console.log(JSON.stringify(options, null, 2));
            //console.log(JSON.stringify(data, null, 2));
            if (delivered) {
              boxes.forEach((item) => {
                if (item.delivered == delivered) {
                  setId(item.id);
                  setTitle(item.title);
                };
              });
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
                <DateSelect delivered={delivered} boxes={data.getBoxesByShopifyId} onSelect={handleSelect} />
                { delivered && id && <Box
                  options={options}
                  title={title}
                  delivered={delivered}
                  id={ id } /> }
                <Modal
                  onClose={toggleModalOpen}
                  visible={modalOpen}
                  content={modalContent}
                />
                <div style={{
                  position: 'relative',
                  textAlign: 'right',
                }}>
                    <Button
                      plain={true}
                      onClick={toggleModalOpen}
                    >
                      <Icon source={QuestionMarkMinor} color='orange' />
                    </Button>
                </div>
              </div>
            );
          }}
        </Query>
      </ApolloProvider>
    </AppProvider>
  );
}

  /*
  <Get
    url={`${SHOP}/cart.js`}
  >
    {({ loading, error, response }) => {
      if (loading) return <Spinner />
      if (error) return <Banner status='critical'>{ JSON.stringify(error, null, 2) }></Banner>
      if (response) return <pre>{JSON.stringify(response, null, 2)}</pre>
    }}
  </Get>
  */
