import React from 'react';
import ReactDOM from 'react-dom';

import { App } from "./components/boxes/App"

var form = document.querySelector('form[action="/cart/add"]');
if (form) {
    var cln = form.cloneNode(true);
    form.parentNode.replaceChild(cln, form);
};

const rootEl = document.getElementById("react-boxes")

rootEl && ReactDOM.render(<App />, rootEl)
