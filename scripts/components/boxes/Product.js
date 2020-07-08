import React from 'react';
import styled from 'styled-components';
import { Client } from '../../graphql/client'
import { numberFormat, updateTotalPrice } from '../../lib';
import { ProductWrapper } from './ProductWrapper';
import { GET_CURRENT_SELECTION } from '../../graphql/local-queries';

const Cancel = styled.span` 
  font-size: 1.5em;
  padding-left: 0.5em;
`;

export const Product = ({ product, type, data }) => {

  const price = product.quantity * product.shopify_price;
  const productprice = product.isAddOn ? numberFormat(parseInt(price) * 0.01) : '';
  const quantity = product.quantity > 1 ? ` (${product.quantity}) ` : ' ';
  const removable = (product.isAddOn && type === 'including') || type === 'dislikes'; 
  const icon = removable ? <Cancel>&#215;</Cancel> : '';

  //if (product.id === '110') console.log(Client.cache.data.data);

  const handleRemoveProduct = ({ product }) => {
    let to;
    let from;
    if (type === 'dislikes') {
      from = type;
      to = 'including';
    } else if (type === 'including') {
      to = 'exaddons';
      from = 'addons';
    }

    const current = { ...data.current };
    current[from] = current[from].filter(el => el.id !== product.id);

    const temp = { ...product };
    temp.quantity = 1;
    current[to] = current[to].concat([temp]);

    Client.writeQuery({ 
      query: GET_CURRENT_SELECTION,
      data: { current },
    });

    updateTotalPrice();
  };

  if (!removable) {
    return (
      <ProductWrapper
        isAddOn={product.isAddOn}
        removable={removable}>
          {product.title}{quantity}{productprice}{icon}
      </ProductWrapper>
    );
  } else {
    return (
      <div onClick={ () => handleRemoveProduct({ product }) }>
        <ProductWrapper
          isAddOn={product.isAddOn}
          removable={removable}>
            {product.title}{quantity}{productprice}{icon}
        </ProductWrapper>
      </div>
    );
  }
}

