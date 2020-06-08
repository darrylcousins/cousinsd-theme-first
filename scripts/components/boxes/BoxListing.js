import React, { useEffect, useState, useCallback } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { Query } from 'react-apollo';
import { nameSort, numberFormat } from '../../lib';
import { Products } from './Products';
import { SHOP, SHOP_ID } from '../../config';

export const BoxListing = ({ productList, addOnProductList }) => {

  addOnProductList.forEach((el, idx) => {
    addOnProductList[idx].isAddOn = true;
  });

  productList.forEach((el, idx) => {
    productList[idx].isAddOn = false;
  });

  const [allProducts, setAllProducts] = useState({
    'products': productList,
    'addons': addOnProductList,
  });
  console.log(allProducts);

  const [products, setProducts] = useState(productList);
  const [addOnProducts, setAddOnProducts] = useState(addOnProductList);
  const [loaded, setLoaded] = useState(false);

  /*
  useEffect(() => {
    addOnProductList.forEach((el, idx) => {
      addOnProductList[idx].isAddOn = true;
    });
    setAddOnProducts(addOnProductList);

    productList.forEach((el, idx) => {
      productList[idx].isAddOn = false;
    });
    setProducts(productList);
  }, [products, addOnProducts])
    */

  const [formSubmitted, setFormSubmitted] = useState(false);

  async function postToCart(data) {
    const response = await fetch(`${SHOP}/cart/add.js`,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }
    );
    console.log(response);
  }

  /* get the add form on page */
  const form = document.querySelector('form[action="/cart/add"]');
  const button = document.querySelector('button[name="add"]');
  const priceElement = document.querySelector('span[data-regular-price]');

  /* listen for submit and send data to cart */
  form.addEventListener('submit',(e) => {
    if (!formSubmitted) {
      setFormSubmitted(false);
      var select = form.elements.id;
      var option = select.options[select.selectedIndex]
      e.preventDefault();
      var productString = '';
      products.map(prod => productString += `${prod.title}, `);
      // remove last comma and space
      if (productString.length) productString = productString.trim().slice(0, -1);
      postToCart({
        items: [
          {
            quantity: 1,
            id: 4483550675002
          },
          {
            quantity: 1,
            id: option.value,
            properties: {
              'Delivery Date': 'Wed 17 June 2020',
              'Items': productString,
              'Add on item': 'Agria Potatoes',
            }
          },
        ]
      }).then(data => console.log('returned', data));
    };
  });

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId == source.droppableId) return;

    var product = products.concat(addOnProducts).find(el =>  el.id === draggableId);

    var tempProds;

    const calcDest = (destination, source) => {
      if (destination === 'products' && source === 'addons') return 'Products';
      if (destination === 'addons' && source === 'products') return 'AddOns';
      return false;
    };

    const dest = calcDest(destination.droppableId, source.droppableId);
    console.log(dest, product.id, product.isAddOn, product.title);

    if (dest === 'Products' && product.isAddOn) {
      tempProds = products
        .filter(el => el.id !== product.id);
      tempProds.push(product);
      setProducts(tempProds.sort(nameSort));

      setAddOnProducts(
        addOnProductList
          .filter(el => el.id !== product.id)
      );

      priceElement.innerHTML = numberFormat(
        parseFloat(priceElement.innerHTML.slice(1)) + parseFloat(product.shopify_price)
      );
    }
    if (dest === 'Products' && !product.isAddOn) {
      tempProds = products
        .filter(el => el.id !== product.id);
      tempProds.push(product);
      setProducts(tempProds.sort(nameSort));

      setAddOnProducts(
        addOnProductList
          .filter(el => el.id !== product.id)
      );
    }
    if (dest === 'AddOns' && product.isAddOn) {
      tempProds = addOnProducts
        .filter(el => el.id !== product.id);
      tempProds.push(product);
      setAddOnProducts(tempProds.sort(nameSort));

      setProducts(
        productList
          .filter(el => el.id !== product.id)
      );

      priceElement.innerHTML = numberFormat(
        parseFloat(priceElement.innerHTML.slice(1)) - parseFloat(product.shopify_price)
      );
    }
    if (dest === 'AddOns' && !product.isAddOn) {
      tempProds = addOnProducts
        .filter(el => el.id !== product.id);
      tempProds.push(product);
      setAddOnProducts(tempProds.sort(nameSort));

      setProducts(
        productList
          .filter(el => el.id !== product.id)
      );
    }
  };

  return (
    <DragDropContext
      onDragEnd={onDragEnd}
    >
      <Products
        products={products}
        addOnList={false}
      />
      <Products
        products={addOnProducts}
        addOnList={true}
      />
    </DragDropContext>
  );
}
