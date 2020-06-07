import React, { useEffect, useState, useCallback } from 'react';
import { Query } from 'react-apollo';
import { Products } from './Products';

export const BoxListing = ({ productList, addOnProductList }) => {

  const [products, setProducts] = useState(productList);
  const [addOnProducts, setAddOnProducts] = useState(addOnProductList);

  const moveProduct = (product, isAddOn) => {
    console.log(isAddOn, product.title);
  };

  return (
    <React.Fragment>
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
    </React.Fragment>
  );
}

