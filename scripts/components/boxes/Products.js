import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';
import { Product } from './Product';

export const Products = ({ products, id, isProductDragDisabled }) => {

  const ProductList = styled.div` 
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 100px;
    text-align: ${props => (props.addOnList ? 'right' : 'left')};
    margin-right: ${props => (props.addOnList ? '0' : '2em')};
    margin-left: ${props => (props.addOnList ? '2em' : '0')};
    transition: border-color 0.2s ease;
    border-width: 2px;
    border-style: dashed;
    border-radius: 2px;
    border-color: ${props => (props.isDraggingOver ? 'silver' : 'transparent')};
  `;

  const Heading = styled.div` 
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 1rem;
  `;

  const addOnList = id === 'addons' ? true : false;
  const title = id === 'addons' ? 'Available add ins' : 'Produce in box';

  return (
    <Droppable droppableId={id}>
      {(provided, snapshot) => (
        <ProductList
          ref={provided.innerRef}
          {...provided.droppableProps} 
          isDraggingOver={snapshot.isDraggingOver}
          addOnList={addOnList}
        >
          <Heading>{ title }</Heading>
          { products.map((product, index) => (
            <Product
              product={product}
              key={product.id} 
              index={index}
              isDragDisabled={isProductDragDisabled && !product.isAddOn}
            />
          )) }
          {provided.placeholder}
        </ProductList>
      )}
    </Droppable>
  );
}
