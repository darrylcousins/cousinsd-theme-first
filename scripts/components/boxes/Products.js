import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';
import { Product } from './Product';

export const Products = ({ products, addOnList }) => {

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

  const id = addOnList ? 'addons' : 'products';

  console.log(id, products);

  return (
    <Droppable droppableId={id}>
      {(provided, snapshot) => (
        <ProductList
          ref={provided.innerRef}
          {...provided.droppableProps} 
          isDraggingOver={snapshot.isDraggingOver}
          addOnList={addOnList}
        >
          { products.map((product, index) => (
            <Product
              product={product}
              key={product.id} 
              index={index}
            />
          )) }
          {provided.placeholder}
        </ProductList>
      )}
    </Droppable>
  );
}
