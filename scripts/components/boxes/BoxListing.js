import React, { useEffect, useState, useCallback } from 'react';
import { Subscription } from './Subscription';
import { ProductList } from './ProductList';

export const BoxListing = ({ options, title, delivered, productList, addOnProductList }) => {

  /* options are from existing cart or null values:
  {delivered, including, addons, removed}
  */
  const [subscribed, setSubscribed] = useState('onetime');
  const handleSubscriptionChange = useCallback(
    (_checked, newValue) => setSubscribed(newValue),
    [],
  );

  const [allProducts, setAllProducts] = useState({
    'products': productList,
    'addons': addOnProductList,
  });

  const handleProductsChange = useCallback((allProducts) => {
    console.log('updating on change', allProducts);
    setAllProducts(allProducts);
  }, [],
  );

  useEffect(() => {
    let addons = Array();
    let products = Array();
    addOnProductList.forEach((el) => {
      let pushed = false;
      if (options.addons) {
        if (options.addons.indexOf(el.title) > -1) {
          products.push(el);
          pushed = true;
        }
      }
      if (options.including) {
        if (options.including.indexOf(el.title) > -1) {
          products.push(el);
          pushed = true;
        }
      }
      if (!pushed) {
        addons.push(el);
      }
    });
    productList.forEach((el) => {
      let pushed = false;
      if (options.addons) {
        if (options.addons.indexOf(el.title) > -1) {
          products.push(el);
          pushed = true;
        }
      }
      if (options.including) {
        if (options.including.indexOf(el.title) > -1) {
          products.push(el);
          pushed = true;
        }
      }
      if (options.removed) {
        if (options.removed.indexOf(el.title) > -1) { 
          addons.push(el); pushed = true;
        }
      }
      if (!pushed) {
        products.push(el);
      }
    });
    handleProductsChange({
      'products': products,
      'addons': addons,
    });
  }, []);

  async function postToCart(data) {
    const response = await fetch(`/cart/add.js`,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }
    );
    return response;
  }

  /* listen for submit and send data to cart */
  const form = document.querySelector('form[action="/cart/add"]');
  const cartIcon = document.querySelector('div[data-cart-count-bubble');
  const cartCount = cartIcon.querySelector('span[data-cart-count]');

  useEffect(() => {
    const submitHandler = (e) => {
      var select = form.elements.id;
      var option = select.options[select.selectedIndex]

      const deliveryDate = new Date(parseInt(delivered)).toDateString();

      console.log(JSON.stringify(allProducts, null, 2));

      const products = allProducts['products'].filter(el => !el.isAddOn);
      const productString = products.map(el => el.title).join(', ');

      const addOns = allProducts['products'].filter(el => el.isAddOn);
      const addOnString = addOns.map(el => el.title).join(', ');

      const removed = allProducts['addons'].filter(el => !el.isAddOn);
      const removedString = removed.map(el => el.title).join(', ');

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
      const properties = {
        'Delivery Date': `${deliveryDate}`,
        'Including': productString,
        'Add on items': addOnString,
        'Removed items': removedString,
      }
      if (subscribed == 'subscribe') {
        properties['Subscription'] = 'Weekly';
      }
      console.log('properties', properties);
      items.push({
        quantity: 1,
        id: option.value,
        properties: properties,
      });
      cartCount.innerHtml = parseInt(cartCount.innerHtml) + items.length;
      const count = cartCount.innerHTML.trim() == '' ? 0 : parseInt(cartCount.innerHTML.trim());
      cartCount.innerHTML = count + items.length;
      cartIcon.classList.remove('hide');
      postToCart({ items })
        .then(() => {
          data => console.log(data);
          cartIcon.classList.add('hide');
        });
      e.preventDefault();
      e.stopPropagation();
      return true;
    };
    form.addEventListener('submit', submitHandler);
    return () => {
      form.removeEventListener('submit', submitHandler);
    };
  }, [allProducts]);

  return (
    <>
      <div style={{
        margin: '1rem 0',
        display: 'flex',
        width: '100%',
        position: 'relative',
      }}>
      </div>
        <ProductList products={allProducts['products']} />
        <ProductList products={allProducts['addons']} />
      <div style={{
        margin: '1rem 0',
        display: 'flex',
        width: '100%',
        position: 'relative',
      }}>
        <Subscription
          state={subscribed}
          handleChange={handleSubscriptionChange} />
      </div>
    </>
  );
}
