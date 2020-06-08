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

export const Product = ({ index, product }) => {

  const Wrapper = styled.div` 
    margin-bottom: 0.25em;
    cursor: pointer;
    text-transform: initial;
    letter-spacing: initial;
    text-align: right;
    cursor: grab;
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    padding: 0 0.8rem;
    background-color: ${props => (props.isAddOn ? '#dfe3e8' : 'palegreen')};
    border: 0.2rem solid white;
    border-color: ${props => (props.isDragging ? 'darkslategray' : 'white')};
    transition: border-color 0.2s ease;
    border-radius: 2rem;
    line-height: 2rem;
    color: ${props => (props.isAddOn ? '#454f5b' : '#414f3e')};
    font-weight: 400;
  `;

  const price = product.isAddOn ? numberFormat(product.shopify_price) : '';

  return (
    <Draggable
      draggableId={product.id}
      index={index}
    >
      {(provided, snapshot) => (
        <Wrapper
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          isDragging={snapshot.isDragging}
          isAddOn={product.isAddOn}
        >
              {product.id} {product.title} {price}
        </Wrapper>
      )}
    </Draggable>
  );
}
