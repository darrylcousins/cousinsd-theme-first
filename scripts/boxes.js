import React from 'react';
import ReactDOM from 'react-dom';
import { AppProvider } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';

import { AppWrapper } from "./components/AppWrapper"

var form = document.querySelector('form[action="/cart/add"]');
if (form) {
  const cln = form.cloneNode(true);
  const parent = form.parentNode;
  form.remove();
  parent.appendChild(cln);
  //console.log('removing and cloning form');
};

function WrappedApp() {
  return (
    <AppProvider i18n={enTranslations}>
      <AppWrapper />
    </AppProvider>
  );
}

const rootEl = document.getElementById("react-boxes")

rootEl && ReactDOM.render(<WrappedApp />, rootEl)
