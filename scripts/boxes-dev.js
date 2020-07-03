import React from 'react';
import ReactDOM from 'react-dom';
import { AppProvider } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import '@shopify/polaris/styles.css';

import { AppWrapper } from "./components/boxes/AppWrapper"

function WrappedApp() {
  return (
    <AppProvider i18n={enTranslations}>
      <AppWrapper />
    </AppProvider>
  );
}

const rootEl = document.getElementById("react-boxes")

rootEl && ReactDOM.render(<WrappedApp />, rootEl)
