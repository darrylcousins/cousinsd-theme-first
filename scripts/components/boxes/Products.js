import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';
import { Product } from './Product';

export const Products = ({ products, addOnList }) => {

  const Wrapper = styled.div` 
      display: flex;
      flex-direction: column;
      width: 100%;
      text-align: ${addOnList ? 'right' : 'left'}
    `;

  const id = addOnList ? 'addons' : 'products';

  return (
    <Droppable droppableId={id}>
      {(provided) => (
        <Wrapper
          ref={provided.innerRef}
          {...provided.droppableProps} 
        >
          { products.map((product, index) => (
            <Product
              product={product}
              key={product.id} 
              index={index}
            />
          )) }
          {provided.placeholder}
        </Wrapper>
      )}
    </Droppable>
  );
}
