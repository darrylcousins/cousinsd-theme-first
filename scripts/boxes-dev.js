import React from 'react';
import ReactDOM from 'react-dom';
import { AppProvider } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import '@shopify/polaris/styles.css';

import { AppWrapper } from "./components/AppWrapper"

function WrappedApp() {
  return (
    <AppProvider i18n={enTranslations}>
      <AppWrapper />
    </AppProvider>
  );
}

var form = document.querySelector('form[action="/cart/add"]');
if (form) {
    var cln = form.cloneNode(true);
    form.parentNode.replaceChild(cln, form);
};

const rootEl = document.getElementById("react-boxes")

rootEl && ReactDOM.render(<WrappedApp />, rootEl)
