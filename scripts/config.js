//export const SHOP = 'http://cousinsd-app-test.myshopify.com';
export const SHOP_ID = 1;
//export const HOST = 'https://fast-spire-96062.herokuapp.com';
export const HOST='https://5d3bec5fa448.ngrok.io';

var shop = 'https://cousinsd-app-test.myshopify.com';

if (typeof(LOCAL) !== 'undefined') {
  shop = 'http://localhost:8080/public';
}

export const SHOP = shop;
  
