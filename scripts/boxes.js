import React from 'react';
import ReactDOM from 'react-dom';

import AppWrapper from "./components/boxes/AppWrapper"

var form = document.querySelector('form[action="/cart/add"]');
if (form) {
    var cln = form.cloneNode(true);
    form.parentNode.replaceChild(cln, form);
};

const rootEl = document.getElementById("react-boxes")

rootEl && ReactDOM.render(<AppWrapper />, rootEl)
