import React, { useEffect, useState, useCallback } from 'react';
import {
  Icon,
} from '@shopify/polaris';
import {
    QuestionMarkMinor
} from '@shopify/polaris-icons';
import { Query } from 'react-apollo';
import { Products } from './Products';

export const BoxListing = ({ productList, addOnProductList }) => {

  const [products, setProducts] = useState(productList);
  const [addOnProducts, setAddOnProducts] = useState(addOnProductList);

  const moveProduct = (product, isAddOn) => {
    console.log(isAddOn, product.title);
  };

  return (
    <div style={{
      margin: '1rem 0',
      display: 'flex',
      width: '100%',
      position: 'relative',
    }}>
      <Products
        products={products}
        isAddOn={false}
        onClick={moveProduct}
      />
      <Products
        products={addOnProducts}
        isAddOn={true}
        onClick={moveProduct}
      />
      <div style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
      }}>
        <Icon source={QuestionMarkMinor} color='blueDark' />
      </div>
    </div>
  );
}

