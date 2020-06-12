import React, { useEffect, useState, useCallback } from 'react';
import {
  Badge,
  InlineError,
  Spinner,
} from '@shopify/polaris';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import { SHOP } from '../../config';
import { numberFormat } from '../../lib';
import { Get } from '../common/Get'

export const Product = ({ index, product, isDragDisabled }) => {

  const ProductWrapper = styled.div` 
    font-size: 0.9em;
    margin-bottom: 0.25em;
    cursor: pointer;
    text-transform: initial;
    letter-spacing: initial;
    text-align: right;
    cursor: ${props => (props.isDragDisabled ? 'pointer' : 'grab')};
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    padding: 0 0.8rem;
    background-color: ${props => (
      props.isAddOn
      ? 'silver'
      : props.isDragDisabled
        ? 'darkseagreen'
        : 'palegreen'
      )};
    border: 0.2rem solid white;
    border-color: ${props => (props.isDragging ? 'darkslategray' : 'white')};
    transition: border-color 0.2s ease;
    border-radius: 2rem;
    line-height: 2rem;
    color: ${props => (props.isAddOn ? '#454f5b' : '#414f3e')};
    font-weight: 400;
  `;

  const ProductItem = ({ product }) => {

    const price = product.isAddOn ? numberFormat(parseInt(product.price) * 0.01) : '';
    return (
      <Draggable
        draggableId={product.id}
        isDragDisabled={isDragDisabled}
        index={index}
      >
        {(provided, snapshot) => (
          <ProductWrapper
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            isDragging={snapshot.isDragging}
            isDragDisabled={isDragDisabled}
            isAddOn={product.isAddOn}
          >
            {product.title} {price}
          </ProductWrapper>
        )}
      </Draggable>
    );
  }
  if (typeof product.variant_id != 'undefined') return <ProductItem product={product} />

  const url = `${SHOP}/products/${product.shopify_handle}.js`;

  return (
    <Get
      url={url}
    >
      {({ loading, error, response }) => {
        if (loading) return <div style={{ height: '20px' }}><Spinner size='small' /></div>
        if (error) return <InlineError>{error.message}</InlineError>
        //product.price = response.variants[0].price;
        product.variant_id = response.variants[0].id;
        product.price = response.price;
        return (
          <ProductItem product={product} />
        )
      }}
    </Get>
  );
}
