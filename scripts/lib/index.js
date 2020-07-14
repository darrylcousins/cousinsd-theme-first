import { LABELKEYS } from '../config';
import { Client } from '../graphql/client'
import {
  PRODUCT_FULL_FRAGMENT,
  PRODUCT_FRAGMENT,
  GET_INITIAL,
  GET_CURRENT_SELECTION,
} from '../graphql/local-queries';

export const nameSort = (a, b) => {
  const prodA = a.title.toUpperCase();
  const prodB = b.title.toUpperCase();
  if (prodA > prodB) return 1;
  if (prodA < prodB) return -1;
  return 0;
};

export const numberFormat = (amount, currencyCode='NZD') => {
  let amt = parseFloat(amount);
  let locale = 'en-NZ';
  if (currencyCode == 'NZD') locale = 'en-NZ';
  return (
    new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode
    }).format(amt)
  )
};

export const updateTotalPrice = () => {
  const { initial } = Client.readQuery({ 
    query: GET_INITIAL,
  });
  const { current } = Client.readQuery({ 
    query: GET_CURRENT_SELECTION,
  });

  var price = current.box.shopify_price;
  current.addons.map(el => {
    price += el.quantity * el.shopify_price;
  });
  price = numberFormat(price * .01);

  const priceEl = document.querySelector('span[data-regular-price]');
  priceEl.innerHTML = price;
};

export const dateToISOString = (date) => {
  date.setTime(date.getTime() + (12 * 60 * 60 * 1000));
  return date.toISOString().slice(0, 10); // try this out later
};

const arrSum = arr => arr.reduce((a,b) => a + b, 0)
export const checkLengths = (a, b) => {
  if (!(arrSum(a) === arrSum(b))) throw 'Product lengths do not match!!!';
};

export const makeCurrent = ({ current }) => {
  /* the objects in the arrays are immutable so cannot add attribute
   * hence doing the json thing to denature the objects
   */
  const box = current.box;
  const qtys = current.quantities.reduce(
    (acc, curr) => Object.assign(acc, { [`${curr.handle}`]: curr.quantity }),
    {});
  let includeIds = [];
  const boxProducts = JSON.parse(JSON.stringify(box.products))
    .filter(item => item.available)
    .map(item => {
      var quantity = item.shopify_handle in qtys ? qtys[item.shopify_handle] : 1;
      if (current.including.indexOf(item.shopify_handle) > -1) {
        includeIds.push(item.id);
      }
      Client.writeFragment({
        id: item.id,
        fragment: PRODUCT_FRAGMENT,
        data: {
          quantity: quantity,
          isAddOn: false,
        },
      });
      //return box.products.filter(el => el.id === item.id)[0];
      return Client.readFragment({
        id: item.id,
        fragment: PRODUCT_FULL_FRAGMENT,
      });
    });
  const availAddOns = JSON.parse(JSON.stringify(box.addOnProducts))
    .filter(item => item.available)
    .map(item => {
      var quantity = item.shopify_handle in qtys ? qtys[item.shopify_handle] : 1;
      if (current.including.indexOf(item.shopify_handle) > -1) {
        includeIds.push(item.id);
      }
      Client.writeFragment({
        id: item.id,
        fragment: PRODUCT_FRAGMENT,
        data: {
          quantity: quantity,
          isAddOn: true,
        },
      });
      //return box.addOnProducts.filter(el => el.id === item.id)[0];
      return Client.readFragment({
        id: item.id,
        fragment: PRODUCT_FULL_FRAGMENT,
      });
    });

  const including = (current.including.length)
    ? boxProducts.filter(el => current.including.indexOf(el.shopify_handle) > -1)
    : boxProducts;
  // XXX adjust for (qty)
  console.log(current.addons);
  const tempAddOns = current.addons.map(el => {
    const idx = el.indexOf(' ');
    if (idx > -1) return el.slice(0, idx);
    return el;
  });
  const addons = availAddOns.filter(el => tempAddOns.indexOf(el.shopify_handle) > -1);
  const exaddons = availAddOns.filter(el => current.addons.indexOf(el.shopify_handle) === -1);
  const dislikes = boxProducts.filter(el => current.dislikes.indexOf(el.shopify_handle) > -1);

  //console.log('box current', JSON.stringify(current, null, 1));

  // reduce to remove product arrays from box
  const update = {
    box: box,
    delivered: current.delivered,
    including: including,
    addons: addons,
    exaddons: exaddons,
    dislikes: dislikes,
    subscription: current.subscription,
  };
  //console.log('box update', JSON.stringify(update, null, 1));
  return { current: update };
};

export const toHandle = (title) => title.replace(' ', '-').toLowerCase();

export const stringToArray = (arr) => {
  return arr.split(',')
    .map(el => {
      const matches = el.matchAll(/\(\d+\)/g);
      if (matches) {
        let res;
        for (res of matches) continue;
        if (res) return el.slice(0, res.index).trim();
      };
      return el.trim();
    })
    .filter(el => el != '')
    .map(el => toHandle(el));
};

export const makeInitialState = ({ response, path }) => {

  const [delivery_date, p_in, p_add, p_dislikes, subscribed, addprod] = LABELKEYS;
  
  const priceEl = document.querySelector('span[data-regular-price]');
  const price = parseFloat(priceEl.innerHTML.trim().slice(1)) * 100;

  let cart = {
    box_id: 0,
    delivered: '',
    including: [],
    addons: [],
    dislikes: [],
    shopify_title: '',
    shopify_id: 0,
    subscription: false,
    total_price: price,
    quantities: [],
    is_loaded: false,
  };

  console.log(response);

  if (response.items) {
    response.items.forEach((el) => {
      if (el.product_type == 'Veggie Box' && path.indexOf(el.handle)) {
        const total_price = response.total_price; // true total including addons
        const shopify_title = el.title;
        const shopify_id = el.product_id;
        const delivered = el.properties[delivery_date];
        const subscription = subscribed in el.properties ? el.properties[subscribed] : '';
        const including = stringToArray(el.properties[p_in]);
        const addons = stringToArray(el.properties[p_add]);
        console.log('addons in make initial', addons);
        const dislikes = stringToArray(el.properties[p_dislikes]);
        cart = Object.assign(cart, {
          total_price, 
          delivered, 
          shopify_id, 
          shopify_title, 
          including, 
          addons, 
          dislikes, 
          subscription,
          is_loaded: true,
        });
      }
    });
    response.items.forEach((el) => {
      if (el.product_type == 'Box Produce') {
        // Delivery Date: Wed Jul 22 2020
        // Add on product to: Box title
        if (cart.addons.indexOf(el.handle) > -1) {
          const props = el.properties;
          if (addprod in props && delivery_date in props) {
            if (props[delivery_date] === cart.delivered && props[addprod] === cart.shopify_title) {
              cart.quantities.push({
                handle: el.handle,
                quantity: el.quantity,
                variant_id: el.variant_id
              });
            }
          }
        }
      }
    })
  }
  return cart;
};
