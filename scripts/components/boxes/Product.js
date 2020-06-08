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
  `;

  if (product.id == '16' || product.id == '4') {
    console.log(product.title, product.isAddOn);
  }

  return (
    <Draggable
      draggableId={product.id}
      index={index}
    >
      {(provided) => (
        <Wrapper
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
        <div>
          { product.isAddOn && (
            <Badge progress='incomplete'>
              {product.id} {product.title} {numberFormat(product.shopify_price)}
            </Badge>
          )}
          { !product.isAddOn && (
            <Badge progress='complete' status='success'>
              {product.id} {product.title}
            </Badge>
          )}
      </div>
        </Wrapper>
      )}
    </Draggable>
  );
}
