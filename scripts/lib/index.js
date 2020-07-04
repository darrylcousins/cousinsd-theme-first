import { LABELKEYS } from '../config';
export const nameSort = (a, b) => {
  const prodA = a.title.toUpperCase();
  const prodB = b.title.toUpperCase();
  if (prodA > prodB) return 1;
  if (prodA < prodB) return -1;
  return 0;
}

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
}

export const dateToISOString = (date) => {
  date.setTime(date.getTime() + (12 * 60 * 60 * 1000));
  return date.toISOString().slice(0, 10); // try this out later
}

const arrSum = arr => arr.reduce((a,b) => a + b, 0)
export const checkLengths = (a, b) => {
  if (!(arrSum(a) === arrSum(b))) throw 'Product lengths do not match!!!';
};

export const makeProductArrays = ({ box, current }) => {
  /* the objects in the arrays are immutable so cannot add attribute
   * hence doing the json thing to denature the objects
   */
  var ids = [];
  var qtys = current.quantities.reduce(
    (acc, curr) => Object.assign(acc, { [`${curr.handle}`]: curr.quantity }),
    {});
  const boxProducts = JSON.parse(JSON.stringify(box.products))
    .filter(item => item.available)
    .map(item => {
      console.log(item);
      ids.push(item.shopify_id);
      var handle = item.shopify_handle;
      item.isAddOn = false;
      item.quantity = handle in qtys ? qtys[handle] : 1;
      return item;
    });
  const availAddOns = JSON.parse(JSON.stringify(box.addOnProducts))
    .filter(item => item.available)
    .map(item => {
      ids.push(item.shopify_id);
      var handle = item.shopify_handle;
      item.isAddOn = true;
      item.quantity = handle in qtys ? qtys[handle] : 1;
      return item;
    });

  const including = (current.including.length)
    ? boxProducts.filter(el => current.including.indexOf(el.shopify_handle) > -1)
    : boxProducts;
  const addons = availAddOns.filter(el => current.addons.indexOf(el.shopify_handle) > -1);
  const exaddons = availAddOns.filter(el => current.addons.indexOf(el.shopify_handle) === -1);
  const dislikes = boxProducts.filter(el => current.dislikes.indexOf(el.shopify_handle) > -1);

  //console.log('box current', JSON.stringify(current, null, 1));

  // reduce to remove product arrays from box
  const boxCopy = {
    id: box.id,
    title: box.title,
    delivered: box.delivered,
    shopify_gid: box.shopify_gid,
    shopify_id: box.shopify_id,
    shopify_handle: box.shopify_handle,
    shopify_title: box.shopify_title,
    __typename: "Box"
  }
  const update = {
    box: boxCopy,
    delivered: current.delivered,
    including: including,
    addons: addons,
    exaddons: exaddons,
    dislikes: dislikes,
  };
  //console.log('box update', JSON.stringify(update, null, 1));
  return { ids, current: update };
};

export const makeInitialState = ({ response, path }) => {

  const [delivery_date, p_in, p_add, p_dislikes, subscription, addprod] = LABELKEYS;

  let cart = {
    box_id: 0,
    delivered: null,
    including: [],
    addons: [],
    dislikes: [],
    shopify_title: '',
    shopify_id: 0,
    subscribed: false,
    total_price: 0,
    quantities: [],
  };

  const toHandle = (title) => title.replace(' ', '-').toLowerCase();

  if (response.items) {
    response.items.forEach((el, idx) => {
      if (el.product_type == 'Veggie Box' && path.indexOf(el.handle)) {
        const total_price = response.total_price; // true total including addons
        const shopify_title = el.title;
        const shopify_id = el.product_id;
        const delivered = new Date(el.properties[delivery_date]).getTime();
        const subscribed = subscription in el.properties ? true : false;
        const including = el.properties[p_in].split(',')
          .map(el => el.trim())
          .filter(el => el != '')
          .map(el => toHandle(el));
        const addons = el.properties[p_add].split(',')
          .map(el => el.trim())
          .filter(el => el != '')
          .map(el => toHandle(el));
        const dislikes = el.properties[p_dislikes].split(',')
          .map(el => el.trim())
          .filter(el => el != '')
          .map(el => toHandle(el));
        cart = Object.assign(cart, {
          total_price, 
          delivered, 
          shopify_id, 
          shopify_title, 
          including, 
          addons, 
          dislikes, 
          subscribed,
        });
      };
    });
    response.items.forEach((el, idx) => {
      if (el.product_type == 'Box Produce') {
        //Small Box delivered on Wed Jul 22 2020
        if (cart.addons.indexOf(el.handle) > -1) {
          if (addprod in el.properties) {
            const str = el.properties[addprod];
            const len = str.length;
            const d = new Date(str.slice(len-15)).getTime();
            if (d === cart.delivered) {
              cart.quantities.push({handle: el.handle, quantity: el.quantity });
            };
          };
        };
      };
    });
  };
  return cart;
};
