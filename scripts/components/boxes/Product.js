import React from 'react';
import {
  Badge,
  InlineError,
  Spinner,
  Icon,
} from '@shopify/polaris';
import {
    CancelSmallMinor
} from '@shopify/polaris-icons';
import styled from 'styled-components';
import { numberFormat } from '../../lib';
import { Get } from '../common/Get'
import { ProductWrapper } from './ProductWrapper';
import { Cancel } from './Cancel';

export const Product = ({ product, type }) => {

  // type one of including, dislikes, addons
  const ProductItem = ({ product }) => {

    const price = product.quantity * product.price;
    const productprice = product.isAddOn ? numberFormat(parseInt(price) * 0.01) : '';
    const quantity = product.quantity > 1 ? ` (${product.quantity}) ` : ' ';
    const icon = (product.isAddOn && type === 'including') || type === 'dislikes' ? <Cancel>&#215;</Cancel> : ''; 
    return (
      <ProductWrapper isAddOn={product.isAddOn}>
          {product.title}{quantity}{productprice}{icon}
      </ProductWrapper>
    );
  }

  const url = `/products/${product.shopify_handle}.js`;

  // will need this and price values stored back to current XXX how to do fragments?
  if (typeof product.variant_id != 'undefined') return <ProductItem product={product} />

  return (
    <Get
      url={url}
    >
      {({ loading, error, response }) => {
        if (loading) return <div style={{ height: '20px' }}><Spinner size='small' /></div>;
        if (error) return <InlineError>{error.message}</InlineError>;
        //product.price = response.variants[0].price;
        const productCopy = { ...product };
        productCopy.variant_id = response.variants[0].id;
        productCopy.price = response.price;

        const icon = (product.isAddOn && type === 'including') || type === 'dislikes' ? <Cancel>&#215;</Cancel> : ''; 

        return (
          <ProductItem product={productCopy} />
        )
      }}
    </Get>
  );
}

