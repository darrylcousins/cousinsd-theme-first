import React, { useEffect, useState, useCallback } from 'react';
import {
  Banner,
  Button,
  Icon,
  Frame,
} from '@shopify/polaris';
import {
    QuestionMarkMinor
} from '@shopify/polaris-icons';
import { Query } from 'react-apollo';
import { LoadingTextMarkup } from '../common/LoadingTextMarkup';
import { Modal } from '../common/Modal';
import { BoxListing } from './BoxListing';
import {
  GET_BOX,
} from '../../graphql/queries';

export const Box = ({ id }) => {

  const input = { id };
  const [modalOpen, setModalOpen] = useState(false);
  const toggleModalOpen = useCallback(() => setModalOpen(!modalOpen), [modalOpen]);

  return (
      <Query
        query={GET_BOX}
        variables={{ input }}
        fetchPolicy='no-cache'
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

          const products = data.getBox.products
            .filter(item => item.available);
          const addOnProducts = data.getBox.addOnProducts
            .filter(item => item.available);

          return (
            <div style={{
              margin: '1rem 0',
              display: 'flex',
              width: '100%',
              position: 'relative',
            }}>
              <Modal
                onClose={toggleModalOpen}
                visible={modalOpen}
                content="My help text"/>
              <BoxListing productList={products} addOnProductList={addOnProducts} />
              <div style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
              }}>
                <Button
                  plain
                  onClick={toggleModalOpen}
                >
                  <Icon source={QuestionMarkMinor} color='orange' />
                </Button>
              </div>
            </div>
          )
        }}
      </Query>
  );
}
