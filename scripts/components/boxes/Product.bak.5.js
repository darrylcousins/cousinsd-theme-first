import React from 'react';
import { CancelSmallMinor } from '@shopify/polaris-icons';
import styled from 'styled-components';
import { Query } from '@apollo/react-components';
import { Loader } from '../common/Loader';
import { Error } from '../common/Error';
import { Client } from '../../graphql/client'
import { numberFormat } from '../../lib';
import { Get } from '../common/Get'
import { ProductWrapper } from './ProductWrapper';
import { GET_CURRENT_SELECTION } from '../../graphql/local-queries';

const Cancel = styled.span` 
  font-size: 1.5em;
  padding-left: 0.5em;
`;

export const Product = ({ product, type }) => {

  const price = product.quantity * product.shopify_price;
  const productprice = product.isAddOn ? numberFormat(parseInt(price) * 0.01) : '';
  const quantity = product.quantity > 1 ? ` (${product.quantity}) ` : ' ';
  const removable = (product.isAddOn && type === 'including') || type === 'dislikes'; 
  const icon = removable ? <Cancel>&#215;</Cancel> : '';

  const handleRemoveProduct = ({ product, data, type }) => {
    const from = type;
    let to;
    if (type === 'dislikes') to = 'including';
    if (type === 'including') to = 'exaddons';

    const current = { ...data.current };
    current[from] = current[from].filter(el => el.id !== product.id);
    current[to] = current[to].concat([product]);
    Client.writeQuery({ 
      query: GET_CURRENT_SELECTION,
      data: { current },
    });
  };

  return (
    <Query
      query={GET_CURRENT_SELECTION}
    >
      {({ loading, error, data }) => {
        if (loading) return <Loader lines={2} />;
        if (error) return <Error message={error.message} />;

        if (!removable) {
          return (
            <ProductWrapper isAddOn={product.isAddOn} removable={removable}>
                {product.title}{quantity}{productprice}{icon}
            </ProductWrapper>
          );
        } else {
          return (
            <div onClick={ (e) => handleRemoveProduct({ product, data, type }) }>
              <ProductWrapper isAddOn={product.isAddOn} removable={removable}>
                  {product.title}{quantity}{productprice}{icon}
              </ProductWrapper>
            </div>
          );
        };
      }}
    </Query>
  );
}

