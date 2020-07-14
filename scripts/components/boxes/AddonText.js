import React from 'react';
import {
  TextField,
  Subheading,
} from '@shopify/polaris';
import { Query } from '@apollo/react-components';
import { Client } from '../../graphql/client'
import styled from 'styled-components';
import { AddonQuantity } from './AddonQuantity';
import { Spacer } from '../common/Spacer';
import { Loader } from '../common/Loader';
import { Error } from '../common/Error';
import { nameSort, updateTotalPrice } from '../../lib';
import { GET_CURRENT_SELECTION } from '../../graphql/local-queries';

export const AddonText = () => {

  const ThirdWidth = styled.div`
    width: 30%;
  `;

  const TwoThirdWidth = styled.div`
    width: 140%;
  `;

  const handleClearButton = ({ product }) => {
    const data = Client.readQuery({
      query: GET_CURRENT_SELECTION,
    });
    const current = { ...data.current };
    current.addons = current.addons.filter(el => el.id !== product.id);
    current.addons.sort(nameSort);
    current.exaddons = current.exaddons.concat([product]);
    Client.writeQuery({ 
      query: GET_CURRENT_SELECTION,
      data: { current },
    });
    updateTotalPrice({ product, sum: false });
  };

  return (
    <Query
      query={GET_CURRENT_SELECTION}
    >
      {({ loading, error, data }) => {
        if (loading) return <Loader lines={2} />;
        if (error) return <Error message={error.message} />;
        const addons = data.current.addons;
        if (addons.length > 0) {
          return (
            <React.Fragment>
            <Subheading>Add on products</Subheading>
            { addons.map(el => (
              <React.Fragment key={el.id}>
                <Spacer />
                <TwoThirdWidth>
                  <TextField
                    value={el.title}
                    readOnly={true}
                    clearButton={true}
                    onClearButtonClick={ () => handleClearButton({ product: el }) }
                    connectedRight={
                      <ThirdWidth>
                        <AddonQuantity
                          qty={el.quantity.toString()}
                          id={el.id}
                          data={ data }
                        />
                      </ThirdWidth>
                    }
                  />
                </TwoThirdWidth>
                <Spacer />
              </React.Fragment>
            )) }
            </React.Fragment>
          );
        } else {
          return null;
        }
      }}
    </Query>
  );
}
