import React, { useEffect, useState, useCallback } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { Query } from 'react-apollo';
import { nameSort, numberFormat } from '../../lib';
import { Get } from '../common/Get'
import { Products } from './Products';
import { SHOP, SHOP_ID } from '../../config';

export const BoxListing = ({ title, delivered, productList, addOnProductList }) => {

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

  const [loaded, setLoaded] = useState(false);
  const [productCount, setproductCount] = useState(productList.length);

  const [formSubmitted, setFormSubmitted] = useState(false);

  async function postToCart(data) {
    const response = await fetch(`${SHOP}/cart/add.js`,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }
    );
    return response;
  }

  /* listen for submit and send data to cart */
  const form = document.querySelector('form[action="/cart/add"]');
  const button = document.querySelector('button[name="add"]');
  const priceElement = document.querySelector('span[data-regular-price]');
  const buttonLoader = button.querySelector('span[data-loader]');
  const cartIcon = document.querySelector('div[data-cart-count-bubble');
  const cartCount = cartIcon.querySelector('span[data-cart-count]');

  useEffect(() => {
    const submitHandler = (e) => {
      var select = form.elements.id;
      var option = select.options[select.selectedIndex]
      // remove last comma and space
      const deliveryDate = new Date(parseInt(delivered)).toDateString();
      const products = Array.from(allProducts['products']);
      var productString = '';
      products.map(prod => productString += `${prod.title}, `);
      if (productString.length) productString = productString.trim().slice(0, -1);
      const addOns = products.filter(el => el.isAddOn);
      const addOnString = addOns.map(el => el.title).join(', ');
      const items = [];
      addOns.forEach((el) => {
        items.push({
            quantity: 1,
            id: el.variant_id.toString(),
            properties: {
              'Add on product to': `${title} delivered on ${deliveryDate}`
            }
          });
      });
      items.push({
        quantity: 1,
        id: option.value,
        properties: {
          'Delivery Date': 'Wed 17 June 2020',
          'Items': productString,
          'Add on items': addOnString,
        }
      });
      cartCount.innerHtml = parseInt(cartCount.innerHtml) + items.length;
      const count = cartCount.innerHTML.trim() == '' ? 0 : parseInt(cartCount.innerHTML.trim());
      cartCount.innerHTML = count + items.length;
      cartIcon.classList.remove('hide');
      postToCart({ items }).then(data => console.log(data));
      e.preventDefault();
      e.stopPropagation();
      return true;
    };
    form.addEventListener('submit', submitHandler);
    return () => {
      form.removeEventListener('submit', submitHandler);
    };
  }, [allProducts]);

  const onDragStart = (start) => {
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    const startId = source.droppableId;
    const endId = destination.droppableId;

    if (startId == endId) return;

    var product = allProducts[startId]
      .concat(allProducts[endId])
      .find(el =>  el.id === draggableId);

    var start = Array.from(allProducts[startId]);
    var end = Array.from(allProducts[endId]);

    // remove from start
    start = start.filter(el => el.id !== product.id);

    // push to end
    end.push(product);
    end.sort(nameSort);

    const newAll = {};
    newAll[startId] = start;
    newAll[endId] = end;

    if (product.isAddOn) {
      const origPrice = parseFloat(priceElement.innerHTML.trim().slice(1));
      const diff = parseFloat(product.price) * 0.01;
      if (endId == 'products') {
        priceElement.innerHTML = numberFormat(origPrice + diff);
      } else if (endId == 'addons') {
        priceElement.innerHTML = numberFormat(origPrice - diff);
      }
    }

    setAllProducts(newAll);
  };

  const isProductDragDisabled = allProducts['products']
    .filter(el => !el.isAddOn).length < productCount;

  return (
    <DragDropContext
      onDragEnd={onDragEnd}
    >
      <Products
        products={allProducts['products']}
        id={'products'}
        isProductDragDisabled={isProductDragDisabled}
      />
      <Products
        products={allProducts['addons']}
        id={'addons'}
        isProductDragDisabled={false}
      />
    </DragDropContext>
  );
}
