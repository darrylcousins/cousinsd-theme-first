import React, { useState, useCallback } from 'react';
import { Product } from './Product';

export const Products = ({ products, isAddOn, onClick }) => {

  let wrapperStyle, prodStyle;
  if (isAddOn) {
    wrapperStyle = { 
      display: 'flex', 
      flexDirection: 'column', 
      width: '100%', 
      textAlign: 'right'
    }
    prodStyle = { 
      marginBottom: '0,25rem', 
      float: 'right',
    }
  } else {
    wrapperStyle = { 
      display: 'flex', 
      flexDirection: 'column', 
      width: '100%', 
    }
    prodStyle = { 
      marginBottom: '0,25rem', 
    }
  }

  return (
    <div style={wrapperStyle}>
      { products.map(product => (
        <div
          key={product.id} 
          style={prodStyle}>
          <Product isAddOn={isAddOn} product={product} onClick={onClick} />
        </div>
      )) }
    </div>
  );
}
